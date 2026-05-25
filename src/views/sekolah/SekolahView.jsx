import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { School, Calendar, Users, Clipboard, CheckCircle, Truck, QrCode, Star, AlertTriangle, MessageSquare } from 'lucide-react';

const SekolahView = () => {
  const { attendance, updateAttendance, deliveries, completeDelivery } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('attendance'); // 'attendance', 'receive', 'review'
  
  // Local state for forms
  const mySchoolId = 'sch1'; // Simulation binds to SDN 01 Kebayoran Lama
  const schoolData = attendance.find(s => s.id === mySchoolId) || attendance[0];
  const activeDelivery = deliveries.find(d => d.schoolId === mySchoolId);
  
  const [studentInput, setStudentInput] = useState(schoolData.students.toString());
  const [showScanner, setShowScanner] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  // Submit attendance to SPPG
  const handleSendAttendance = () => {
    updateAttendance(mySchoolId, parseInt(studentInput) || 0);
    alert(`Sukses mengirim data kehadiran: ${studentInput} siswa. SPPG Melati Kebayoran telah menerima revisi rencana porsi memasak.`);
  };

  // Perform mock QR verification
  const handleVerifyQR = () => {
    completeDelivery(activeDelivery.id, selectedRating, commentText || 'Sangat baik. Porsi hangat dan jumlah pas!');
    setShowScanner(false);
    setActiveSubTab('review');
    setIsRatingSubmitted(true);
  };

  return (
    <div style={styles.container}>
      {/* School Title Card */}
      <div style={styles.schoolHeader}>
        <div style={styles.avatar}>
          <School size={20} style={{ color: 'white' }} />
        </div>
        <div style={styles.schoolInfo}>
          <h3 style={styles.schoolName}>{schoolData.name}</h3>
          <span style={styles.subtext}>Kec. Kebayoran Lama, Jaksel</span>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div style={styles.mobileTabs}>
        <button 
          onClick={() => setActiveSubTab('attendance')} 
          style={{ ...styles.tabButton, ...(activeSubTab === 'attendance' ? styles.activeTabButton : {}) }}
        >
          <Users size={16} />
          <span>Absen</span>
        </button>
        <button 
          onClick={() => setActiveSubTab('receive')} 
          style={{ ...styles.tabButton, ...(activeSubTab === 'receive' ? styles.activeTabButton : {}) }}
        >
          <Truck size={16} />
          <span>Terima</span>
        </button>
        <button 
          onClick={() => setActiveSubTab('review')} 
          style={{ ...styles.tabButton, ...(activeSubTab === 'review' ? styles.activeTabButton : {}) }}
        >
          <Star size={16} />
          <span>Ulas</span>
        </button>
      </div>

      {/* Sub-Tab Contents */}
      <div style={styles.contentArea}>
        
        {/* TAB 1: ATTENDANCE INPUT */}
        {activeSubTab === 'attendance' && (
          <div style={styles.card} className="animate-fade-in">
            <div style={styles.titleRow}>
              <Clipboard size={18} style={{ color: 'var(--c-sekolah)' }} />
              <h4 style={styles.cardTitle}>Absensi Harian Siswa</h4>
            </div>
            <p style={styles.cardDesc}>
              Kirimkan jumlah siswa yang hadir hari ini sebelum pukul **07.30 WIB** agar dapur SPPG memasak porsi yang tepat dan mencegah makanan terbuang.
            </p>

            <div style={styles.inputContainer}>
              <label style={styles.label}>Siswa Hadir Hari Ini:</label>
              <div style={styles.numberAdjuster}>
                <button 
                  onClick={() => setStudentInput(prev => Math.max(0, parseInt(prev) - 5).toString())}
                  style={styles.adjustBtn}
                >-</button>
                <input 
                  type="number" 
                  value={studentInput} 
                  onChange={(e) => setStudentInput(e.target.value)}
                  style={styles.numberInput} 
                />
                <button 
                  onClick={() => setStudentInput(prev => (parseInt(prev) + 5).toString())}
                  style={styles.adjustBtn}
                >+</button>
              </div>
            </div>

            <div style={styles.attendanceStatus}>
              <div style={styles.statusDotActive} />
              <div style={styles.statusText}>
                <span>Status Kirim: **{schoolData.status}**</span>
                <span style={styles.timestamp}>Diupdate: {schoolData.updated}</span>
              </div>
            </div>

            <button 
              onClick={handleSendAttendance} 
              style={{ ...styles.actionBtn, backgroundColor: 'var(--c-sekolah)' }}
            >
              Kirim Update Kehadiran
            </button>
          </div>
        )}

        {/* TAB 2: RECEIVE MEAL / QR SCAN */}
        {activeSubTab === 'receive' && (
          <div style={styles.card} className="animate-fade-in">
            <div style={styles.titleRow}>
              <Truck size={18} style={{ color: 'var(--c-sekolah)' }} />
              <h4 style={styles.cardTitle}>Status Pengantaran Makanan</h4>
            </div>

            {activeDelivery ? (
              <div style={styles.deliveryDetails}>
                <div style={styles.deliveryStatusRow}>
                  <span style={styles.statusLabel}>Status Logistik:</span>
                  <span className={`badge ${activeDelivery.status === 'Selesai' ? 'badge-success' : 'badge-warning'}`}>
                    {activeDelivery.status}
                  </span>
                </div>
                
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Jumlah Porsi</span>
                    <span style={styles.infoVal}>{activeDelivery.porsi} Porsi</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Suhu Box</span>
                    <span style={styles.infoVal} style={{ ...styles.infoVal, color: '#059669' }}>{activeDelivery.temp}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Kurir</span>
                    <span style={styles.infoVal}>{activeDelivery.courierName}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>ETA</span>
                    <span style={styles.infoVal} style={{ ...styles.infoVal, color: 'var(--c-sekolah)' }}>{activeDelivery.eta}</span>
                  </div>
                </div>

                {activeDelivery.status === 'Dalam Perjalanan' && (
                  <button 
                    onClick={() => setShowScanner(true)} 
                    style={styles.qrBtn}
                  >
                    <QrCode size={18} />
                    <span>Scan QR Serah Terima</span>
                  </button>
                )}

                {activeDelivery.status === 'Selesai' && (
                  <div style={styles.successReceipt}>
                    <CheckCircle size={32} style={{ color: '#10b981' }} />
                    <div>
                      <h5 style={styles.successTitle}>Serah Terima Sukses</h5>
                      <p style={styles.successDesc}>Diterima pukul {activeDelivery.timeCompleted}</p>
                    </div>
                  </div>
                )}
                
                {activeDelivery.status === 'Menunggu Dapur' && (
                  <div style={styles.waitBox}>
                    <AlertTriangle size={18} style={{ color: '#d97706' }} />
                    <p style={styles.waitText}>
                      Makanan sedang dipersiapkan di Dapur SPPG Melati. Kurir belum diberangkatkan.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p style={styles.emptyText}>Tidak ada pengiriman aktif saat ini.</p>
            )}
          </div>
        )}

        {/* TAB 3: REVIEW / FEEDBACK */}
        {activeSubTab === 'review' && (
          <div style={styles.card} className="animate-fade-in">
            <div style={styles.titleRow}>
              <Star size={18} style={{ color: 'var(--c-sekolah)' }} />
              <h4 style={styles.cardTitle}>Evaluasi Gizi & Rasa</h4>
            </div>
            
            {isRatingSubmitted ? (
              <div style={styles.successReview}>
                <CheckCircle size={40} style={{ color: '#10b981' }} />
                <h4 style={styles.reviewCompletedTitle}>Terima Kasih Atas Ulasannya!</h4>
                <p style={styles.reviewCompletedDesc}>
                  Masukan Anda telah dikirim langsung ke Yayasan untuk diaudit gizi dan mutunya.
                </p>
                <button 
                  onClick={() => {
                    setIsRatingSubmitted(false);
                    setCommentText('');
                  }}
                  style={styles.btnResetReview}
                >
                  Tulis Ulasan Baru
                </button>
              </div>
            ) : (
              <div style={styles.reviewForm}>
                <p style={styles.cardDesc}>
                  Beri penilaian objektif masakan hari ini untuk menjaga standar gizi anak-anak.
                </p>

                <div style={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setSelectedRating(star)}
                      style={styles.starBtn}
                    >
                      <Star 
                        size={28} 
                        fill={star <= selectedRating ? '#f59e0b' : 'none'} 
                        color={star <= selectedRating ? '#f59e0b' : '#cbd5e1'} 
                      />
                    </button>
                  ))}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Catatan Kualitas & Rasa:</label>
                  <textarea 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Contoh: Nasi hangat, ayam bakar bumbunya lezat, sayuran segar terpotong rapi..." 
                    style={styles.textarea} 
                  />
                </div>

                <button 
                  onClick={() => setIsRatingSubmitted(true)}
                  style={{ ...styles.actionBtn, backgroundColor: 'var(--c-sekolah)' }}
                >
                  Kirim Ulasan Gizi
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SIMULATED QR CODE SCANNER MODAL */}
      {showScanner && (
        <div style={styles.scannerModal}>
          <div style={styles.scannerOverlay}>
            <div style={styles.scannerHeader}>
              <span style={styles.scannerTitle}>Simulasi QR Scanner</span>
              <button onClick={() => setShowScanner(false)} style={styles.closeModalBtn}>✖</button>
            </div>
            
            <div style={styles.cameraBox}>
              <div style={styles.scanTargetBorder} />
              <QrCode size={96} style={styles.scanQrIcon} />
              <p style={styles.scannerHint}>Dekatkan QR Code pengiriman kurir ke kamera...</p>
            </div>

            <div style={styles.scannerActions}>
              <button 
                onClick={handleVerifyQR}
                style={styles.btnVerifyScan}
              >
                ✓ Verifikasi Serah Terima
              </button>
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
  schoolHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: '#92400e', // dark amber
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
  schoolInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  schoolName: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: 'white',
  },
  subtext: {
    fontSize: '0.65rem',
    color: '#fef3c7',
    fontWeight: '500',
  },
  mobileTabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    backgroundColor: 'var(--bg-secondary)',
    padding: '6px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 0',
    border: 'none',
    backgroundColor: 'transparent',
    borderRadius: '8px',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
    transition: 'all var(--transition-fast)',
  },
  activeTabButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: 'var(--c-sekolah)',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: 'var(--shadow-sm)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '8px',
  },
  cardTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '4px',
  },
  label: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
  },
  numberAdjuster: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '8px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  adjustBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'var(--bg-secondary)',
    fontWeight: '800',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  numberInput: {
    width: '70px',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: '800',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
  },
  attendanceStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    padding: '8px 12px',
    borderRadius: '10px',
    fontSize: '0.68rem',
  },
  statusDotActive: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
  },
  statusText: {
    display: 'flex',
    flexDirection: 'column',
    color: 'var(--text-secondary)',
  },
  timestamp: {
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
  },
  actionBtn: {
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    fontFamily: 'var(--font-title)',
    transition: 'all var(--transition-fast)',
  },
  deliveryDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  deliveryStatusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.72rem',
    fontWeight: '700',
  },
  statusLabel: {
    color: 'var(--text-secondary)',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '10px',
    borderRadius: '12px',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  infoLabel: {
    fontSize: '0.58rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoVal: {
    fontSize: '0.78rem',
    fontWeight: '800',
  },
  qrBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'var(--c-sekolah)',
    color: 'white',
    fontWeight: '700',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  successReceipt: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '12px',
    borderRadius: '12px',
  },
  successTitle: {
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#047857',
  },
  successDesc: {
    fontSize: '0.65rem',
    color: '#059669',
  },
  waitBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    padding: '10px 12px',
    borderRadius: '10px',
  },
  waitText: {
    fontSize: '0.68rem',
    color: '#d97706',
    lineHeight: '1.4',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '12px',
  },
  reviewForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  starContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    margin: '4px 0',
  },
  starBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  textarea: {
    padding: '10px',
    borderRadius: '8px',
    border: '1.5px solid var(--border-color)',
    fontSize: '0.75rem',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-primary)',
    minHeight: '60px',
    resize: 'none',
  },
  successReview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
    padding: '24px 0',
  },
  reviewCompletedTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
  },
  reviewCompletedDesc: {
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  btnResetReview: {
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '6px',
  },
  scannerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  scannerOverlay: {
    width: '100%',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '20px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
  },
  scannerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '8px',
  },
  scannerTitle: {
    fontSize: '0.8rem',
    fontWeight: '800',
    fontFamily: 'var(--font-title)',
  },
  closeModalBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  cameraBox: {
    height: '200px',
    backgroundColor: '#090d16',
    borderRadius: '12px',
    border: '1px solid #1f2937',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    overflow: 'hidden',
  },
  scanTargetBorder: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    border: '3px dashed var(--c-sekolah)',
    borderRadius: '12px',
    zIndex: 10,
    animation: 'pulseBorder 2s infinite',
  },
  scanQrIcon: {
    color: '#cbd5e1',
    opacity: 0.6,
  },
  scannerHint: {
    fontSize: '0.62rem',
    color: '#64748b',
    textAlign: 'center',
    zIndex: 20,
  },
  scannerActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  btnVerifyScan: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '800',
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
};

export default SekolahView;
