import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, QrCode, Search, Award, ShieldCheck, Heart, Apple, Info, Star } from 'lucide-react';

const UmumView = () => {
  const { menu, feedback, addPublicFeedback } = useContext(AppContext);
  
  // Local state
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  
  const [ratingVal, setRatingVal] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Trigger simulated scan
  const handleSimulateScan = () => {
    // Lock onto menu 1 (Nasi Kuning)
    setScannedData({
      menuName: menu[0].name,
      calorie: menu[0].calorie,
      protein: menu[0].protein,
      fat: menu[0].fat,
      carb: menu[0].carb,
      kitchenName: 'SPPG Melati Kebayoran',
      chefName: 'Koki Budi Santoso',
      cookTime: '06:15 WIB (Hari ini)',
      freshTimeLimit: '10:15 WIB (Maks. 4 jam setelah masak)',
      sourcing: [
        { ingredient: 'Beras Pandan Wangi', farm: 'Kelompok Tani Makmur (Pak Yadi)' },
        { ingredient: 'Ayam Fillet Lokal', farm: 'Peternakan Rakyat Berkah Sejahtera' },
        { ingredient: 'Sayuran Wortel/Buncis', farm: 'Koperasi UMKM Kebayoran Makmur' }
      ],
      allergens: menu[0].allergens
    });
    setShowScanner(false);
  };

  const handleSendFeedback = () => {
    if (!commentText.trim()) {
      alert('Silakan tulis ulasan atau masukan Anda terlebih dahulu.');
      return;
    }
    addPublicFeedback('SDN 01 Kebayoran Lama', ratingVal, commentText);
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setCommentText('');
    }, 3000);
  };

  return (
    <div style={styles.container}>
      {/* Public Header */}
      <div style={styles.publicHeader}>
        <div style={styles.avatar}>
          <Users size={20} style={{ color: 'white' }} />
        </div>
        <div style={styles.headerInfo}>
          <h3 style={styles.title}>Portal Transparansi MBG</h3>
          <span style={styles.subtext}>Rantai Pangan Adil & Terbuka</span>
        </div>
      </div>

      {scannedData ? (
        // SCANNED FOOD DETAILS CARD (CERTIFICATE)
        <div style={styles.scannedCard} className="animate-fade-in">
          {/* Certificate Badge */}
          <div style={styles.certBadge}>
            <Award size={18} />
            <span>Sertifikat Gizi Aman</span>
          </div>

          <h3 style={styles.menuNameTitle}>{scannedData.menuName}</h3>
          
          <div style={styles.divider} />

          {/* Cooking Details */}
          <div style={styles.detailSec}>
            <h5 style={styles.secTitle}>🍳 Dapur & QC SPPG</h5>
            <div style={styles.qcGrid}>
              <div style={styles.qcItem}>
                <span style={styles.qcLabel}>Dapur SPPG</span>
                <span style={styles.qcVal}>{scannedData.kitchenName}</span>
              </div>
              <div style={styles.qcItem}>
                <span style={styles.qcLabel}>Koki Utama</span>
                <span style={styles.qcVal}>{scannedData.chefName}</span>
              </div>
              <div style={styles.qcItem}>
                <span style={styles.qcLabel}>Waktu Masak</span>
                <span style={styles.qcVal}>{scannedData.cookTime}</span>
              </div>
              <div style={styles.qcItem}>
                <span style={styles.qcLabel}>Batas Konsumsi</span>
                <span style={{ ...styles.qcVal, color: '#dc2626', fontWeight: '800' }}>{scannedData.freshTimeLimit}</span>
              </div>
            </div>
            <div style={styles.safetyVerified}>
              <ShieldCheck size={14} /> <span>Higienitas & Sanitasi LULUS 100% (Terverifikasi Dinas)</span>
            </div>
          </div>

          {/* Sourcing details */}
          <div style={styles.detailSec}>
            <h5 style={styles.secTitle}>🚜 Ketertelusuran Bahan Baku (Sourcing)</h5>
            <div style={styles.sourcingList}>
              {scannedData.sourcing.map((src, idx) => (
                <div key={idx} style={styles.sourcingItem}>
                  <span style={styles.ingName}>{src.ingredient}</span>
                  <span style={styles.farmName}>Dipasok dari: **{src.farm}**</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition Panel */}
          <div style={styles.detailSec}>
            <h5 style={styles.secTitle}>📊 Kandungan Nutrisi Harian</h5>
            <div style={styles.nutriGrid}>
              <div style={styles.nutriItem}>
                <span style={styles.nutriVal}>{scannedData.calorie}</span>
                <span style={styles.nutriLabel}>Kalori (kkal)</span>
              </div>
              <div style={styles.nutriItem}>
                <span style={styles.nutriVal}>{scannedData.protein}g</span>
                <span style={styles.nutriLabel}>Protein (g)</span>
              </div>
              <div style={styles.nutriItem}>
                <span style={styles.nutriVal}>{scannedData.carb}g</span>
                <span style={styles.nutriLabel}>Karbohidrat</span>
              </div>
              <div style={styles.nutriItem}>
                <span style={styles.nutriVal}>{scannedData.fat}g</span>
                <span style={styles.nutriLabel}>Lemak</span>
              </div>
            </div>
            {scannedData.allergens.length > 0 && (
              <div style={styles.allergenAlert}>
                <Info size={12} /> <span>Info Alergen: mengandung **{scannedData.allergens.join(', ')}**</span>
              </div>
            )}
          </div>

          {/* Rate this specific lunch box */}
          <div style={styles.feedbackSection}>
            <h5 style={styles.secTitle}>⭐ Beri Suara Anda (Ulasan Orang Tua/Umum)</h5>
            {feedbackSent ? (
              <div style={styles.feedbackSuccess}>
                ✓ Feedback Terkirim secara Transparan!
              </div>
            ) : (
              <div style={styles.feedbackForm}>
                <div style={styles.starRow}>
                  {[1,2,3,4,5].map(st => (
                    <button key={st} onClick={() => setRatingVal(st)} style={styles.stBtn}>
                      <Star size={20} fill={st <= ratingVal ? '#f59e0b' : 'none'} color={st <= ratingVal ? '#f59e0b' : '#94a3b8'} />
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Komentar (misal: porsi kenyang, sayur dipotong rapi, anak senang)" 
                  style={styles.commentInput}
                />
                <button onClick={handleSendFeedback} style={styles.sendFeedbackBtn}>
                  Kirim Komentar
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setScannedData(null)} style={styles.scanAgainBtn}>
            Scan Box Makanan Lain
          </button>
        </div>
      ) : (
        // LANDING: TAP TO SCAN LABEL
        <div style={styles.scanLanding} className="animate-fade-in">
          <div style={styles.iconCircle}>
            <QrCode size={48} style={{ color: 'var(--c-umum)' }} />
          </div>
          
          <h4 style={styles.landingTitle}>Lacak Gizi & Keamanan Pangan</h4>
          <p style={styles.landingDesc}>
            Setiap box makanan program MBG memiliki label **QR Code khusus**. Pindai QR tersebut untuk melihat sertifikasi gizi, dapur pembuat, jam selesai memasak, hingga petani lokal yang menyuplai bahan bakunya!
          </p>

          <button onClick={() => setShowScanner(true)} style={styles.btnScannerLaunch}>
            <QrCode size={18} />
            <span>Mulai Scan Label Box</span>
          </button>

          <div style={styles.quickSearch}>
            <span style={styles.quickSearchTitle}>Atau Cari SPPG Terdekat:</span>
            <div style={styles.searchBar}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Masukkan nama Kecamatan / SPPG..." style={styles.searchInput} disabled />
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED SCANNER MODAL */}
      {showScanner && (
        <div style={styles.scannerModal}>
          <div style={styles.scannerOverlay}>
            <div style={styles.scannerHeader}>
              <span style={styles.scannerTitle}>Simulasi Scan Label Gizi</span>
              <button onClick={() => setShowScanner(false)} style={styles.closeBtn}>✖</button>
            </div>
            
            <div style={styles.cameraBox}>
              <div style={styles.scanTargetBorder} />
              <QrCode size={90} style={styles.scanQrIcon} />
              <p style={styles.scannerHint}>Arahkan kamera ke QR Code label lunchbox...</p>
            </div>

            <div style={styles.scannerActions}>
              <button 
                onClick={handleSimulateScan}
                style={styles.btnVerifyScan}
              >
                ✓ Simulasikan Scan Sukses
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
  publicHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    backgroundColor: '#0284c7', // Sky blue
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
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: 'white',
  },
  subtext: {
    fontSize: '0.65rem',
    color: '#e0f2fe',
    fontWeight: '500',
  },
  scanLanding: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    padding: '32px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '16px',
    boxShadow: 'var(--shadow-sm)',
    marginTop: '12px',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: 'rgba(14, 165, 233, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(14, 165, 233, 0.15)',
    boxShadow: '0 0 15px rgba(14, 165, 233, 0.1)',
  },
  landingTitle: {
    fontSize: '0.92rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  landingDesc: {
    fontSize: '0.72rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  btnScannerLaunch: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'var(--c-umum)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-title)',
  },
  quickSearch: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '16px',
    marginTop: '8px',
    textAlign: 'left',
  },
  quickSearchTitle: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    opacity: 0.6,
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.75rem',
    width: '100%',
    color: 'var(--text-primary)',
  },
  scannedCard: {
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: 'var(--shadow-md)',
  },
  certBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
    fontSize: '0.68rem',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: '9999px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  menuNameTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    lineHeight: '1.3',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
  },
  detailSec: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  secTitle: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  qcGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '10px',
    borderRadius: '12px',
  },
  qcItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  qcLabel: {
    fontSize: '0.58rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  qcVal: {
    fontSize: '0.72rem',
    fontWeight: '800',
  },
  safetyVerified: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.62rem',
    color: '#059669',
    fontWeight: '800',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  sourcingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sourcingItem: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '0.68rem',
    borderLeft: '3px solid var(--c-umum)',
  },
  ingName: {
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  farmName: {
    color: 'var(--text-secondary)',
    fontSize: '0.62rem',
  },
  nutriGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
  },
  nutriItem: {
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 4px',
    borderRadius: '8px',
  },
  nutriVal: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  nutriLabel: {
    fontSize: '0.52rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
    textAlign: 'center',
  },
  allergenAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.6rem',
    color: '#b45309',
    fontWeight: '700',
    backgroundColor: '#fffbeb',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid #fef3c7',
  },
  feedbackSection: {
    borderTop: '1px dashed var(--border-color)',
    paddingTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    color: '#059669',
    fontSize: '0.72rem',
    fontWeight: '800',
    padding: '8px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  feedbackForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  starRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
  },
  stBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  commentInput: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.72rem',
    backgroundColor: 'var(--bg-tertiary)',
  },
  sendFeedbackBtn: {
    padding: '8px',
    backgroundColor: 'var(--c-umum)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.72rem',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
  },
  scanAgainBtn: {
    padding: '10px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'center',
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
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  cameraBox: {
    height: '180px',
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
    width: '110px',
    height: '110px',
    border: '3px dashed var(--c-umum)',
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

export default UmumView;
