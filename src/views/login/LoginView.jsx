import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Shield, ChevronRight, Layout, Landmark, ChefHat, Tractor } from 'lucide-react';

const LoginView = () => {
  const { setCurrentRole } = useContext(AppContext);

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
                  onClick={() => setCurrentRole(role.id)}
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
