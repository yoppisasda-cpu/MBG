import React, { useContext, useState } from 'react';
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
    menu, kitchens, attendance, deliveries, feedback, suppliers, approvePO, volunteers 
  } = useContext(AppContext);

  const [isGeneratingAiMenu, setIsGeneratingAiMenu] = useState(false);
  const [aiMenuRecommendation, setAiMenuRecommendation] = useState(null);

  // 1. Calculations for KPIs
  const totalMealsDelivered = deliveries
    .filter(d => d.status === 'Selesai')
    .reduce((sum, d) => sum + d.porsi, 0);

  const totalMealsPending = deliveries
    .filter(d => d.status !== 'Selesai')
    .reduce((sum, d) => sum + d.porsi, 0);

  const totalBudgetSpent = suppliers.reduce((sum, po) => {
    if (po.status === 'Selesai' || po.status === 'Diproses') return sum + po.price;
    return sum;
  }, 0);

  const localUmkmContribution = suppliers.reduce((sum, po) => sum + po.price, 0);

  // 2. Charts Data
  const deliveryData = deliveries.map(d => ({
    name: d.schoolName.substring(0, 10) + '...',
    'Jumlah Porsi': d.porsi,
    'Status': d.status === 'Selesai' ? 100 : d.status === 'Dalam Perjalanan' ? 50 : 10
  }));

  const activeMenu = menu[0];
  const nutritionData = [
    { name: 'Karbohidrat (g)', value: activeMenu.carb, color: '#4f46e5' },
    { name: 'Protein (g)', value: activeMenu.protein, color: '#10b981' },
    { name: 'Lemak (g)', value: activeMenu.fat, color: '#f59e0b' }
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
              <h2 style={styles.tabHeading}>🏢 Dashboard Evaluasi Program Makro</h2>
              <p style={styles.tabSubheading}>Monitoring real-time dapur SPPG Melati, penyerapan pangan, dan audit gizi nasional.</p>
            </div>
            <span className="badge badge-role">Laporan Nasional</span>
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
              <span style={styles.kpiValue}>{kitchens[0].score} <span style={styles.kpiUnit}>Sanitasi</span></span>
              <span style={styles.kpiSubtitle}>Last QC: {kitchens[0].lastQC}</span>
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
              {feedback.slice(0, 3).map((f) => (
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
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>🍎 Standar Kepatuhan Gizi & Menu Harian</h2>
          <p style={styles.tabSubheading}>Yayasan memastikan menu memenuhi standar kecukupan kalori dan protein harian sesuai ketentuan Kementerian Kesehatan.</p>

          <div style={styles.menuDetailsBox}>
            <h3 style={styles.activeMenuName}>{activeMenu.name}</h3>
            
            <div style={styles.recipeGrid}>
              <div style={styles.recipeCol}>
                <h4 style={styles.recipeColTitle}>🧬 Rincian Nutrisi</h4>
                <ul style={styles.listSimple}>
                  <li>🔥 Energi: **{activeMenu.calorie} kkal** (Target: 450-500 kkal)</li>
                  <li>🥩 Protein: **{activeMenu.protein} gram** (Target: min 25g)</li>
                  <li>🧈 Lemak Sehat: **{activeMenu.fat} gram**</li>
                  <li>🌾 Karbohidrat: **{activeMenu.carb} gram**</li>
                </ul>
              </div>

              <div style={styles.recipeCol}>
                <h4 style={styles.recipeColTitle}>🥬 Komposisi Bahan Utama</h4>
                <div style={styles.ingredientBadges}>
                  {activeMenu.ingredients.map((ing, idx) => (
                    <span key={idx} className="badge badge-role" style={{ fontSize: '0.72rem', textTransform: 'none' }}>
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
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
      )}

      {/* Tab 3: QC AUDIT */}
      {activeTab === 'qc' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>🛡️ Audit Kualitas & Sanitasi SPPG</h2>
          <p style={styles.tabSubheading}>Daftar audit kepatuhan higienitas dapur pusat untuk menjamin keamanan pangan siswa dari keracunan makanan.</p>

          <div style={styles.qcSummaryBox}>
            <div style={styles.qcTitleHeader}>
              <h4>{kitchens[0].name}</h4>
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
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>💸 Manajemen Pembayaran & Subsidi UMKM Lokal</h2>
          <p style={styles.tabSubheading}>Yayasan memverifikasi pengiriman bahan pangan lokal dan menyetujui invoice digital (PO) ke rekening Kelompok Tani/UMKM.</p>

          <div style={styles.poList}>
            {suppliers.map((po) => (
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
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: VOLUNTEER (RELAWAN) */}
      {activeTab === 'relawan' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>🙋 Laporan Kehadiran & Tugas Relawan</h2>
          <p style={styles.tabSubheading}>Monitoring real-time presensi, koordinat GPS, dan penyelesaian tugas relawan gizi peduli di lapangan.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {volunteers.map((v) => (
              <div key={v.id} style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
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
        </div>
      )}

      {/* Tab 6: FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>📣 Pusat Grievance & Suara Konsumen</h2>
          <p style={styles.tabSubheading}>Daftar umpan balik instan dari pihak Koordinator Sekolah maupun Orang Tua untuk audit mutu masakan.</p>

          <div style={styles.feedbackGrid}>
            {feedback.map((f) => (
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
