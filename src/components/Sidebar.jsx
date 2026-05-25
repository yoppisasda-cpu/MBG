import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, Apple, ShieldCheck, ClipboardCheck, 
  ChefHat, Truck, ShoppingCart, Users, HeartHandshake, FileText, Settings
} from 'lucide-react';

const Sidebar = ({ activeTab = 'overview', setActiveTab }) => {
  const { currentRole } = useContext(AppContext);

  // Define menu items for each web role
  const getMenuItems = () => {
    switch (currentRole) {
      case 'yayasan':
        return [
          { id: 'overview', label: 'Dashboard Utama', icon: LayoutDashboard },
          { id: 'nutrition', label: 'Standar Gizi & Menu', icon: Apple },
          { id: 'qc', label: 'Audit Kualitas SPPG', icon: ShieldCheck },
          { id: 'finance', label: 'Anggaran & PO Supplier', icon: FileText },
          { id: 'relawan', label: 'Mobilisasi Relawan', icon: Users },
          { id: 'feedback', label: 'Aduan & Rating', icon: HeartHandshake },
        ];
      case 'dapur':
        return [
          { id: 'overview', label: 'Dapur Overview', icon: ChefHat },
          { id: 'cook', label: 'Rencana Memasak', icon: ClipboardCheck },
          { id: 'stock', label: 'Stok & Inventaris', icon: ShoppingCart },
          { id: 'dispatch', label: 'Logistik & Dispatch', icon: Truck },
        ];
      case 'supplier':
        return [
          { id: 'overview', label: 'Pesanan Masuk (PO)', icon: ShoppingCart },
          { id: 'billing', label: 'Tagihan & Invoice', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  if (menuItems.length === 0) return null;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.menuContainer}>
        <span style={styles.sectionHeader}>Navigasi Operasional</span>
        <ul style={styles.list}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id} style={styles.listItem}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    ...styles.menuButton,
                    ...(isActive ? styles.activeButton : {}),
                  }}
                >
                  <Icon size={18} style={isActive ? styles.activeIcon : styles.icon} />
                  <span>{item.label}</span>
                  {isActive && <div style={styles.activeIndicator} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div style={styles.footer}>
        <div style={styles.footerItem}>
          <Settings size={16} style={styles.icon} />
          <span>Pengaturan Sistem</span>
        </div>
        <span style={styles.version}>MBG-OPS v1.0.0-beta</span>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    height: 'calc(100vh - 70px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 16px',
    position: 'sticky',
    top: '70px',
    zIndex: 80,
    transition: 'all var(--transition-normal)',
  },
  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionHeader: {
    fontSize: '0.68rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    paddingLeft: '12px',
    marginBottom: '4px',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  listItem: {
    width: '100%',
  },
  menuButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all var(--transition-fast)',
    position: 'relative',
    fontFamily: 'var(--font-title)',
  },
  activeButton: {
    backgroundColor: 'rgba(var(--color-role-hsl), 0.08)',
    color: 'var(--color-role)',
    fontWeight: '700',
  },
  icon: {
    color: 'var(--text-muted)',
    transition: 'color var(--transition-fast)',
  },
  activeIcon: {
    color: 'var(--color-role)',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '25%',
    height: '50%',
    width: '4px',
    backgroundColor: 'var(--color-role)',
    borderRadius: '0 4px 4px 0',
  },
  footer: {
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all var(--transition-fast)',
  },
  version: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
    paddingLeft: '12px',
  },
};

export default Sidebar;
