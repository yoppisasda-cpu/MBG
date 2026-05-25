import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Shield, ChevronRight, Layout, Landmark, ChefHat, Tractor } from 'lucide-react';

const LoginView = () => {
  const { setCurrentRole, yayasans, setActiveYayasanId, registerYayasan } = useContext(AppContext);
  const [showYayasanPicker, setShowYayasanPicker] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newZone, setNewZone] = useState('');
  const [newLogo, setNewLogo] = useState('🏫');
  const [newPassword, setNewPassword] = useState('');
  
  // State for Yayasan Access Verification
  const [selectedYayasanForLogin, setSelectedYayasanForLogin] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const rolesList = [
    {
      id: 'yayasan',
      title: 'Yayasan / Manajemen Pusat',
      desc: 'Pengawasan makro gizi, audit keuangan SPPG, persetujuan PO supplier, & monitoring nasional.',
      type: 'Web Dashboard',
      icon: Landmark,
      color: 'var(--c-yayasan)',
      bgLight: 'rgba(79, 70, 229, 0.08)'
    },
    {
      id: 'dapur',
      title: 'Dapur SPPG (Operasional)',
      desc: 'Manajemen masak harian, pengisian checklist QC gizi, kontrol stok inventaris, & serah terima kurir.',
      type: 'Web Dashboard',
      icon: ChefHat,
      color: 'var(--c-dapur)',
      bgLight: 'rgba(16, 185, 129, 0.08)'
    },
    {
      id: 'supplier',
      title: 'Supplier / UMKM Lokal',
      desc: 'Terima PO bahan baku dari dapur SPPG, konfirmasi pengiriman pangan segar, & e-invoice tagihan.',
      type: 'Web Portal / PWA',
      icon: Tractor,
      color: 'var(--c-supplier)',
      bgLight: 'rgba(244, 63, 94, 0.08)'
    }
  ];

  if (showYayasanPicker && selectedYayasanForLogin) {
    return (
      <div style={styles.container} className="animate-fade-in">
        <div style={styles.blurBackground1} />
        <div style={styles.blurBackground2} />

        <div style={styles.card}>
          <div style={styles.brandHeader}>
            <div style={styles.logoBadge}>
              <span style={{ fontSize: '2rem' }}>{selectedYayasanForLogin.logo}</span>
            </div>
            <h2 style={styles.mainTitle}>Verifikasi Akses</h2>
            <p style={styles.mainSubtitle}>
              Masukkan password akses untuk masuk ke portal **{selectedYayasanForLogin.name}**.
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === selectedYayasanForLogin.password) {
              setActiveYayasanId(selectedYayasanForLogin.id);
              setCurrentRole('yayasan');
              setSelectedYayasanForLogin(null);
              setPasswordInput('');
              setPasswordError('');
              setShowYayasanPicker(false);
            } else {
              setPasswordError('❌ Password Akses Salah! Silakan coba lagi.');
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#cbd5e1', fontFamily: 'var(--font-title)' }}>
                PASSWORD AKSES YAYASAN
              </label>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (passwordError) setPasswordError('');
                }} 
                placeholder="Masukkan password"
                required
                autoFocus
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#1f2937',
                  border: passwordError ? '1.5px solid #ef4444' : '1.5px solid #374151',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  textAlign: 'center',
                  letterSpacing: '0.15em'
                }} 
              />
              {passwordError && (
                <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '700', textAlign: 'center', marginTop: '4px' }}>
                  {passwordError}
                </span>
              )}
            </div>

            <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.04)', padding: '12px 16px', borderRadius: '12px', border: '1px dashed rgba(79, 70, 229, 0.15)', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>
              💡 *Hint Demo:* Password default untuk **Yayasan Gizi Melati** adalah <code>melati123</code> dan untuk **Yayasan Gizi Harmoni** adalah <code>harmoni123</code>.
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button 
                type="submit"
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'var(--c-yayasan)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-title)',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                Verifikasi & Masuk Dashboard
              </button>
              <button 
                type="button"
                onClick={() => {
                  setSelectedYayasanForLogin(null);
                  setPasswordInput('');
                  setPasswordError('');
                }}
                style={{
                  padding: '14px 20px',
                  backgroundColor: 'transparent',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#94a3b8',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showYayasanPicker && showRegisterForm) {
    return (
      <div style={styles.container} className="animate-fade-in">
        <div style={styles.blurBackground1} />
        <div style={styles.blurBackground2} />

        <div style={styles.card}>
          <div style={styles.brandHeader}>
            <div style={styles.logoBadge}>
              <Landmark size={32} style={{ color: 'var(--c-yayasan)' }} />
            </div>
            <h2 style={styles.mainTitle}>Registrasi Yayasan Baru</h2>
            <p style={styles.mainSubtitle}>
              Daftarkan yayasan pengelola baru Anda ke dalam ekosistem sistem terintegrasi MBG-OPS.
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newName || !newZone || !newPassword) return alert('Mohon isi semua data yayasan!');
            const registeredId = registerYayasan(newName, newZone, newLogo, newPassword);
            setActiveYayasanId(registeredId);
            setCurrentRole('yayasan');
            // Reset states
            setNewName('');
            setNewZone('');
            setNewLogo('🏫');
            setNewPassword('');
            setShowRegisterForm(false);
            setShowYayasanPicker(false);
          }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#cbd5e1', fontFamily: 'var(--font-title)' }}>NAMA YAYASAN</label>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                placeholder="Contoh: Yayasan Gizi Sejahtera"
                required
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#1f2937',
                  border: '1.5px solid #374151',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#cbd5e1', fontFamily: 'var(--font-title)' }}>WILAYAH KERJA / KECAMATAN</label>
              <input 
                type="text" 
                value={newZone} 
                onChange={(e) => setNewZone(e.target.value)} 
                placeholder="Contoh: Lembang atau Bandung Barat"
                required
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#1f2937',
                  border: '1.5px solid #374151',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#cbd5e1', fontFamily: 'var(--font-title)' }}>PASSWORD AKSES BARU</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Buat password untuk login yayasan ini"
                required
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#1f2937',
                  border: '1.5px solid #374151',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#cbd5e1', fontFamily: 'var(--font-title)' }}>PILIH IKON BADGE</label>
              <select 
                value={newLogo} 
                onChange={(e) => setNewLogo(e.target.value)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#1f2937',
                  border: '1.5px solid #374151',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="🏫">🏫 Sekolah & Pendidikan</option>
                <option value="🌸">🌸 Bunga Melati (Gizi)</option>
                <option value="🍃">🍃 Daun Alami (Sehat)</option>
                <option value="☀️">☀️ Matahari (Semangat)</option>
                <option value="🍎">🍎 Buah Segar (Nutrisi)</option>
                <option value="⭐️">⭐️ Bintang (Apresiasi)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button 
                type="submit"
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'var(--c-yayasan)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-title)',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                Selesaikan Registrasi & Masuk Dashboard
              </button>
              <button 
                type="button"
                onClick={() => setShowRegisterForm(false)}
                style={{
                  padding: '14px 20px',
                  backgroundColor: 'transparent',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  color: '#94a3b8',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showYayasanPicker) {
    return (
      <div style={styles.container} className="animate-fade-in">
        <div style={styles.blurBackground1} />
        <div style={styles.blurBackground2} />

        <div style={styles.card}>
          <div style={styles.brandHeader}>
            <div style={styles.logoBadge}>
              <Landmark size={32} style={{ color: 'var(--c-yayasan)' }} />
            </div>
            <h2 style={styles.mainTitle}>Pilih Portal Yayasan Anda</h2>
            <p style={styles.mainSubtitle}>
              Silakan pilih entitas Yayasan pengelola program Makan Bergizi Gratis (MBG) untuk mengakses dashboard monitoring khusus.
            </p>
          </div>

          <div style={styles.gridSection}>
            <h3 style={styles.sectionDivider}>
              <Layout size={16} /> <span>ENTITAS YAYASAN AKTIF (MULTI-TENANT)</span>
            </h3>
            <div style={styles.rolesGrid}>
              {yayasans.map(y => (
                <div 
                  key={y.id} 
                  onClick={() => {
                    setSelectedYayasanForLogin(y);
                  }}
                  style={{ ...styles.roleCard, borderColor: 'var(--border-color)' }}
                  className="role-card-hover"
                >
                  <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--c-yayasan)', fontSize: '1.4rem' }}>
                    {y.logo}
                  </div>
                  <div style={styles.roleInfo}>
                    <div style={styles.roleTitleRow}>
                      <span style={styles.roleTitle}>{y.name}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 8px', backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--c-yayasan)', border: '1px solid rgba(79, 70, 229, 0.15)' }}>
                        Aktif
                      </span>
                    </div>
                    <p style={styles.roleDesc}>Wilayah Kerja: **Kec. {y.zone}** • Monitoring Dapur & Distribusi Sekolah</p>
                  </div>
                  <ChevronRight size={18} style={styles.chevron} />
                </div>
              ))}

              {/* SaaS Registration Trigger Card */}
              <div 
                onClick={() => setShowRegisterForm(true)}
                style={{
                  ...styles.roleCard,
                  borderColor: 'dashed rgba(79, 70, 229, 0.4)',
                  backgroundColor: 'rgba(79, 70, 229, 0.03)',
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  padding: '18px'
                }}
                className="role-card-hover"
              >
                <span style={{ color: 'var(--c-yayasan)', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.02em', fontFamily: 'var(--font-title)' }}>
                  ➕ DAFTARKAN YAYASAN BARU (REGISTRASI SAAS)
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowYayasanPicker(false)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#ffffff',
              fontWeight: '700',
              cursor: 'pointer',
              alignSelf: 'center',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-title)',
              transition: 'all 0.2s ease',
              marginTop: '12px'
            }}
          >
            Kembali ke Peran Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.blurBackground1} />
      <div style={styles.blurBackground2} />

      <div style={styles.card}>
        <div style={styles.brandHeader}>
          <div style={styles.logoBadge}>
            <Shield size={32} style={{ color: 'var(--c-yayasan)' }} />
          </div>
          <h2 style={styles.mainTitle}>Portal Terintegrasi MBG-OPS</h2>
          <p style={styles.mainSubtitle}>
            Aplikasi pengawasan operasional dan transparansi sosial program **Makan Bergizi Gratis (MBG)**. Silakan pilih peran masuk di bawah ini untuk memulai pengelolaan.
          </p>
        </div>

        {/* Categories Section */}
        <div style={styles.gridSection}>
          <h3 style={styles.sectionDivider}>
            <Layout size={16} /> <span>PILIH PERAN DASHBOARD OPERASIONAL (WEB)</span>
          </h3>
          <div style={styles.rolesGrid}>
            {rolesList.map(role => {
              const Icon = role.icon;
              return (
                <div 
                  key={role.id} 
                  onClick={() => {
                    if (role.id === 'yayasan') {
                      setShowYayasanPicker(true);
                    } else {
                      setCurrentRole(role.id);
                    }
                  }}
                  style={{ ...styles.roleCard, borderColor: 'var(--border-color)' }}
                  className="role-card-hover"
                >
                  <div style={{ ...styles.iconWrapper, backgroundColor: role.bgLight, color: role.color }}>
                    <Icon size={24} />
                  </div>
                  <div style={styles.roleInfo}>
                    <div style={styles.roleTitleRow}>
                      <span style={styles.roleTitle}>{role.title}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 8px', backgroundColor: role.bgLight, color: role.color, border: `1px solid ${role.bgLight}` }}>
                        {role.type}
                      </span>
                    </div>
                    <p style={styles.roleDesc}>{role.desc}</p>
                  </div>
                  <ChevronRight size={18} style={styles.chevron} />
                </div>
              );
            })}
          </div>
        </div>

        <div style={styles.footerNote}>
          <p>
            🛡️ *Sistem Terintegrasi Secara Real-time. Pengelolaan gizi, rantai pasok pangan segar, dan tata kelola dapur SPPG.*
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    backgroundColor: '#090d16',
    position: 'relative',
    overflow: 'hidden',
  },
  blurBackground1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(0,0,0,0) 70%)',
    filter: 'blur(40px)',
    zIndex: 1,
  },
  blurBackground2: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    width: '450px',
    height: '450px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0,0,0,0) 70%)',
    filter: 'blur(45px)',
    zIndex: 1,
  },
  card: {
    width: '100%',
    maxWidth: '860px',
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid #1f2937',
    borderRadius: '24px',
    padding: '48px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  brandHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  logoBadge: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    border: '1px solid rgba(79, 70, 229, 0.3)',
    boxShadow: '0 0 20px rgba(79, 70, 229, 0.2)',
  },
  mainTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.03em',
    fontFamily: 'var(--font-title)',
  },
  mainSubtitle: {
    fontSize: '1rem',
    color: '#94a3b8',
    maxWidth: '700px',
    lineHeight: '1.6',
    fontWeight: '500',
  },
  gridSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionDivider: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #1f2937',
    paddingBottom: '8px',
    fontFamily: 'var(--font-title)',
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '16px',
  },
  roleCard: {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer',
    transition: 'all var(--transition-normal)',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  roleTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  roleTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'var(--font-title)',
  },
  roleDesc: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    lineHeight: '1.4',
  },
  chevron: {
    color: '#475569',
    transition: 'transform var(--transition-fast), color var(--transition-fast)',
  },
  footerNote: {
    textAlign: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #1f2937',
    fontSize: '0.8rem',
    color: 'var(--c-yayasan)',
    fontWeight: '700',
  },
};

export default LoginView;
