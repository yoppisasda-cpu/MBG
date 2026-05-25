import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

const PhoneFrame = ({ children, title = 'MBG Mobile' }) => {
  // Get current local time format for phone status bar
  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.phoneShadow} />
      <div style={styles.phoneBody}>
        {/* Notch / Speaker */}
        <div style={styles.notch}>
          <div style={styles.speaker} />
          <div style={styles.camera} />
        </div>
        
        {/* Status Bar */}
        <div style={styles.statusBar}>
          <span style={styles.time}>{formatTime()}</span>
          <div style={styles.statusIcons}>
            <Signal size={13} style={styles.icon} />
            <span style={styles.g5}>5G</span>
            <Wifi size={13} style={styles.icon} />
            <Battery size={16} style={styles.icon} />
          </div>
        </div>

        {/* Screen Header */}
        <div style={styles.screenHeader}>
          <div style={styles.indicatorContainer}>
            <span style={styles.onlineDot} />
            <span style={styles.appName}>{title}</span>
          </div>
          <span style={styles.roleBadge}>PILOT TESTING</span>
        </div>

        {/* Screen Content Wrapper */}
        <div style={styles.screenContent} className="custom-scroll">
          {children}
        </div>

        {/* Home Indicator */}
        <div style={styles.homeIndicatorContainer}>
          <div style={styles.homeIndicator} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
    zIndex: 10,
  },
  phoneShadow: {
    position: 'absolute',
    width: '375px',
    height: '760px',
    borderRadius: '44px',
    background: 'rgba(0, 0, 0, 0.15)',
    filter: 'blur(20px)',
    transform: 'translateY(15px)',
    zIndex: 1,
  },
  phoneBody: {
    position: 'relative',
    width: '375px',
    height: '760px',
    backgroundColor: 'var(--bg-primary)',
    border: '12px solid #0f172a',
    borderRadius: '44px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    zIndex: 2,
    transition: 'background-color var(--transition-normal)',
  },
  notch: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '160px',
    height: '24px',
    backgroundColor: '#0f172a',
    borderBottomLeftRadius: '18px',
    borderBottomRightRadius: '18px',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  speaker: {
    width: '45px',
    height: '4px',
    backgroundColor: '#334155',
    borderRadius: '2px',
  },
  camera: {
    width: '7px',
    height: '7px',
    backgroundColor: '#1e293b',
    borderRadius: '50%',
  },
  statusBar: {
    height: '40px',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#0f172a',
    zIndex: 90,
    backgroundColor: 'transparent',
    paddingBottom: '4px',
    fontFamily: 'var(--font-title)',
  },
  statusIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  time: {
    letterSpacing: '-0.01em',
  },
  g5: {
    fontSize: '0.65rem',
    fontWeight: '800',
    marginRight: '2px',
  },
  icon: {
    opacity: 0.8,
  },
  screenHeader: {
    height: '45px',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    zIndex: 50,
  },
  indicatorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  onlineDot: {
    width: '7px',
    height: '7px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    boxShadow: '0 0 8px #10b981',
  },
  appName: {
    fontSize: '0.85rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    fontFamily: 'var(--font-title)',
  },
  roleBadge: {
    fontSize: '0.65rem',
    fontWeight: '800',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: '#d97706',
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '0.02em',
  },
  screenContent: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  homeIndicatorContainer: {
    height: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--bg-primary)',
    zIndex: 50,
  },
  homeIndicator: {
    width: '120px',
    height: '4px',
    backgroundColor: '#94a3b8',
    borderRadius: '2px',
  },
};

export default PhoneFrame;
