import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  ChefHat, Clipboard, ShoppingCart, Truck, CheckCircle, AlertTriangle, 
  Plus, Play, QrCode, ClipboardCheck, ArrowRight, ShieldAlert
} from 'lucide-react';

const DapurDashboard = ({ activeTab = 'overview' }) => {
  const { 
    kitchens, attendance, inventory, deliveries, feedback, suppliers,
    submitQC, dispatchDelivery, triggerRestock 
  } = useContext(AppContext);

  // Local Form state for placing PO
  const [showPoModal, setShowPoModal] = useState(false);
  const [poItem, setPoItem] = useState('Daging Ayam Fillet');
  const [poQty, setPoQty] = useState('30 kg');
  const [poPrice, setPoPrice] = useState(1200000);
  const [isPoSubmitted, setIsPoSubmitted] = useState(false);

  // Hygiene checklist inputs
  const [hygieneForm, setHygieneForm] = useState({
    chefHygiene: true,
    tempLog: true,
    waterPurity: true,
    utensilsSterile: true
  });
  const [qcCleared, setQcCleared] = useState(kitchens[0].lastQC.includes('Baru saja'));

  const handleQcSubmit = (e) => {
    e.preventDefault();
    submitQC();
    setQcCleared(true);
    alert('Sukses melakukan verifikasi Higienitas Harian. SPPG Melati Kebayoran resmi terbit sertifikat aman hari ini.');
  };

  // Kitchen Stats
  const activeKit = kitchens[0];
  const totalCookTarget = attendance.reduce((sum, sch) => sum + sch.students, 0);

  // Trigger Local PO Creation (Mocked)
  const handlePlacePO = (e) => {
    e.preventDefault();
    // Simulate placing order by restocking immediately or notifying that it is sent for approval
    setIsPoSubmitted(true);
    setTimeout(() => {
      setIsPoSubmitted(false);
      setShowPoModal(false);
      alert(`Sukses mengirim pengajuan PO: ${poItem} (${poQty}) ke Yayasan. Menunggu persetujuan pencairan dana dari Pusat.`);
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div style={styles.titleBanner}>
            <div>
              <h2 style={styles.tabHeading}>🍳 Dashboard Operasional Dapur Pusat</h2>
              <p style={styles.tabSubheading}>Manajemen produksi masakan, pengawasan higienitas dapur, dan dispatch makanan hangat.</p>
            </div>
            <span className="badge badge-success">Dapur: {activeKit.name}</span>
          </div>

          {/* Quick Metrics */}
          <div style={styles.kpiGrid}>
            <div className="glass-card" style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>Target Porsi Masak</span>
                <ChefHat size={20} style={{ color: 'var(--c-dapur)' }} />
              </div>
              <span style={styles.kpiValue}>{totalCookTarget} <span style={styles.kpiUnit}>Porsi</span></span>
              <span style={styles.kpiSubtitle}>Berdasarkan data absensi siswa terkini</span>
            </div>

            <div className="glass-card" style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>Status Sanitasi Koki</span>
                <CheckCircle size={20} style={{ color: '#10b981' }} />
              </div>
              <span style={styles.kpiValue} style={{ ...styles.kpiValue, fontSize: '1.25rem', color: '#10b981', paddingTop: '8px' }}>
                {activeKit.lastQC.includes('LULUS') || qcCleared ? '✓ TERVERIFIKASI' : '⚠️ BELUM CHECKLIST'}
              </span>
              <span style={styles.kpiSubtitle}>Audit QC: {activeKit.lastQC}</span>
            </div>

            <div className="glass-card" style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>Bahan Pangan Kritis</span>
                <AlertTriangle size={20} style={{ color: '#e11d48' }} />
              </div>
              <span style={styles.kpiValue}>
                {inventory.filter(i => i.status === 'Kritis').length} <span style={styles.kpiUnit}>Komoditas</span>
              </span>
              <span style={styles.kpiSubtitle}>Butuh segera re-order ke supplier</span>
            </div>

            <div className="glass-card" style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>Pengiriman Aktif</span>
                <Truck size={20} style={{ color: '#0284c7' }} />
              </div>
              <span style={styles.kpiValue}>
                {deliveries.filter(d => d.status === 'Dalam Perjalanan').length} <span style={styles.kpiUnit}>Sekolah</span>
              </span>
              <span style={styles.kpiSubtitle}>{deliveries.filter(d => d.status === 'Menunggu Dapur').length} sekolah antre dikemas</span>
            </div>
          </div>

          {/* Daily QC checklist form */}
          <div className="glass-card" style={styles.checklistCard}>
            <h3 style={styles.cardSectionTitle}>📋 Checklist Higienitas Koki Harian (Sebelum Masak)</h3>
            <p style={styles.tabSubheading}>Koki utama wajib memverifikasi parameter keselamatan berikut setiap subuh sebelum kompor dinyalakan.</p>

            {qcCleared ? (
              <div style={styles.qcClearedBox}>
                <CheckCircle size={40} style={{ color: '#10b981' }} />
                <div>
                  <h4 style={styles.qcClearedTitle}>Sanitasi Dapur Dinyatakan AMAN</h4>
                  <p style={styles.qcClearedDesc}>Checklist harian telah terisi lengkap. Koki utama menggunakan masker, rambut tertutup, kuku bersih, dan suhu dispenser air &gt; 80°C.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQcSubmit} style={styles.qcForm}>
                <div style={styles.formCheckGrid}>
                  <label style={styles.checkLabel}>
                    <input 
                      type="checkbox" 
                      checked={hygieneForm.chefHygiene} 
                      onChange={(e) => setHygieneForm({...hygieneForm, chefHygiene: e.target.checked})}
                      style={styles.checkbox} 
                    />
                    <span>Koki Menggunakan Masker & Hairnet (Penutup Rambut)</span>
                  </label>
                  <label style={styles.checkLabel}>
                    <input 
                      type="checkbox" 
                      checked={hygieneForm.tempLog} 
                      onChange={(e) => setHygieneForm({...hygieneForm, tempLog: e.target.checked})}
                      style={styles.checkbox} 
                    />
                    <span>Suhu Penyimpanan Chiller Basah Terkalibrasi (Suhu &lt; 5°C)</span>
                  </label>
                  <label style={styles.checkLabel}>
                    <input 
                      type="checkbox" 
                      checked={hygieneForm.waterPurity} 
                      onChange={(e) => setHygieneForm({...hygieneForm, waterPurity: e.target.checked})}
                      style={styles.checkbox} 
                    />
                    <span>Air Pencucian Sayur Bebas Endapan (Filter Aktif)</span>
                  </label>
                  <label style={styles.checkLabel}>
                    <input 
                      type="checkbox" 
                      checked={hygieneForm.utensilsSterile} 
                      onChange={(e) => setHygieneForm({...hygieneForm, utensilsSterile: e.target.checked})}
                      style={styles.checkbox} 
                    />
                    <span>Wadah Box Makanan & Alat Masak Disterilisasi Uap Panas</span>
                  </label>
                </div>

                <button type="submit" style={{ ...styles.actionBtn, backgroundColor: 'var(--c-dapur)' }}>
                  Submit Verifikasi Higienitas
                </button>
              </form>
            )}
          </div>
        </>
      )}

      {/* Tab 2: COOK PLANNER */}
      {activeTab === 'cook' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>👩‍🍳 Rencana Masak & Porsi Reaktif</h2>
          <p style={styles.tabSubheading}>
            Jumlah porsi yang harus dimasak di bawah ini disinkronisasikan secara real-time dengan data absensi kelas harian yang diinput oleh Koordinator Sekolah pagi ini.
          </p>

          <div style={styles.cookTargetBox}>
            <div style={styles.cookTargetLeft}>
              <span style={styles.cookTargetLabel}>TOTAL PRODUKSI MAKANAN HARI INI:</span>
              <span style={styles.cookTargetVal}>{totalCookTarget} Porsi Hangat</span>
            </div>
            <div style={styles.cookTargetRight}>
              <span>🎯 Kapasitas Maks. SPPG: 500 Porsi</span>
            </div>
          </div>

          <div style={styles.schoolList}>
            <h4 style={styles.subTitle}>Detail Kehadiran per Sekolah:</h4>
            <div style={styles.schoolTable}>
              <div style={styles.tableRowHeader}>
                <span>Nama Sekolah</span>
                <span style={{ textAlign: 'center' }}>Status Input</span>
                <span style={{ textAlign: 'right' }}>Jumlah Porsi (Siswa Hadir)</span>
              </div>
              
              {attendance.map((sch) => (
                <div key={sch.id} style={styles.tableRow}>
                  <div style={styles.schoolNameCol}>
                    <span style={styles.schNameText}>{sch.name}</span>
                    <span style={styles.originalVal}>Target Asli Terdaftar: {sch.originalStudents} porsi</span>
                  </div>
                  <span style={{ textAlign: 'center' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>✓ {sch.status}</span>
                  </span>
                  <span style={{ textAlign: 'right', fontWeight: '800', fontSize: '1.05rem', color: 'var(--c-dapur)' }}>
                    {sch.students} Porsi
                  </span>
                </div>
              ))}
            </div>
            <div style={styles.syncAlert}>
              <CheckCircle size={14} /> <span>**Sinkronisasi Real-time Aktif**: Buka simulator **Koordinator Sekolah**, ubah kehadirannya, dan saksikan angka porsi masak di sini langsung berubah tanpa reload halaman!</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: INVENTORY & RE-ORDER */}
      {activeTab === 'stock' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={styles.titleBanner} style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div>
              <h2 style={styles.cardSectionTitle}>🛒 Kontrol Inventaris Bahan Makanan SPPG</h2>
              <p style={styles.tabSubheading}>Data stok bahan basah segar (daging/sayur) dan bahan kering. Klik Re-Order untuk memesan ke petani/UMKM lokal.</p>
            </div>
            <button 
              onClick={() => {
                setPoItem('Daging Ayam Fillet');
                setPoQty('40 kg');
                setPoPrice(1600000);
                setShowPoModal(true);
              }}
              style={styles.btnAddPO}
            >
              <Plus size={16} /> <span>Pesan Bahan Baku (PO)</span>
            </button>
          </div>

          <div style={styles.inventoryGrid}>
            {inventory.map((item) => (
              <div key={item.id} style={styles.invCard}>
                <div style={styles.invHeader}>
                  <span style={styles.invName}>{item.name}</span>
                  <span className={`badge ${item.status === 'Aman' ? 'badge-success' : 'badge-danger'}`}>
                    {item.status}
                  </span>
                </div>
                
                <div style={styles.invBody}>
                  <span style={styles.invQtyVal}>{item.qty} <span style={styles.invUnit}>{item.unit}</span></span>
                  <div style={styles.progressBarBg}>
                    <div 
                      style={{ 
                        ...styles.progressBarFill, 
                        width: `${Math.min(100, (item.qty / (item.minQty * 2.5)) * 100)}%`,
                        backgroundColor: item.status === 'Aman' ? '#10b981' : '#dc2626'
                      }} 
                    />
                  </div>
                  <span style={styles.minQtyText}>Batas Min. Stok Aman: {item.minQty} {item.unit}</span>
                </div>

                {item.status === 'Kritis' && (
                  <button 
                    onClick={() => {
                      setPoItem(item.name.includes('Ayam') ? 'Daging Ayam Fillet Segar' : item.name.includes('Beras') ? 'Beras Pandan Wangi' : item.name);
                      setPoQty(item.name.includes('Susu') ? '120 Pcs' : '50 kg');
                      setPoPrice(item.name.includes('Susu') ? 800000 : 1500000);
                      setShowPoModal(true);
                    }}
                    style={styles.invReorderBtn}
                  >
                    Minta Kirim Ulang (Re-Order)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: DISPATCH / LOGISTIK */}
      {activeTab === 'dispatch' && (
        <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={styles.cardSectionTitle}>📦 Dispatch & Logistik Box Makanan</h2>
          <p style={styles.tabSubheading}>Setelah makanan selesai dimasak dan dikemas ke dalam thermal box hangat, rilis status logistik agar kurir dapat berangkat melakukan pengiriman.</p>

          <div style={styles.dispatchList}>
            {deliveries.map((del) => (
              <div key={del.id} style={styles.dCard}>
                <div style={styles.dLeft}>
                  <div style={styles.dAvatar}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 style={styles.dSchoolName}>{del.schoolName}</h4>
                    <div style={styles.dMeta}>
                      <span>📦 {del.porsi} Porsi</span>
                      <span>🛵 Kurir: **{del.courierName}** ({del.courierPhone})</span>
                    </div>
                  </div>
                </div>

                <div style={styles.dRight}>
                  {del.status === 'Menunggu Dapur' ? (
                    <button 
                      onClick={() => {
                        dispatchDelivery(del.id);
                        alert(`Makanan berhasil didispatch ke kurir ${del.courierName}! Rute pengiriman GPS kurir telah aktif.`);
                      }}
                      style={styles.btnDispatch}
                    >
                      <Play size={14} />
                      <span>Rilis & Kirim Makanan</span>
                    </button>
                  ) : del.status === 'Dalam Perjalanan' ? (
                    <div style={styles.transitBadge}>
                      <Clock size={14} className="spin-slow" />
                      <span>Dalam Transit (ETA: {del.eta}) • Suhu: {del.temp}</span>
                    </div>
                  ) : (
                    <div style={styles.deliveredBadge}>
                      <CheckCircle size={14} />
                      <span>Telah Diterima Sekolah • POD Valid</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PURCHASE ORDER (PO) DIALOG MODAL */}
      {showPoModal && (
        <div style={styles.modalBg}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>🚜 Ajukan PO Bahan Pangan Segar</h3>
              <button onClick={() => setShowPoModal(false)} style={styles.closeModalBtn}>✖</button>
            </div>
            
            <form onSubmit={handlePlacePO} style={styles.poFormLayout}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Komoditas Bahan Baku:</label>
                <input 
                  type="text" 
                  value={poItem} 
                  onChange={(e) => setPoItem(e.target.value)}
                  className="form-input" 
                  required
                />
              </div>

              <div style={{ ...styles.formGroup, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={styles.formLabel}>Kuantitas Kebutuhan:</label>
                  <input 
                    type="text" 
                    value={poQty} 
                    onChange={(e) => setPoQty(e.target.value)}
                    className="form-input" 
                    placeholder="Contoh: 50 kg"
                    required
                  />
                </div>
                <div>
                  <label style={styles.formLabel}>Estimasi Harga HPP:</label>
                  <input 
                    type="number" 
                    value={poPrice} 
                    onChange={(e) => setPoPrice(e.target.value)}
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div style={styles.supplierUmkmNote}>
                <span>🌾 Pesanan akan otomatis dialokasikan ke **Kelompok Petani & Peternak Lokal Mitra SPPG** terdaftar.</span>
              </div>

              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  onClick={() => setShowPoModal(false)}
                  className="btn-premium btn-secondary"
                >Batal</button>
                <button 
                  type="submit" 
                  className="btn-premium btn-primary"
                >Ajukan Ke Yayasan</button>
              </div>
            </form>
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
  checklistCard: {
    backgroundColor: 'var(--bg-secondary)',
  },
  cardSectionTitle: {
    fontSize: '1.05rem',
    fontWeight: '800',
  },
  qcClearedBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '20px',
    borderRadius: '14px',
    marginTop: '16px',
  },
  qcClearedTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#047857',
  },
  qcClearedDesc: {
    fontSize: '0.8rem',
    color: '#059669',
    lineHeight: '1.4',
  },
  qcForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '16px',
  },
  formCheckGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  actionBtn: {
    alignSelf: 'flex-start',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  cookTargetBox: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cookTargetLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  cookTargetLabel: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  cookTargetVal: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--c-dapur)',
    fontFamily: 'var(--font-title)',
  },
  cookTargetRight: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-secondary)',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  subTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    marginBottom: '8px',
  },
  schoolList: {
    marginTop: '8px',
  },
  schoolTable: {
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'var(--bg-secondary)',
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
  schoolNameCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  schNameText: {
    fontWeight: '800',
  },
  originalVal: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  syncAlert: {
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.72rem',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    color: '#059669',
    padding: '8px 12px',
    borderRadius: '8px',
    fontWeight: '600',
  },
  btnAddPO: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'var(--c-dapur)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  inventoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '20px',
    marginTop: '8px',
  },
  invCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: 'var(--shadow-sm)',
  },
  invHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invName: {
    fontSize: '0.85rem',
    fontWeight: '800',
  },
  invBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  invQtyVal: {
    fontSize: '1.4rem',
    fontWeight: '800',
    fontFamily: 'var(--font-title)',
  },
  invUnit: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  progressBarBg: {
    height: '6px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  },
  minQtyText: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  invReorderBtn: {
    width: '100%',
    padding: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#dc2626',
    borderRadius: '8px',
    fontSize: '0.72rem',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  dispatchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  dCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
  },
  dLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  dAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    color: '#0284c7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dSchoolName: {
    fontSize: '0.9rem',
    fontWeight: '800',
  },
  dMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  dRight: {},
  btnDispatch: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  transitBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    color: '#0284c7',
    border: '1px solid rgba(2, 132, 199, 0.15)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  deliveredBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    color: '#059669',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  modalBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    padding: '24px',
    boxShadow: 'var(--shadow-lg)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '12px',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '1rem',
    fontWeight: '800',
  },
  closeModalBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  poFormLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  supplierUmkmNote: {
    backgroundColor: 'rgba(244, 63, 94, 0.05)',
    border: '1px solid rgba(244, 63, 94, 0.15)',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '0.7rem',
    color: 'var(--c-supplier)',
    fontWeight: '600',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
};

export default DapurDashboard;
