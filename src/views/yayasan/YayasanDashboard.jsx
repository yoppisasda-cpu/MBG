import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  TrendingUp, Award, ShieldCheck, Heart, Tractor, FileText, CheckCircle, 
  Sparkles, RefreshCw, XCircle, AlertTriangle, MessageSquare, Star, MapPin, Clock, Users
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const YayasanDashboard = ({ activeTab = 'overview' }) => {
  const { 
    menu, kitchens, attendance, deliveries, feedback, suppliers, approvePO, volunteers,
    yayasans, activeYayasanId, operationalExpenses, addOperationalExpense,
    expenseCategories, addExpenseCategory, weeklyMenu, updateWeeklyMenu, addNewMenu
  } = useContext(AppContext);

  const [isGeneratingAiMenu, setIsGeneratingAiMenu] = useState(false);
  const [aiMenuRecommendation, setAiMenuRecommendation] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2026-05-25');

  // Menu Planning & Creation Form States
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuCalorie, setNewMenuCalorie] = useState('');
  const [newMenuProtein, setNewMenuProtein] = useState('');
  const [newMenuFat, setNewMenuFat] = useState('');
  const [newMenuCarb, setNewMenuCarb] = useState('');
  const [newMenuCost, setNewMenuCost] = useState('');
  
  // Custom Recipe Ingredient Inputs (Dynamic Array with Costing Details)
  const [newMenuRecipe, setNewMenuRecipe] = useState([
    { name: '', amount: '', unit: 'g', price: '', priceUnit: 'kg', allocationType: 'portion' }
  ]);

  const calculateRecipeItemCost = (amountStr, unit, priceStr, priceUnit, allocationType = 'portion') => {
    const amount = parseFloat(amountStr) || 0;
    const price = parseFloat(priceStr) || 0;
    let baseCost = 0;
    if (unit === 'g' && priceUnit === 'kg') {
      baseCost = (amount / 1000) * price;
    } else if (unit === 'ml' && priceUnit === 'L') {
      baseCost = (amount / 1000) * price;
    } else {
      baseCost = amount * price; // direct multiplication for eggs/butir
    }
    
    // Scale down to a single portion cost if allocation is Per 100 Portions (Batch)
    if (allocationType === 'batch100') {
      return baseCost / 100;
    }
    return baseCost;
  };

  // State to track selected details menu
  const [selectedDetailsMenuId, setSelectedDetailsMenuId] = useState('');

  // Portion Simulator State
  const [simulatorPortions, setSimulatorPortions] = useState(250);
  const [selectedMenuForSim, setSelectedMenuForSim] = useState('');

  // Weekly Budget Calculator States
  const [weeklyTargetPortions, setWeeklyTargetPortions] = useState(250);
  const [subsidyLimitPerPortion, setSubsidyLimitPerPortion] = useState(15000);

  // Calendar View Switcher & Monthly Planning States
  const [planningView, setPlanningView] = useState('weekly'); // 'weekly' | 'monthly'
  const [selectedMonth, setSelectedMonth] = useState('Mei');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [monthlyPlanning, setMonthlyPlanning] = useState({});

  const getDaysInMonth = (monthName, yearString) => {
    const monthIndexMap = {
      'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3,
      'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7,
      'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
    };
    const month = monthIndexMap[monthName] !== undefined ? monthIndexMap[monthName] : 4;
    const year = parseInt(yearString) || 2026;
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    const tenantMenus = menu.filter(m => m.yayasanId === activeYayasanId);
    if (tenantMenus.length > 0) {
      setMonthlyPlanning(prev => {
        const updated = { ...prev };
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        for (let day = 1; day <= daysInMonth; day++) {
          const key = `${selectedMonth}_${selectedYear}_${day}`;
          if (!updated[key]) {
            const menuObj = tenantMenus[(day - 1) % tenantMenus.length];
            updated[key] = menuObj.id;
          }
        }
        return updated;
      });
    }
  }, [activeYayasanId, menu, selectedMonth, selectedYear]);

  const calculatedRealCogs = newMenuRecipe.reduce((sum, item) => {
    return sum + calculateRecipeItemCost(item.amount, item.unit, item.price, item.priceUnit, item.allocationType);
  }, 0);

  useEffect(() => {
    if (calculatedRealCogs > 0) {
      setNewMenuCost(Math.round(calculatedRealCogs).toString());
    }
  }, [calculatedRealCogs]);

  // Operational Expenses Form States
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Utilitas');
  const [expenseNotes, setExpenseNotes] = useState('');
  const [isAddingCustomCategory, setIsAddingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // 0. Multi-Client Tenant Filtering
  const activeYayasan = yayasans.find(y => y.id === activeYayasanId) || yayasans[0];

  const filteredKitchens = kitchens.filter(k => k.yayasanId === activeYayasanId);
  const filteredAttendance = attendance.filter(a => a.yayasanId === activeYayasanId);
  const filteredDeliveries = deliveries.filter(d => d.yayasanId === activeYayasanId);
  const filteredFeedback = feedback.filter(f => f.yayasanId === activeYayasanId);
  const filteredSuppliers = suppliers.filter(s => s.yayasanId === activeYayasanId);
  const filteredVolunteers = volunteers.filter(v => v.yayasanId === activeYayasanId);
  const filteredMenu = menu.filter(m => m.yayasanId === activeYayasanId);
  const filteredOperationalExpenses = operationalExpenses.filter(op => op.yayasanId === activeYayasanId);
  const filteredWeeklyMenu = weeklyMenu.filter(w => w.yayasanId === activeYayasanId);

  // 1. Calculations for KPIs
  const totalMealsDelivered = filteredDeliveries
    .filter(d => d.status === 'Selesai')
    .reduce((sum, d) => sum + d.porsi, 0);

  const totalMealsPending = filteredDeliveries
    .filter(d => d.status !== 'Selesai')
    .reduce((sum, d) => sum + d.porsi, 0);

  const totalBudgetSpent = filteredSuppliers.reduce((sum, po) => {
    if (po.status === 'Selesai' || po.status === 'Diproses') return sum + po.price;
    return sum;
  }, 0) + filteredOperationalExpenses.reduce((sum, op) => sum + op.amount, 0);

  const localUmkmContribution = filteredSuppliers.reduce((sum, po) => sum + po.price, 0);

  // 2. Charts Data
  const deliveryData = filteredDeliveries.map(d => ({
    name: d.schoolName.substring(0, 10) + '...',
    'Jumlah Porsi': d.porsi,
    'Status': d.status === 'Selesai' ? 100 : d.status === 'Dalam Perjalanan' ? 50 : 10
  }));

  const activeMenu = filteredMenu.find(m => m.id === selectedDetailsMenuId) || filteredMenu[0] || menu[0];
  const nutritionData = [
    { name: 'Karbohidrat (g)', value: activeMenu?.carb || 0, color: '#4f46e5' },
    { name: 'Protein (g)', value: activeMenu?.protein || 0, color: '#10b981' },
    { name: 'Lemak (g)', value: activeMenu?.fat || 0, color: '#f59e0b' }
  ];

  // 3. AI Menu Optimizer Simulation
  const runAiOptimizer = () => {
    setIsGeneratingAiMenu(true);
    setTimeout(() => {
      setIsGeneratingAiMenu(false);
      setAiMenuRecommendation({
        name: 'AI Rekomendasi Menu: Nasi Uduk Merah Gizi Seimbang',
        cost: 13900,
        calorie: 465,
        protein: 28,
        fat: 10,
        carb: 61,
        ingredients: ['Beras Merah Organik', 'Ayam Kukus Suwir', 'Tempe Bacem Madu', 'Sawi Hijau Kukus', 'Jeruk Segar'],
        sourcing: 'Petani beras merah Kec. Kebayoran Lama & MSME Tempe Lokal.',
        savings: 'Menghemat Rp 600,- per porsi (4.1% budget saving)'
      });
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div style={styles.titleBanner}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.4rem' }}>{activeYayasan.logo}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--c-yayasan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {activeYayasan.name}
                </span>
              </div>
              <h2 style={styles.tabHeading}>🏢 Dashboard Evaluasi Program Makro</h2>
              <p style={styles.tabSubheading}>Monitoring real-time dapur {filteredKitchens[0]?.name || 'SPPG'}, penyerapan pangan, dan audit gizi wilayah.</p>
            </div>
            <span className="badge badge-role">{activeYayasan.name}</span>
          </div>

          {/* KPI Widget Row */}
          <div style={styles.kpiGrid}>
            <div className="glass-card" style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>Total Porsi Terkirim</span>
                <CheckCircle size={20} style={{ color: '#10b981' }} />
              </div>
              <span style={styles.kpiValue}>{totalMealsDelivered} <span style={styles.kpiUnit}>Porsi</span></span>
              <span style={styles.kpiSubtitle}>{totalMealsPending} porsi sedang dimasak/dikirim</span>
            </div>

            <div className="glass-card" style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>Dana UMKM Terserap</span>
                <Tractor size={20} style={{ color: '#f59e0b' }} />
              </div>
              <span style={styles.kpiValue}>Rp {(localUmkmContribution / 1000000).toFixed(1)}M <span style={styles.kpiUnit}>Rupiah</span></span>
              <span style={styles.kpiSubtitle}>100% dialokasikan ke petani lokal sekitar</span>
            </div>

            <div className="glass-card" style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>Skor QC Higienitas</span>
                <ShieldCheck size={20} style={{ color: '#0284c7' }} />
              </div>
              <span style={styles.kpiValue}>{filteredKitchens[0]?.score || '0%'} <span style={styles.kpiUnit}>Sanitasi</span></span>
              <span style={styles.kpiSubtitle}>Last QC: {filteredKitchens[0]?.lastQC || 'N/A'}</span>
            </div>

            <div className="glass-card" style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>Anggaran Terpakai</span>
                <FileText size={20} style={{ color: '#e11d48' }} />
              </div>
              <span style={styles.kpiValue}>Rp {(totalBudgetSpent / 1000).toLocaleString('id-ID')}K</span>
              <span style={styles.kpiSubtitle}>Dari total pagu Rp 50.000.000</span>
            </div>
          </div>

          {/* Graphical Charts Section */}
          <div className="grid-cols-2">
            {/* Chart 1: School Distribution */}
            <div className="glass-card" style={styles.chartCard}>
              <h3 style={styles.cardSectionTitle}>🏫 Target Pengiriman Sekolah Harian</h3>
              <div style={{ width: '100%', height: '240px', marginTop: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deliveryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="name" fontSize={11} stroke="var(--text-secondary)" />
                    <YAxis fontSize={11} stroke="var(--text-secondary)" />
                    <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} />
                    <Bar dataKey="Jumlah Porsi" fill="var(--color-role)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Nutrition Composition */}
            <div className="glass-card" style={styles.chartCard}>
              <h3 style={styles.cardSectionTitle}>🥗 Komposisi Zat Gizi Makro Menu Harian</h3>
              <div style={{ width: '100%', height: '240px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={nutritionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {nutritionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Recent Reviews (Social Audit Feed) */}
          <div className="glass-card" style={styles.feedCard}>
            <h3 style={styles.cardSectionTitle}>📢 Feed Audit Sosial Masyarakat (Ulasan Terkini)</h3>
            <div style={styles.feedList}>
              {filteredFeedback.slice(0, 3).map((f) => (
                <div key={f.id} style={styles.feedItem}>
                  <div style={styles.feedAvatar}>
                    <span>{f.schoolName.charAt(0)}</span>
                  </div>
                  <div style={styles.feedContent}>
                    <div style={styles.feedMeta}>
                      <span style={styles.feedUser}>{f.schoolName} ({f.role})</span>
                      <div style={styles.stars}>
                        {[...Array(f.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p style={styles.feedComment}>"{f.comments}"</p>
                    <span style={styles.feedTime}>Dikirim: {f.date}</span>
                  </div>
                  <span className={`badge ${f.type === 'Positif' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.6rem' }}>
                    {f.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tab 2: NUTRITION & MENU */}
      {activeTab === 'nutrition' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Kalender Perencanaan & Penjadwalan Menu (Multi-Mode) */}
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Header Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={styles.cardSectionTitle}>📅 Kalender Perencanaan & Penjadwalan Menu</h2>
                  <p style={styles.tabSubheading}>Jadwalkan menu sehat bergizi gratis (MBG) untuk masing-masing hari operasional dapur.</p>
                </div>
                {planningView === 'monthly' && (
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginLeft: '8px',
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-color)',
                    alignItems: 'center'
                  }}>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                        <option key={m} value={m} style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{m}</option>
                      ))}
                    </select>

                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/</span>

                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {['2026', '2027', '2028'].map(y => (
                        <option key={y} value={y} style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>{y}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                backgroundColor: 'var(--bg-tertiary)',
                padding: '4px',
                borderRadius: '24px',
                border: '1px solid var(--border-color)'
              }}>
                <button
                  onClick={() => setPlanningView('weekly')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    backgroundColor: planningView === 'weekly' ? 'var(--color-role)' : 'transparent',
                    color: planningView === 'weekly' ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  📅 Mode Mingguan
                </button>
                <button
                  onClick={() => setPlanningView('monthly')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    backgroundColor: planningView === 'monthly' ? 'var(--color-role)' : 'transparent',
                    color: planningView === 'monthly' ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  📆 Mode Bulanan
                </button>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(79, 70, 229, 0.04)',
              border: '1px dashed rgba(79, 70, 229, 0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              💡 <strong>Rekomendasi Praktik Terbaik (Best Practice):</strong>
              <div style={{ marginTop: '6px', color: 'var(--text-secondary)' }}>
                • <strong>Perencanaan Menu:</strong> Buat rencana menu untuk <strong>1 bulan kedepan</strong> (Mode Bulanan) untuk menjaga variasi hidangan (agar siswa tidak bosan) serta menjaga stabilitas gizi.<br/>
                • <strong>Pengadaan & PO:</strong> Lakukan eksekusi pembelian bahan baku basah/segar secara <strong>mingguan</strong> guna mengantisipasi perubahan harga pasar yang dinamis dan fluktuasi absen siswa.
              </div>
            </div>

            {/* Mode 1: WEEKLY PLANNER GRID */}
            {planningView === 'weekly' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginTop: '10px'
              }}>
                {filteredWeeklyMenu.map((sched) => {
                  const assignedMenu = filteredMenu.find(m => m.id === sched.menuId) || filteredMenu[0] || menu[0];
                  return (
                    <div key={sched.id} style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1.5px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'transform 0.2s',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                      <div>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          backgroundColor: 'var(--color-role)',
                          color: '#ffffff',
                          borderRadius: '20px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          marginBottom: '8px'
                        }}>
                          {sched.day}
                        </div>
                        
                        <h4 style={{
                          fontSize: '0.82rem',
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          margin: '0 0 6px 0',
                          lineHeight: '1.4',
                          minHeight: '40px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {assignedMenu?.name || 'Belum Ada Menu'}
                        </h4>
                        
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          🔥 {assignedMenu?.calorie || 0} kkal • 🥩 {assignedMenu?.protein || 0}g Pro
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)' }}>GANTI MENU JADWAL</label>
                        <select
                          value={sched.menuId}
                          onChange={(e) => updateWeeklyMenu(sched.day, e.target.value, activeYayasanId)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.75rem',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {filteredMenu.map(m => (
                            <option key={m.id} value={m.id}>{m.name.substring(0, 30)}...</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mode 2: MONTHLY PLANNER CALENDAR GRID */}
            {planningView === 'monthly' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                
                {/* Calendar Days of Week Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '10px',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '8px 4px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)'
                }}>
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((dayName, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>
                      {dayName}
                    </span>
                  ))}
                </div>

                {/* Grid representing number of days in selected month */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: '10px'
                }}>
                  {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map((day) => {
                    // Check if weekend (only Sunday is rest day, Saturday is operational)
                    const isWeekend = day % 7 === 0;
                    
                    if (isWeekend) {
                      return (
                        <div key={day} style={{
                          backgroundColor: 'rgba(0,0,0,0.02)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '10px',
                          opacity: 0.45,
                          minHeight: '105px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)' }}>TGL {day}</span>
                          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Dapur Libur</span>
                        </div>
                      );
                    }

                    // Weekdays & Saturdays
                    const key = `${selectedMonth}_${selectedYear}_${day}`;
                    const dayMenuId = monthlyPlanning[key];
                    const assignedMenu = filteredMenu.find(m => m.id === dayMenuId) || filteredMenu[0] || menu[0];
                    const isHighCost = assignedMenu && assignedMenu.cost > subsidyLimitPerPortion;

                    return (
                      <div key={day} style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: isHighCost ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1.5px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '6px',
                        boxShadow: isHighCost ? '0 0 10px rgba(245, 158, 11, 0.05)' : 'none',
                        transition: 'all 0.2s',
                        minHeight: '105px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{
                            padding: '2px 6px',
                            backgroundColor: isHighCost ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-tertiary)',
                            color: isHighCost ? '#f59e0b' : 'var(--text-secondary)',
                            borderRadius: '10px',
                            fontSize: '0.65rem',
                            fontWeight: '900'
                          }}>
                            TGL {day}
                          </span>
                          {isHighCost && <span title="Melebihi Anggaran Harian" style={{ fontSize: '0.7rem' }}>⚠️</span>}
                        </div>

                        <select
                          value={dayMenuId || ''}
                          onChange={(e) => {
                            setMonthlyPlanning(prev => ({
                              ...prev,
                              [`${selectedMonth}_${selectedYear}_${day}`]: e.target.value
                            }));
                          }}
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            color: 'var(--text-primary)',
                            fontSize: '0.68rem',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {filteredMenu.map(m => (
                            <option key={m.id} value={m.id}>{m.name.substring(0, 18)}...</option>
                          ))}
                        </select>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                          <span>Rp{assignedMenu?.cost?.toLocaleString('id-ID')}</span>
                          <span>🔥{assignedMenu?.calorie} kkal</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Real-time Multi-Mode Budget & Subsidy Compliance Analyzer Widget */}
            {(() => {
              const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
              // Get active menus based on current planning mode
              const activeScheduledMenus = planningView === 'weekly' 
                ? filteredWeeklyMenu.map(sched => menu.find(m => m.id === sched.menuId)).filter(Boolean)
                : Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const key = `${selectedMonth}_${selectedYear}_${day}`;
                    return menu.find(m => m.id === monthlyPlanning[key]);
                  }).filter(Boolean);

              if (activeScheduledMenus.length === 0) return null;

              const totalPortionCostSum = activeScheduledMenus.reduce((sum, m) => sum + (m.cost || 0), 0);
              const avgCostPerPortion = totalPortionCostSum / activeScheduledMenus.length;
              
              // Total weekly vs monthly multiplication factor
              const totalDaysPlanned = activeScheduledMenus.length;
              const totalOperationalCost = avgCostPerPortion * weeklyTargetPortions * totalDaysPlanned;
              const totalOperationalSubsidy = subsidyLimitPerPortion * weeklyTargetPortions * totalDaysPlanned;
              const budgetVariancePerPortion = avgCostPerPortion - subsidyLimitPerPortion;
              const varianceTotal = totalOperationalCost - totalOperationalSubsidy;

              const isOverBudget = budgetVariancePerPortion > 0;
              const percentOfBudget = Math.min(100, (avgCostPerPortion / subsidyLimitPerPortion) * 100);

              // Find the most expensive day & menu
              let mostExpensiveLabel = '';
              let mostExpensiveMenu = null;
              
              if (planningView === 'weekly') {
                filteredWeeklyMenu.forEach(sched => {
                  const m = menu.find(item => item.id === sched.menuId);
                  if (m && (!mostExpensiveMenu || m.cost > mostExpensiveMenu.cost)) {
                    mostExpensiveMenu = m;
                    mostExpensiveLabel = sched.day;
                  }
                });
              } else {
                for (let day = 1; day <= daysInMonth; day++) {
                  const key = `${selectedMonth}_${selectedYear}_${day}`;
                  const menuId = monthlyPlanning[key];
                  const m = menu.find(item => item.id === menuId);
                  if (m && (!mostExpensiveMenu || m.cost > mostExpensiveMenu.cost)) {
                    mostExpensiveMenu = m;
                    mostExpensiveLabel = `Tanggal ${day} ${selectedMonth} ${selectedYear}`;
                  }
                }
              }

              return (
                <div style={{
                  marginTop: '24px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>📊</span>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)' }}>
                      Analisis Kepatuhan Anggaran & Subsidi {planningView === 'weekly' ? 'Mingguan' : `Bulanan (${selectedMonth} ${selectedYear})`} (Real-time)
                    </h3>
                  </div>

                  {/* Inputs Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--text-secondary)' }}>TARGET PORSI (SISWA / HARI)</label>
                      <input 
                        type="number" 
                        value={weeklyTargetPortions}
                        onChange={(e) => setWeeklyTargetPortions(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--text-secondary)' }}>LIMIT SUBSIDI (RP / PORSI)</label>
                      <input 
                        type="number" 
                        value={subsidyLimitPerPortion}
                        onChange={(e) => setSubsidyLimitPerPortion(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Analyzer Result Box */}
                  <div style={{
                    backgroundColor: isOverBudget ? 'rgba(239, 68, 68, 0.04)' : 'rgba(16, 185, 129, 0.04)',
                    border: `1.5px solid ${isOverBudget ? '#ef4444' : '#10b981'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          display: 'inline-block',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: isOverBudget ? '#ef4444' : '#10b981',
                          animation: 'pulse 1.5s infinite'
                        }}></span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: isOverBudget ? '#ef4444' : '#10b981', textTransform: 'uppercase' }}>
                          {isOverBudget ? '⚠️ MELEBIHI ANGGARAN (OVER BUDGET)' : '✓ KEPATUHAN AMAN (COMPLIANT)'}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Rata-rata: <strong style={{ color: 'var(--text-primary)' }}>Rp {Math.round(avgCostPerPortion).toLocaleString('id-ID')}</strong> / porsi
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentOfBudget}%`,
                        height: '100%',
                        backgroundColor: isOverBudget ? '#ef4444' : '#10b981',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>

                    {/* Summary text */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                      {isOverBudget ? (
                        <span>
                          Rencana menu {planningView === 'weekly' ? 'mingguan' : `bulanan (${selectedMonth} ${selectedYear})`} Anda melebihi batas subsidi sebesar <strong style={{ color: '#ef4444' }}>Rp {Math.round(budgetVariancePerPortion).toLocaleString('id-ID')} / porsi</strong>. 
                          Yayasan terancam menanggung defisit rugi operasional sebesar <strong style={{ color: '#ef4444' }}>Rp {Math.round(varianceTotal).toLocaleString('id-ID')}</strong> {planningView === 'weekly' ? 'minggu' : 'bulan'} ini!
                        </span>
                      ) : (
                        <span>
                          Rencana menu Anda sangat sehat secara finansial! Anda berada <strong style={{ color: '#10b981' }}>Rp {Math.round(Math.abs(budgetVariancePerPortion)).toLocaleString('id-ID')} / porsi</strong> di bawah pagu subsidi. 
                          Estimasi sisa anggaran (surplus operasional): <strong style={{ color: '#10b981' }}>Rp {Math.round(Math.abs(varianceTotal)).toLocaleString('id-ID')}</strong> {planningView === 'weekly' ? 'minggu' : 'bulan'} ini.
                        </span>
                      )}
                    </div>

                    {/* Dynamic AI Advisor Tip */}
                    {isOverBudget && mostExpensiveMenu && (
                      <div style={{
                        marginTop: '4px',
                        padding: '10px 12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        borderLeft: '4px solid #ef4444',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        color: 'var(--text-secondary)'
                      }}>
                        💡 <strong>Saran Optimasi Dapur:</strong> Menu hidangan hari/tanggal <strong>{mostExpensiveLabel}</strong> yaitu <em>"{mostExpensiveMenu.name}"</em> memiliki HPP termahal yaitu <strong>Rp {mostExpensiveMenu.cost.toLocaleString('id-ID')}</strong>. Ganti menu tanggal {mostExpensiveLabel} dengan alternatif menu yang lebih ekonomis untuk langsung memulihkan keseimbangan anggaran Anda!
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section: Input Menu & SOP Baru */}
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={styles.cardSectionTitle}>🍳 Form Standard Operating Procedure (SOP) & Input Menu Baru</h2>
                <p style={styles.tabSubheading}>Daftarkan menu gizi baru lengkap dengan komposisi takaran bahan baku (SOP) per porsi siswa.</p>
              </div>

              <button
                onClick={() => setShowMenuForm(!showMenuForm)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '24px',
                  border: 'none',
                  backgroundColor: 'var(--color-role)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
                  transition: 'all 0.25s ease'
                }}
              >
                {showMenuForm ? '✕ Batal' : '➕ Tambah Menu & SOP Baru'}
              </button>
            </div>

            {showMenuForm && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newMenuName || !newMenuCalorie || !newMenuProtein) {
                    return alert('Mohon isi nama menu, kalori, dan protein minimum!');
                  }
                  
                  // Construct recipe list
                  const recipeList = [];
                  const ingredientList = [];
                  
                  newMenuRecipe.forEach(item => {
                    if (item.name && item.amount) {
                      recipeList.push({ 
                        name: item.name, 
                        amount: parseFloat(item.amount) || 0, 
                        unit: item.unit,
                        price: parseFloat(item.price) || 0,
                        priceUnit: item.priceUnit || 'kg',
                        allocationType: item.allocationType || 'portion'
                      });
                      ingredientList.push(item.name);
                    }
                  });

                  addNewMenu(
                    newMenuName,
                    newMenuCalorie,
                    newMenuProtein,
                    newMenuFat || 0,
                    newMenuCarb || 0,
                    newMenuCost || 14000,
                    ingredientList,
                    recipeList,
                    ['Kedelai'], // Default allergens
                    activeYayasanId
                  );

                  // Reset states
                  setNewMenuName('');
                  setNewMenuCalorie('');
                  setNewMenuProtein('');
                  setNewMenuFat('');
                  setNewMenuCarb('');
                  setNewMenuRecipe([{ name: '', amount: '', unit: 'g', price: '', priceUnit: 'kg', allocationType: 'portion' }]);
                  setShowMenuForm(false);
                }}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px dashed var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  animation: 'slide-down 0.25s ease-out'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  
                  {/* Column 1: Info Utama & Cost */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--color-role)', textTransform: 'uppercase' }}>1. Info Dasar Menu</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)' }}>NAMA MENU HIDANGAN</label>
                      <input 
                        type="text"
                        value={newMenuName}
                        onChange={(e) => setNewMenuName(e.target.value)}
                        placeholder="Nasi Uduk Gurih & Rolade Ayam"
                        required
                        style={{ padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)' }}>ESTIMASI HPP PER PORSI (RP)</label>
                      <input 
                        type="number"
                        value={newMenuCost}
                        onChange={(e) => setNewMenuCost(e.target.value)}
                        placeholder="14500"
                        style={{ padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Column 2: Nutrisi */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--color-role)', textTransform: 'uppercase' }}>2. Kandungan Nutrisi Harian</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)' }}>KALORI (KKAL)</label>
                        <input 
                          type="number"
                          value={newMenuCalorie}
                          onChange={(e) => setNewMenuCalorie(e.target.value)}
                          placeholder="480"
                          required
                          style={{ padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)' }}>PROTEIN (G)</label>
                        <input 
                          type="number"
                          value={newMenuProtein}
                          onChange={(e) => setNewMenuProtein(e.target.value)}
                          placeholder="28"
                          required
                          style={{ padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)' }}>LEMAK (G)</label>
                        <input 
                          type="number"
                          value={newMenuFat}
                          onChange={(e) => setNewMenuFat(e.target.value)}
                          placeholder="12"
                          style={{ padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)' }}>KARBOHIDRAT (G)</label>
                        <input 
                          type="number"
                          value={newMenuCarb}
                          onChange={(e) => setNewMenuCarb(e.target.value)}
                          placeholder="64"
                          style={{ padding: '10px 14px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Recipe & SOP (Placed in full width row underneath with costing) */}
                <div style={{
                  marginTop: '10px',
                  padding: '20px',
                  backgroundColor: 'rgba(79, 70, 229, 0.03)',
                  border: '1.5px dashed var(--border-color)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: '800', margin: '0', color: 'var(--color-role)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🥗 3. Resep & SOP Bahan per Porsi (Komposisi & Real COGS)
                  </h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                    Tentukan takaran bahan baku beserta harga beli supplier untuk menghitung real COGS (HPP riil) secara akurat otomatis seperti aplikasi Aivola.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                    {newMenuRecipe.map((ing, index) => {
                      const itemCost = calculateRecipeItemCost(ing.amount, ing.unit, ing.price, ing.priceUnit, ing.allocationType);
                      return (
                        <div key={index} style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr auto',
                          gap: '10px',
                          alignItems: 'center',
                          backgroundColor: 'var(--bg-tertiary)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)'
                        }}>
                          {/* 1. Nama Bahan */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {index === 0 && <label style={{ fontSize: '0.62rem', fontWeight: '900', color: 'var(--text-secondary)' }}>BAHAN BAKU</label>}
                            <input 
                              type="text" 
                              value={ing.name}
                              onChange={(e) => {
                                const updated = [...newMenuRecipe];
                                updated[index].name = e.target.value;
                                setNewMenuRecipe(updated);
                              }}
                              placeholder="Beras Premium, Ayam, dll."
                              style={{ width: '100%', padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.78rem', outline: 'none' }}
                            />
                          </div>

                          {/* Tipe Alokasi */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {index === 0 && <label style={{ fontSize: '0.62rem', fontWeight: '900', color: 'var(--text-secondary)' }}>ALOKASI</label>}
                            <select 
                              value={ing.allocationType || 'portion'}
                              onChange={(e) => {
                                const updated = [...newMenuRecipe];
                                updated[index].allocationType = e.target.value;
                                setNewMenuRecipe(updated);
                              }}
                              style={{ width: '100%', padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.78rem', outline: 'none', cursor: 'pointer' }}
                            >
                              <option value="portion">Per Porsi</option>
                              <option value="batch100">Per 100 Porsi</option>
                            </select>
                          </div>

                          {/* 2. Takaran (SOP) */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {index === 0 && <label style={{ fontSize: '0.62rem', fontWeight: '900', color: 'var(--text-secondary)' }}>TAKARAN</label>}
                            <input 
                              type="number" 
                              value={ing.amount}
                              onChange={(e) => {
                                const updated = [...newMenuRecipe];
                                updated[index].amount = e.target.value;
                                setNewMenuRecipe(updated);
                              }}
                              placeholder="120"
                              style={{ width: '100%', padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.78rem', outline: 'none' }}
                            />
                          </div>

                          {/* 3. Satuan Takaran */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {index === 0 && <label style={{ fontSize: '0.62rem', fontWeight: '900', color: 'var(--text-secondary)' }}>SATUAN</label>}
                            <select 
                              value={ing.unit}
                              onChange={(e) => {
                                const updated = [...newMenuRecipe];
                                updated[index].unit = e.target.value;
                                if (e.target.value === 'g') updated[index].priceUnit = 'kg';
                                if (e.target.value === 'ml') updated[index].priceUnit = 'L';
                                if (e.target.value === 'butir') updated[index].priceUnit = 'butir';
                                setNewMenuRecipe(updated);
                              }}
                              style={{ width: '100%', padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.78rem', outline: 'none', cursor: 'pointer' }}
                            >
                              <option value="g">gram (g)</option>
                              <option value="ml">ml</option>
                              <option value="butir">butir</option>
                            </select>
                          </div>

                          {/* 4. Harga Supplier */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {index === 0 && <label style={{ fontSize: '0.62rem', fontWeight: '900', color: 'var(--text-secondary)' }}>HARGA RAW (RP)</label>}
                            <input 
                              type="number" 
                              value={ing.price}
                              onChange={(e) => {
                                const updated = [...newMenuRecipe];
                                updated[index].price = e.target.value;
                                setNewMenuRecipe(updated);
                              }}
                              placeholder="15000"
                              style={{ width: '100%', padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.78rem', outline: 'none' }}
                            />
                          </div>

                          {/* 5. Satuan Harga */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {index === 0 && <label style={{ fontSize: '0.62rem', fontWeight: '900', color: 'var(--text-secondary)' }}>SATUAN HARGA</label>}
                            <select 
                              value={ing.priceUnit}
                              onChange={(e) => {
                                const updated = [...newMenuRecipe];
                                updated[index].priceUnit = e.target.value;
                                setNewMenuRecipe(updated);
                              }}
                              style={{ width: '100%', padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.78rem', outline: 'none', cursor: 'pointer' }}
                            >
                              <option value="kg">/ kg</option>
                              <option value="L">/ Liter</option>
                              <option value="butir">/ butir</option>
                            </select>
                          </div>

                          {/* 6. Live Cost Contribution */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                            {index === 0 && <label style={{ fontSize: '0.62rem', fontWeight: '900', color: 'var(--text-secondary)' }}>REAL COGS</label>}
                            <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--color-role)', padding: '8px 0' }}>
                              Rp{Math.round(itemCost).toLocaleString('id-ID')}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {index === 0 && <span style={{ height: '14px' }}></span>}
                            {newMenuRecipe.length > 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setNewMenuRecipe(newMenuRecipe.filter((_, idx) => idx !== index));
                                }}
                                style={{
                                  padding: '8px 10px',
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                  border: 'none',
                                  borderRadius: '6px',
                                  color: '#ef4444',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                ✕
                              </button>
                            ) : (
                              <span style={{ width: '24px' }}></span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Live COGS Summary Card */}
                    <div style={{
                      backgroundColor: 'rgba(79, 70, 229, 0.05)',
                      border: '1.5px solid var(--color-role)',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '6px'
                    }}>
                      <div>
                        <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: '900', color: 'var(--text-primary)' }}>📈 Total Real COGS (HPP Komposisi)</h5>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Kalkulasi otomatis akumulasi bahan baku di atas per porsi siswa.</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--color-role)' }}>
                          Rp {Math.round(calculatedRealCogs).toLocaleString('id-ID')}
                        </span>
                        <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '800' }}>
                          / PORSI SISWA
                        </span>
                      </div>
                    </div>
                    
                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setNewMenuRecipe([...newMenuRecipe, { name: '', amount: '', unit: 'g', price: '', priceUnit: 'kg', allocationType: 'portion' }]);
                      }}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '8px 16px',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px dashed var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                        marginTop: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      ➕ Tambah Bahan Baku Lainnya
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
                    marginTop: '8px'
                  }}
                >
                  Simpan Rencana Menu & SOP
                </button>
              </form>
            )}
          </div>

          {/* Section: Simulator Kebutuhan Porsi Bahan Baku */}
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={styles.cardSectionTitle}>🚜 Kalkulator Simulator Kebutuhan Bahan Baku Porsi (SOP Multiplier)</h2>
            <p style={styles.tabSubheading}>Simulasikan dan hitung jumlah berat kilogram bahan pangan yang wajib dipesan ke Kelompok Tani lokal berdasarkan jumlah target porsi.</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              backgroundColor: 'var(--bg-secondary)',
              padding: '20px',
              borderRadius: '16px',
              border: '1.5px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-secondary)' }}>1. PILIH MENU HIDANGAN</label>
                <select
                  value={selectedMenuForSim || (filteredMenu[0]?.id || '')}
                  onChange={(e) => setSelectedMenuForSim(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  {filteredMenu.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-secondary)' }}>2. TARGET PORSI MAKANAN (SISWA)</label>
                <input 
                  type="number"
                  value={simulatorPortions}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setSimulatorPortions('');
                    } else {
                      const parsed = parseInt(val);
                      setSimulatorPortions(isNaN(parsed) ? '' : Math.max(0, parsed));
                    }
                  }}
                  placeholder="250"
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Calculations Result */}
            {(() => {
              const activeSimMenu = filteredMenu.find(m => m.id === (selectedMenuForSim || filteredMenu[0]?.id)) || filteredMenu[0] || menu[0];
              if (!activeSimMenu) return null;
              
              const activePortions = parseInt(simulatorPortions) || 0;
              const totalSimCost = (activeSimMenu.cost || 14000) * activePortions;
              const recipe = activeSimMenu.recipe || [
                { name: 'Beras Premium', amount: 120, unit: 'g', price: 15000, priceUnit: 'kg' },
                { name: 'Daging Ayam', amount: 80, unit: 'g', price: 65000, priceUnit: 'kg' }
              ];

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '12px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      💰 Estimasi Anggaran yang Dibutuhkan untuk <strong>{activePortions.toLocaleString('id-ID')} Porsi</strong>:
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#10b981' }}>
                      Rp {totalSimCost.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '0.85rem', fontWeight: '800', margin: '10px 0 0 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🚜 DETAIL BAHAN BAKU YANG DIBUTUHKAN (SOP MULTIPLIED)
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {recipe.map((r, idx) => {
                      const isBatch = r.allocationType === 'batch100';
                      const totalNeeded = isBatch ? (r.amount / 100) * activePortions : r.amount * activePortions;
                      let formattedNeeded = '';
                      if (r.unit === 'g') {
                        formattedNeeded = `${(totalNeeded / 1000).toLocaleString('id-ID')} kg`;
                      } else if (r.unit === 'ml') {
                        formattedNeeded = `${(totalNeeded / 1000).toLocaleString('id-ID')} Liter`;
                      } else {
                        formattedNeeded = `${totalNeeded.toLocaleString('id-ID')} ${r.unit}`;
                      }

                      return (
                        <div key={idx} style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '12px',
                          padding: '14px 18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {r.name}
                              {isBatch && (
                                <span style={{ fontSize: '0.55rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-role)', padding: '1px 4px', borderRadius: '3px', fontWeight: '800' }}>
                                  BATCH
                                </span>
                              )}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              Takaran SOP: {r.amount} {r.unit} {isBatch ? 'per 100 porsi' : 'per porsi'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--color-role)' }}>
                            {formattedNeeded}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Standar Detail Nutrisi & Real COGS Analyzer (Aivola Pro) */}
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={styles.cardSectionTitle}>🍎 Standar Nutrisi & Analisis Real COGS Menu</h2>
                <p style={styles.tabSubheading}>Rincian nutrisi Kemenkes dan audit HPP/COGS riil berbasis komposisi bahan baku layaknya aplikasi Aivola.</p>
              </div>

              {/* Selector Menu saved */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>LIHAT RINCIAN:</span>
                <select
                  value={selectedDetailsMenuId}
                  onChange={(e) => setSelectedDetailsMenuId(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {filteredMenu.map(m => (
                    <option key={m.id} value={m.id}>{m.name.substring(0, 45)}...</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.menuDetailsBox}>
              <h3 style={styles.activeMenuName}>{activeMenu.name}</h3>
              
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '14px' }}>
                
                {/* Column Left: Nutrition Info */}
                <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={styles.recipeColTitle}>🧬 Rincian Nutrisi Acuan</h4>
                  <ul style={{ ...styles.listSimple, display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                    <li style={{ listStyleType: 'none', fontSize: '0.8rem', color: 'var(--text-primary)' }}>🔥 Energi: <strong style={{ color: 'var(--color-role)' }}>{activeMenu.calorie} kkal</strong></li>
                    <li style={{ listStyleType: 'none', fontSize: '0.8rem', color: 'var(--text-primary)' }}>🥩 Protein: <strong style={{ color: '#10b981' }}>{activeMenu.protein} gram</strong></li>
                    <li style={{ listStyleType: 'none', fontSize: '0.8rem', color: 'var(--text-primary)' }}>🧈 Lemak Sehat: <strong>{activeMenu.fat} gram</strong></li>
                    <li style={{ listStyleType: 'none', fontSize: '0.8rem', color: 'var(--text-primary)' }}>🌾 Karbohidrat: <strong>{activeMenu.carb} gram</strong></li>
                  </ul>

                  <div style={{
                    marginTop: '8px',
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Status Alergen Kemenkes</span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {activeMenu.allergens?.map((a, i) => (
                        <span key={i} style={{ fontSize: '0.65rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>
                          ⚠️ Mengandung {a}
                        </span>
                      )) || <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Bebas Alergen Utama</span>}
                    </div>
                  </div>
                </div>

                {/* Column Right: Aivola Real COGS Audit Table */}
                {(() => {
                  const recipeItems = activeMenu.recipe || [];
                  const rawCostTotal = recipeItems.reduce((sum, r) => {
                    const price = r.price !== undefined ? r.price : (r.name.includes('Ayam') ? 65000 : r.name.includes('Beras') ? 15000 : 20000);
                    const priceUnit = r.priceUnit || 'kg';
                    return sum + calculateRecipeItemCost(r.amount, r.unit, price, priceUnit, r.allocationType);
                  }, 0);

                  return (
                    <div style={{ flex: 2.2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--color-role)', margin: 0, textTransform: 'uppercase' }}>🥬 Aivola Real COGS Costing Audit</h4>
                      
                      <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '800' }}>Bahan Baku</th>
                              <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '800' }}>Takaran</th>
                              <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '800' }}>Harga Supplier</th>
                              <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '800' }}>Biaya / Porsi</th>
                              <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--text-secondary)', fontWeight: '800' }}>% Share</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recipeItems.map((r, idx) => {
                              const price = r.price !== undefined ? r.price : (r.name.includes('Ayam') ? 65000 : r.name.includes('Beras') ? 15000 : 20000);
                              const priceUnit = r.priceUnit || 'kg';
                              
                              const itemCost = calculateRecipeItemCost(r.amount, r.unit, price, priceUnit, r.allocationType);
                              const percentShare = rawCostTotal > 0 ? (itemCost / rawCostTotal) * 100 : 0;

                              return (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                                  <td style={{ padding: '8px 12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                                    {r.name}
                                    {r.allocationType === 'batch100' && (
                                      <span style={{ marginLeft: '6px', fontSize: '0.58rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--color-role)', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>
                                        BATCH (100)
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ padding: '8px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {r.amount} {r.unit} 
                                    <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>
                                      {r.allocationType === 'batch100' ? '/100 porsi' : '/porsi'}
                                    </span>
                                  </td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>Rp {price.toLocaleString('id-ID')} / {priceUnit}</td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '800', color: 'var(--color-role)' }}>Rp {Math.round(itemCost).toLocaleString('id-ID')}</td>
                                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: '800' }}>{percentShare.toFixed(0)}%</td>
                                </tr>
                              );
                            })}
                            
                            {/* Total Row */}
                            <tr style={{ backgroundColor: 'rgba(79, 70, 229, 0.04)', fontWeight: '900' }}>
                              <td colSpan="3" style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>COGS Murni (Total Raw Material)</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--color-role)', fontSize: '0.82rem' }}>Rp {Math.round(rawCostTotal).toLocaleString('id-ID')}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-primary)' }}>100%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div style={{
                        backgroundColor: 'rgba(79, 70, 229, 0.02)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.68rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.4'
                      }}>
                        ⚠️ <strong>Informasi ERP Dapur:</strong> HPP tertera di atas adalah *COGS Murni*. Total HPP final di dashboard (Rp {activeMenu.cost.toLocaleString('id-ID')}) telah ditambahkan overhead persiapan <strong>Rp {Math.max(0, activeMenu.cost - rawCostTotal) > 0 ? Math.round(activeMenu.cost - rawCostTotal).toLocaleString('id-ID') : '1.500'}</strong> untuk LPG, utilitas, penyusutan peralatan, & koki SPPG.
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* AI OPTIMIZER SECTION (Wow Factor) */}
            <div style={styles.aiOptimizerBox}>
              <div style={styles.aiHeader}>
                <Sparkles size={22} style={{ color: 'var(--c-sekolah)' }} />
                <div>
                  <h4 style={styles.aiTitle}>AI Menu Optimizer</h4>
                  <span style={styles.aiSubtitle}>Susun menu otomatis berbasis kecerdasan buatan, mengoptimalkan bahan baku lokal & memangkas pengeluaran.</span>
                </div>
              </div>

              {aiMenuRecommendation ? (
                <div style={styles.aiResult} className="animate-fade-in">
                  <h4 style={styles.aiMenuName}>{aiMenuRecommendation.name}</h4>
                  <div style={styles.aiStats}>
                    <span>🔥 {aiMenuRecommendation.calorie} kkal</span>
                    <span>🥩 {aiMenuRecommendation.protein}g Protein</span>
                    <span>💰 HPP: **Rp {aiMenuRecommendation.cost.toLocaleString('id-ID')}**</span>
                  </div>
                  <p style={styles.aiSourcing}>🚜 **Sumber Pangan**: {aiMenuRecommendation.sourcing}</p>
                  <div style={styles.savingsAlert}>
                    <CheckCircle size={16} /> <span>{aiMenuRecommendation.savings}</span>
                  </div>
                  <button onClick={() => setAiMenuRecommendation(null)} style={styles.btnResetAi}>Reset</button>
                </div>
              ) : (
                <button 
                  onClick={runAiOptimizer} 
                  disabled={isGeneratingAiMenu}
                  style={styles.aiBtn}
                >
                  {isGeneratingAiMenu ? (
                    <>
                      <RefreshCw size={16} className="spin-slow" />
                      <span>Menganalisis Komoditas Petani Lokal...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Optimalisasi Menu & Biaya Sekarang</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: QC AUDIT */}
      {activeTab === 'qc' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>🛡️ Audit Kualitas & Sanitasi SPPG</h2>
          <p style={styles.tabSubheading}>Daftar audit kepatuhan higienitas dapur pusat untuk menjamin keamanan pangan siswa dari keracunan makanan.</p>

          <div style={styles.qcSummaryBox}>
            <div style={styles.qcTitleHeader}>
              <h4>{filteredKitchens[0]?.name || 'SPPG'}</h4>
              <span className="badge badge-success">Sertifikasi Grade A</span>
            </div>
            
            <div style={styles.checkTable}>
              <div style={styles.tableRowHeader}>
                <span>Kriteria Audit Higienitas</span>
                <span style={{ textAlign: 'center' }}>Bobot</span>
                <span style={{ textAlign: 'right' }}>Status Verifikasi</span>
              </div>

              <div style={styles.tableRow}>
                <span>✓ Penggunaan Masker & Celemek Koki</span>
                <span style={{ textAlign: 'center' }}>20%</span>
                <span style={{ textAlign: 'right', color: '#10b981', fontWeight: '800' }}>LENGKAP</span>
              </div>
              
              <div style={styles.tableRow}>
                <span>✓ Pemeriksaan Kualitas Air Bersih SPPG</span>
                <span style={{ textAlign: 'center' }}>30%</span>
                <span style={{ textAlign: 'right', color: '#10b981', fontWeight: '800' }}>MEMENUHI SYARAT (Bebas E.Coli)</span>
              </div>

              <div style={styles.tableRow}>
                <span>✓ Suhu Penyimpanan Bahan Baku Basah (Ayam/Sayur)</span>
                <span style={{ textAlign: 'center' }}>25%</span>
                <span style={{ textAlign: 'right', color: '#10b981', fontWeight: '800' }}>AMAN (Suhu Chiller 4°C)</span>
              </div>

              <div style={styles.tableRow}>
                <span>✓ Pest & Rodent Control Dapur</span>
                <span style={{ textAlign: 'center' }}>15%</span>
                <span style={{ textAlign: 'right', color: '#10b981', fontWeight: '800' }}>TERKENDALI (Laporan Bulanan Terlampir)</span>
              </div>

              <div style={styles.tableRow}>
                <span>✓ Sampel Masakan Harian Disimpan (Food Retention)</span>
                <span style={{ textAlign: 'center' }}>10%</span>
                <span style={{ textAlign: 'right', color: '#10b981', fontWeight: '800' }}>YA (Disimpan 2x24 Jam di chiller)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: FINANCE & BUDGET */}
      {activeTab === 'finance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section 1: PO Supplier */}
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={styles.cardSectionTitle}>🌾 Manajemen Pembayaran & Subsidi UMKM Lokal</h2>
            <p style={styles.tabSubheading}>Yayasan memverifikasi pengiriman bahan pangan lokal dan menyetujui invoice digital (PO) ke rekening Kelompok Tani/UMKM.</p>

            <div style={styles.poList}>
              {filteredSuppliers.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>Belum ada pengajuan PO dari supplier lokal.</p>
              ) : (
                filteredSuppliers.map((po) => (
                  <div key={po.id} style={styles.poCard}>
                    <div style={styles.poLeft}>
                      <div style={styles.poAvatar}>
                        <Tractor size={20} />
                      </div>
                      <div>
                        <h4 style={styles.poName}>{po.itemName} ({po.qty})</h4>
                        <span style={styles.poSupplier}>Supplier: **{po.supplierName}**</span>
                        <span style={styles.poDate}>Pengajuan: {po.date}</span>
                      </div>
                    </div>

                    <div style={styles.poRight}>
                      <div style={styles.poCostInfo}>
                        <span style={styles.poCostLabel}>Total Invoice:</span>
                        <span style={styles.poCostVal}>Rp {po.price.toLocaleString('id-ID')}</span>
                      </div>
                      
                      {po.status === 'Menunggu Approval' ? (
                        <button 
                          onClick={() => approvePO(po.id)} 
                          style={styles.btnApprovePO}
                        >
                          Setujui Pencairan Dana
                        </button>
                      ) : po.status === 'Diproses' ? (
                        <span className="badge badge-warning" style={{ fontWeight: '800' }}>Diproses (Dana Cair)</span>
                      ) : (
                        <span className="badge badge-success" style={{ fontWeight: '800' }}>✓ Lunas / Selesai</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Operational Expenses */}
          <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={styles.cardSectionTitle}>⚙️ Log Pengeluaran Operasional Dapur & Logistik</h2>
                <p style={styles.tabSubheading}>Pencatatan pengeluaran harian dapur SPPG (gas LPG, air mineral higienis, kemasan ramah lingkungan, dll).</p>
              </div>

              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '24px',
                  border: 'none',
                  backgroundColor: 'var(--color-role)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
                  transition: 'all 0.25s ease'
                }}
              >
                {showExpenseForm ? '❌ Batal Input' : '➕ Input Pengeluaran Operasional'}
              </button>
            </div>

            {/* Expandable Expense Input Form */}
            {showExpenseForm && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!expenseTitle || !expenseAmount) return alert('Mohon isi nama pengeluaran & jumlah biaya!');
                  addOperationalExpense(expenseTitle, expenseAmount, expenseCategory, expenseNotes, activeYayasanId);
                  // Reset states
                  setExpenseTitle('');
                  setExpenseAmount('');
                  setExpenseCategory('Utilitas');
                  setExpenseNotes('');
                  setShowExpenseForm(false);
                }}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px dashed var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  animation: 'slide-down 0.25s ease-out'
                }}
              >
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Input Pengeluaran Operasional Baru</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>NAMA PENGELUARAN / KEBUTUHAN</label>
                    <input 
                      type="text"
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      placeholder="Contoh: Gas LPG 3kg (10 Tabung)"
                      required
                      style={{
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>JUMLAH BIAYA (RUPIAH)</label>
                    <input 
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="Contoh: 350000"
                      required
                      style={{
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>KATEGORI OPERASIONAL</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsAddingCustomCategory(!isAddingCustomCategory);
                          setCustomCategoryInput('');
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: 'var(--color-role)',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {isAddingCustomCategory ? '✕ Batal' : '➕ Kategori Baru'}
                      </button>
                    </div>

                    {isAddingCustomCategory ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                          type="text"
                          value={customCategoryInput}
                          onChange={(e) => setCustomCategoryInput(e.target.value)}
                          placeholder="Kategori Baru (misal: Sewa Kendaraan)"
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!customCategoryInput.trim()) return;
                            addExpenseCategory(customCategoryInput.trim());
                            setExpenseCategory(customCategoryInput.trim());
                            setIsAddingCustomCategory(false);
                            setCustomCategoryInput('');
                          }}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '800',
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          Simpan
                        </button>
                      </div>
                    ) : (
                      <select
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                        style={{
                          padding: '10px 14px',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      >
                        {expenseCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)' }}>CATATAN / KETERANGAN TAMBAHAN</label>
                  <textarea 
                    value={expenseNotes}
                    onChange={(e) => setExpenseNotes(e.target.value)}
                    placeholder="Contoh: Pembelian operasional LPG di pangkalan resmi untuk minggu ke-4"
                    rows={2}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'none'
                    }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    alignSelf: 'flex-start',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  Simpan Catatan Pengeluaran
                </button>
              </form>
            )}

            {/* Operational Expenses Log List */}
            <div style={styles.poList}>
              {filteredOperationalExpenses.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '16px',
                  border: '1px dashed var(--border-color)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  Belum ada catatan pengeluaran operasional terdaftar untuk yayasan ini.
                </div>
              ) : (
                filteredOperationalExpenses.map((expense) => (
                  <div key={expense.id} style={{ ...styles.poCard, borderLeft: '4px solid #f43f5e' }}>
                    <div style={styles.poLeft}>
                      <div style={{ ...styles.poAvatar, backgroundColor: 'rgba(244, 63, 94, 0.08)', color: '#f43f5e', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span>⚙️</span>
                      </div>
                      <div>
                        <h4 style={styles.poName}>{expense.title}</h4>
                        <span style={styles.poSupplier}>Kategori: <strong style={{ color: 'var(--color-role)' }}>{expense.category}</strong></span>
                        <span style={styles.poDate}>Keterangan: {expense.notes} • Tanggal: {expense.date}</span>
                      </div>
                    </div>

                    <div style={styles.poRight}>
                      <div style={styles.poCostInfo}>
                        <span style={styles.poCostLabel}>Jumlah Pengeluaran:</span>
                        <span style={{ ...styles.poCostVal, color: '#f43f5e' }}>- Rp {expense.amount.toLocaleString('id-ID')}</span>
                      </div>
                      <span className="badge badge-danger" style={{ fontWeight: '800', fontSize: '0.65rem', backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>Operasional</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      )}

      {/* Tab 5: VOLUNTEER (RELAWAN) */}
      {activeTab === 'relawan' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={styles.cardSectionTitle}>🙋 Laporan Kehadiran & Tugas Relawan</h2>
              <p style={styles.tabSubheading}>Monitoring presensi, koordinat GPS, dan penyelesaian tugas relawan gizi peduli di lapangan.</p>
            </div>
            
            {/* Elegant Date Selector Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', marginRight: '4px' }}>TANGGAL RIWAYAT:</span>
              {[
                { label: 'Hari Ini (25 Mei)', value: '2026-05-25' },
                { label: '24 Mei', value: '2026-05-24' },
                { label: '23 Mei', value: '2026-05-23' }
              ].map(dateOpt => (
                <button
                  key={dateOpt.value}
                  onClick={() => setSelectedDate(dateOpt.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '16px',
                    border: 'none',
                    backgroundColor: selectedDate === dateOpt.value ? 'var(--color-role)' : 'transparent',
                    color: selectedDate === dateOpt.value ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: selectedDate === dateOpt.value ? '0 4px 10px rgba(79, 70, 229, 0.25)' : 'none'
                  }}
                >
                  {dateOpt.label}
                </button>
              ))}
            </div>
          </div>

          {filteredVolunteers.filter(v => v.date === selectedDate).length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '20px',
              border: '1.5px dashed var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: 'rgba(244, 63, 94, 0.05)', color: '#f43f5e',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                marginBottom: '4px'
              }}>
                <Users size={28} />
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Tidak Ada Aktivitas Relawan</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '320px', margin: 0, lineHeight: '1.5' }}>
                Tidak ditemukan catatan kehadiran atau tugas mobilisasi relawan gizi peduli untuk tanggal {selectedDate.split('-').reverse().join('/')}.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {filteredVolunteers.filter(v => v.date === selectedDate).map((v) => (
                <div key={v.id} style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'default'
                }} className="hover-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                      }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>{v.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Zona {v.zone}</span>
                      </div>
                    </div>
                    <span className={`badge ${v.status === 'Sedang Bertugas' ? 'badge-success' : 'badge-warning'}`}>
                      {v.status}
                    </span>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                      <Clock size={14} color="var(--text-muted)" />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Jam Masuk: {v.clockIn}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                      <MapPin size={14} color="#f43f5e" />
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Lokasi: {v.coordinates}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Progres Tugas Hari Ini</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: v.completedTasks === v.totalTasks ? '#10b981' : 'var(--text-primary)' }}>
                      {v.completedTasks} / {v.totalTasks} Selesai
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>📣 Pusat Grievance & Suara Konsumen</h2>
          <p style={styles.tabSubheading}>Daftar umpan balik instan dari pihak Koordinator Sekolah maupun Orang Tua untuk audit mutu masakan.</p>

          <div style={styles.feedbackGrid}>
            {filteredFeedback.map((f) => (
              <div key={f.id} style={styles.fCard}>
                <div style={styles.fCardHeader}>
                  <div style={styles.fCardTitleRow}>
                    <span style={styles.fSchool}>{f.schoolName}</span>
                    <span style={styles.fRole}>{f.role}</span>
                  </div>
                  <span className={`badge ${f.type === 'Positif' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.62rem' }}>
                    {f.type}
                  </span>
                </div>
                
                <div style={styles.fStars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < f.rating ? '#f59e0b' : 'none'} color={i < f.rating ? '#f59e0b' : '#cbd5e1'} />
                  ))}
                </div>

                <p style={styles.fComment}>"{f.comments}"</p>
                <span style={styles.fDate}>Waktu pengiriman: {f.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  titleBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px',
  },
  tabHeading: {
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  tabSubheading: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '20px',
  },
  kpiCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    backgroundColor: 'var(--bg-secondary)',
  },
  kpiHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kpiTitle: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  kpiValue: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-title)',
  },
  kpiUnit: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  kpiSubtitle: {
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: 'var(--bg-secondary)',
  },
  cardSectionTitle: {
    fontSize: '1rem',
    fontWeight: '800',
  },
  feedCard: {
    backgroundColor: 'var(--bg-secondary)',
  },
  feedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
  },
  feedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  feedAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-role)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontFamily: 'var(--font-title)',
  },
  feedContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  feedMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  feedUser: {
    fontSize: '0.85rem',
    fontWeight: '800',
  },
  stars: {
    display: 'flex',
    alignItems: 'center',
  },
  feedComment: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  feedTime: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  menuDetailsBox: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
  },
  activeMenuName: {
    fontSize: '1.15rem',
    fontWeight: '800',
    marginBottom: '16px',
  },
  recipeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  },
  recipeCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  recipeColTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  listSimple: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '0.85rem',
    listStyle: 'none',
  },
  ingredientBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  aiOptimizerBox: {
    border: '1.5px dashed var(--border-focus)',
    padding: '20px',
    borderRadius: '16px',
    backgroundColor: 'rgba(245, 158, 11, 0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  aiTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
  },
  aiSubtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  aiBtn: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#d97706', // dark amber
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  aiResult: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  aiMenuName: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#d97706',
  },
  aiStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  aiSourcing: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
  },
  savingsAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
    fontSize: '0.78rem',
    fontWeight: '800',
    padding: '8px 12px',
    borderRadius: '8px',
    alignSelf: 'flex-start',
  },
  btnResetAi: {
    alignSelf: 'flex-start',
    padding: '4px 12px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    fontSize: '0.72rem',
    cursor: 'pointer',
  },
  qcSummaryBox: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  qcTitleHeader: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
  },
  checkTable: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableRowHeader: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 2fr',
    padding: '12px 20px',
    backgroundColor: 'var(--bg-tertiary)',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border-color)',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 2fr',
    padding: '14px 20px',
    fontSize: '0.85rem',
    borderBottom: '1px solid var(--border-color)',
    alignItems: 'center',
  },
  poList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  poCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
  },
  poLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  poAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    color: 'var(--c-supplier)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poName: {
    fontSize: '0.9rem',
    fontWeight: '800',
  },
  poSupplier: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    display: 'block',
  },
  poDate: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    display: 'block',
  },
  poRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  poCostInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  poCostLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  poCostVal: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  btnApprovePO: {
    padding: '10px 16px',
    backgroundColor: 'var(--color-role)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  feedbackGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  fCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fCardTitleRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  fSchool: {
    fontSize: '0.85rem',
    fontWeight: '800',
  },
  fRole: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  fStars: {
    display: 'flex',
    alignItems: 'center',
  },
  fComment: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  fDate: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
};

export default YayasanDashboard;
