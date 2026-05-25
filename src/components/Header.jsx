import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Shield, Bell, User, LogOut, RefreshCw } from 'lucide-react';

const Header = () => {
  const { currentRole, setCurrentRole } = useContext(AppContext);

  // Formatted Role Name for UI display
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'yayasan': return 'Yayasan / Manajemen Pusat';
      case 'dapur': return 'Dapur SPPG (Operasional)';
      case 'supplier': return 'Supplier / UMKM Lokal';
      default: return 'Demo Login';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'yayasan': return 'badge-role';
      case 'dapur': return 'badge-success';
      case 'supplier': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <div style={styles.logoContainer}>
          <Shield size={24} style={{ color: 'var(--color-role)' }} />
          <div>
            <h1 style={styles.title}>MBG-OPS</h1>
            <span style={styles.subtitle}>Makan Bergizi Gratis • Pilot</span>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        {/* Quick Role Switcher for Demo testing */}
        <div style={styles.switcherContainer}>
          <div style={styles.switcherLabel}>
            <RefreshCw size={14} style={styles.spinIcon} />
            <span>Switch Role (Localhost Demo):</span>
          </div>
          <select 
            value={currentRole} 
            onChange={(e) => setCurrentRole(e.target.value)}
            style={styles.select}
          >
            <option value="login">🚪 Logout / Login Portal</option>
            <option value="yayasan">🏢 Yayasan (Pusat Monitoring)</option>
            <option value="dapur">🍳 Dapur SPPG (Koki/Operasional)</option>
            <option value="supplier">🚜 Supplier / UMKM Bahan Pangan</option>
          </select>
        </div>

        {/* Action icons */}
        <div style={styles.iconButton}>
          <Bell size={18} />
          <span style={styles.notificationDot} />
        </div>

        {/* User Card */}
        {currentRole !== 'login' && (
          <div style={styles.userCard}>
            <div style={styles.avatar}>
              <User size={16} />
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>Administrator</span>
              <span className={`badge ${getRoleBadgeClass(currentRole)}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                {getRoleDisplayName(currentRole)}
              </span>
            </div>
            <button 
              onClick={() => setCurrentRole('login')} 
              style={styles.logoutBtn}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    height: '70px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow-sm)',
    transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: '800',
    lineHeight: '1',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  switcherContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
    marginRight: '12px',
  },
  switcherLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  spinIcon: {
    color: 'var(--color-role)',
  },
  select: {
    padding: '6px 12px',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  iconButton: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all var(--transition-fast)',
    border: '1px solid var(--border-color)',
  },
  notificationDot: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '8px',
    height: '8px',
    backgroundColor: '#dc2626',
    borderRadius: '50%',
    border: '2px solid var(--bg-tertiary)',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingLeft: '16px',
    borderLeft: '1px solid var(--border-color)',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: 'rgba(var(--color-role-hsl), 0.1)',
    color: 'var(--color-role)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    lineHeight: '1.2',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '700',
  },
  logoutBtn: {
    marginLeft: '6px',
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Header;
