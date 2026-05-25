import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Truck, MapPin, Compass, Navigation, CheckCircle, Clock, AlertCircle, Play, QrCode } from 'lucide-react';

const KurirView = () => {
  const { deliveries, dispatchDelivery, completeDelivery } = useContext(AppContext);
  const [activeDeliveryId, setActiveDeliveryId] = useState('d1');
  const [transitProgress, setTransitProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const activeDel = deliveries.find(d => d.id === activeDeliveryId) || deliveries[0];

  // GPS Simulation effect
  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setTransitProgress(prev => {
          if (prev >= 100) {
            setIsSimulating(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Start route simulation
  const startSimulation = () => {
    if (activeDel.status === 'Menunggu Dapur') {
      alert('Maaf, makanan belum selesai dimasak di Dapur SPPG. Silakan minta dapur meluncurkan pengiriman terlebih dahulu!');
      return;
    }
    setTransitProgress(0);
    setIsSimulating(true);
  };

  // Get coordinates display based on simulation progress
  const getSimCoordinates = (progress) => {
    const startLat = -6.2297;
    const startLng = 106.7978; // Kebayoran Baru
    const endLat = -6.2442;
    const endLng = 106.7725; // Kebayoran Lama

    const currentLat = startLat + (endLat - startLat) * (progress / 100);
    const currentLng = startLng + (endLng - startLng) * (progress / 100);

    return `${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`;
  };

  // Complete manually
  const handleManualPOD = () => {
    completeDelivery(activeDel.id, 5, 'Serah terima manual disetujui kurir. Gizi box aman.');
    alert('Serah terima terkonfirmasi manual via Proof of Delivery kurir!');
  };

  return (
    <div style={styles.container}>
      {/* Courier Profile */}
      <div style={styles.profileHeader}>
        <div style={styles.avatar}>
          <Truck size={20} style={{ color: 'white' }} />
        </div>
        <div style={styles.profileInfo}>
          <h3 style={styles.driverName}>Joko Prabowo (Kurir #4)</h3>
          <span style={styles.subtext}>SPPG Melati Kebayoran • Aktif</span>
        </div>
      </div>

      {/* Select Active Job */}
      <div style={styles.jobSelector}>
        <span style={styles.sectionLabel}>Daftar Tugas Pengantaran Hari Ini:</span>
        <div style={styles.jobList}>
          {deliveries.map(del => (
            <button
              key={del.id}
              onClick={() => {
                setActiveDeliveryId(del.id);
                setTransitProgress(del.status === 'Selesai' ? 100 : 0);
                setIsSimulating(false);
              }}
              style={{
                ...styles.jobCard,
                ...(activeDeliveryId === del.id ? styles.activeJobCard : {}),
              }}
            >
              <div style={styles.jobRow}>
                <span style={styles.schoolName}>{del.schoolName}</span>
                <span className={`badge ${del.status === 'Selesai' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.55rem', padding: '1px 6px' }}>
                  {del.status}
                </span>
              </div>
              <div style={styles.jobSubRow}>
                <span>📦 {del.porsi} Porsi</span>
                <span>🌡️ {del.temp}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* active Job Action Panel */}
      <div style={styles.activeJobPanel}>
        <h4 style={styles.panelTitle}>🗺️ Rute Pengiriman Aktif</h4>
        
        <div style={styles.routeTrace}>
          <div style={styles.traceNode}>
            <MapPin size={14} style={{ color: 'var(--c-dapur)' }} />
            <div style={styles.nodeText}>
              <span style={styles.nodeName}>SPPG Melati Kebayoran</span>
              <span style={styles.nodeRole}>Asal Masakan</span>
            </div>
          </div>
          
          <div style={styles.routeLine} />
          
          <div style={styles.traceNode}>
            <MapPin size={14} style={{ color: 'var(--c-sekolah)' }} />
            <div style={styles.nodeText}>
              <span style={styles.nodeName}>{activeDel.schoolName}</span>
              <span style={styles.nodeRole}>Tujuan Penerima</span>
            </div>
          </div>
        </div>

        {/* Status display */}
        {activeDel.status === 'Menunggu Dapur' ? (
          <div style={styles.waitBox}>
            <AlertCircle size={18} style={{ color: '#d97706' }} />
            <p style={styles.waitText}>
              Dapur belum menyelesaikan pengemasan makanan. Minta pihak Dapur SPPG untuk klik "Kirim Makanan" untuk merilis logistik kurir!
            </p>
          </div>
        ) : activeDel.status === 'Dalam Perjalanan' ? (
          <div style={styles.transitControls}>
            {/* Simulation Progress bar */}
            <div style={styles.progressContainer}>
              <div style={styles.progressHeader}>
                <span style={styles.progressTitle}>Simulasi GPS Transit:</span>
                <span style={styles.progressPercent}>{transitProgress}%</span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${transitProgress}%` }} />
              </div>
              <div style={styles.gpsReadout}>
                <Compass size={12} />
                <span>Koordinat: {getSimCoordinates(transitProgress)}</span>
              </div>
            </div>

            {transitProgress < 100 ? (
              <button 
                onClick={startSimulation} 
                disabled={isSimulating}
                style={{
                  ...styles.actionBtn,
                  backgroundColor: 'var(--c-kurir)',
                  opacity: isSimulating ? 0.6 : 1
                }}
              >
                <Play size={16} />
                <span>{isSimulating ? 'Sedang Bergerak...' : 'Simulasikan Perjalanan'}</span>
              </button>
            ) : (
              <div style={styles.arrivalActions}>
                <div style={styles.arrivalBadge}>
                  <CheckCircle size={14} /> Tiba di Lokasi Sekolah
                </div>
                <div style={styles.btnRow}>
                  <button 
                    onClick={() => setShowQrModal(true)} 
                    style={styles.qrShowBtn}
                  >
                    <QrCode size={16} />
                    <span>Tampilkan QR Terima</span>
                  </button>
                  <button 
                    onClick={handleManualPOD} 
                    style={styles.podBtn}
                  >
                    POD Manual
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.completedBox}>
            <CheckCircle size={32} style={{ color: '#10b981' }} />
            <div>
              <h5 style={styles.completedTitle}>Tugas Selesai!</h5>
              <p style={styles.completedDesc}>Makanan berhasil diserahterimakan pada {activeDel.timeCompleted}</p>
            </div>
          </div>
        )}
      </div>

      {/* QR CODE POPUP MODAL */}
      {showQrModal && (
        <div style={styles.qrModal}>
          <div style={styles.qrContent}>
            <div style={styles.qrHeader}>
              <span style={styles.qrTitle}>QR Serah Terima Gizi</span>
              <button onClick={() => setShowQrModal(false)} style={styles.closeBtn}>✖</button>
            </div>
            <p style={styles.qrDesc}>
              Minta Koordinator Sekolah memindai QR Code ini untuk menyelesaikan serah terima digital harian.
            </p>
            
            <div style={styles.qrBox}>
              <QrCode size={140} style={{ color: 'var(--c-kurir)' }} />
              <div style={styles.qrLabel}>ID: {activeDel.id}-{activeDel.porsi}p</div>
            </div>

            <div style={styles.tipBox}>
              <p style={styles.tipText}>
                *Buka tab/simulator **Koordinator Sekolah** untuk memindai QR Code ini dan menyelesaikan siklus.*
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    height: '100%',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: 'var(--c-kurir)',
    borderRadius: '16px',
    color: 'white',
    boxShadow: 'var(--shadow-sm)',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  driverName: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: 'white',
  },
  subtext: {
    fontSize: '0.65rem',
    color: '#f3e8ff',
    fontWeight: '500',
  },
  jobSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionLabel: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: 'var(--text-secondary)',
  },
  jobList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  jobCard: {
    padding: '10px 14px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1.5px solid var(--border-color)',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    transition: 'all var(--transition-fast)',
    fontFamily: 'var(--font-title)',
  },
  activeJobCard: {
    borderColor: 'var(--c-kurir)',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  jobRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  schoolName: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  jobSubRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  activeJobPanel: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: 'var(--shadow-sm)',
  },
  panelTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
  },
  routeTrace: {
    backgroundColor: 'var(--bg-tertiary)',
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    position: 'relative',
  },
  traceNode: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    zIndex: 10,
  },
  nodeText: {
    display: 'flex',
    flexDirection: 'column',
  },
  nodeName: {
    fontSize: '0.75rem',
    fontWeight: '800',
  },
  nodeRole: {
    fontSize: '0.58rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  routeLine: {
    position: 'absolute',
    left: '18px',
    top: '25px',
    height: '25px',
    width: '2px',
    backgroundColor: 'var(--border-focus)',
    zIndex: 1,
  },
  waitBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    padding: '12px',
    borderRadius: '12px',
  },
  waitText: {
    fontSize: '0.68rem',
    color: '#d97706',
    lineHeight: '1.4',
    fontWeight: '600',
  },
  transitControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  progressTitle: {},
  progressPercent: {
    fontWeight: '800',
    color: 'var(--c-kurir)',
  },
  progressBarBg: {
    height: '8px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--c-kurir)',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  gpsReadout: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.62rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    color: 'white',
    fontWeight: '800',
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  arrivalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  arrivalBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
    fontSize: '0.72rem',
    fontWeight: '800',
    padding: '6px',
    borderRadius: '8px',
  },
  btnRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '6px',
  },
  qrShowBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    backgroundColor: 'var(--c-kurir)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '800',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  podBtn: {
    padding: '10px',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    fontWeight: '800',
    fontSize: '0.72rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  completedBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '12px',
    borderRadius: '12px',
  },
  completedTitle: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#047857',
  },
  completedDesc: {
    fontSize: '0.65rem',
    color: '#059669',
  },
  qrModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  qrContent: {
    width: '100%',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '24px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
  },
  qrHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '8px',
  },
  qrTitle: {
    fontSize: '0.82rem',
    fontWeight: '800',
    fontFamily: 'var(--font-title)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  qrDesc: {
    fontSize: '0.68rem',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    lineHeight: '1.4',
  },
  qrBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
  },
  qrLabel: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#0f172a',
    backgroundColor: '#f1f5f9',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  tipBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    padding: '8px 12px',
    borderRadius: '10px',
  },
  tipText: {
    fontSize: '0.62rem',
    color: 'var(--c-kurir)',
    textAlign: 'center',
    fontWeight: '700',
  },
};

export default KurirView;
