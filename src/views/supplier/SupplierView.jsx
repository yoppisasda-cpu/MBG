import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Tractor, FileText, ShoppingCart, CheckCircle, Clock, Truck, PlusCircle, AlertTriangle } from 'lucide-react';

const SupplierView = ({ activeTab = 'overview' }) => {
  const { suppliers, deliverIngredients } = useContext(AppContext);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {activeTab === 'overview' ? (
        // TAB 1: PURCHASE ORDERS RECEIVED
        <>
          <div style={styles.titleBanner}>
            <div>
              <h2 style={styles.tabHeading}>🚜 Portal UMKM & Supplier Pangan Lokal</h2>
              <p style={styles.tabSubheading}>Daftar pesanan bahan baku segar dari dapur SPPG Mitra untuk dipasok hari ini.</p>
            </div>
            <span className="badge badge-danger">Koperasi Tani Mitra</span>
          </div>

          <div style={styles.poContainer}>
            <h3 style={styles.secTitle}>📦 Pesanan Bahan Baku Diterima:</h3>
            <div style={styles.poList}>
              {suppliers.map((po) => (
                <div key={po.id} style={styles.poCard}>
                  <div style={styles.poLeft}>
                    <div style={styles.poIconBg}>
                      <Tractor size={20} />
                    </div>
                    <div>
                      <h4 style={styles.poItemName}>{po.itemName} <span style={styles.poQty}>({po.qty})</span></h4>
                      <span style={styles.poKitchen}>Tujuan: **Dapur SPPG Melati Kebayoran**</span>
                      <span style={styles.poDate}>Pesanan Masuk: {po.date}</span>
                    </div>
                  </div>

                  <div style={styles.poRight}>
                    <div style={styles.poPriceSec}>
                      <span style={styles.poPriceLabel}>Nilai PO:</span>
                      <span style={styles.poPriceVal}>Rp {po.price.toLocaleString('id-ID')}</span>
                    </div>

                    {po.status === 'Menunggu Approval' ? (
                      <div style={styles.waitingBadge}>
                        <Clock size={14} />
                        <span>Menunggu Kucuran Dana Yayasan</span>
                      </div>
                    ) : po.status === 'Diproses' ? (
                      <button 
                        onClick={() => {
                          deliverIngredients(po.id);
                          alert(`Bahan baku segar ${po.itemName} seberat ${po.qty} telah dikirim ke Dapur SPPG Melati! Stok dapur otomatis bertambah.`);
                        }} 
                        style={styles.btnDeliver}
                      >
                        <Truck size={14} />
                        <span>Kirim Bahan Baku Harian</span>
                      </button>
                    ) : (
                      <div style={styles.doneBadge}>
                        <CheckCircle size={14} />
                        <span>Telah Dikirim & Diterima SPPG</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // TAB 2: BILLING & E-INVOICE
        <>
          <div style={styles.titleBanner}>
            <div>
              <h2 style={styles.tabHeading}>📑 Billing & Pencairan Invoice Digital</h2>
              <p style={styles.tabSubheading}>Pantau riwayat pembayaran invoice gizi dari Yayasan pusat untuk menjaga likuiditas kelompok tani.</p>
            </div>
          </div>

          <div className="glass-card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <h3 style={styles.secTitle}>Histori E-Invoicing:</h3>
            <div style={styles.invoiceTable}>
              <div style={styles.tableRowHeader}>
                <span>Nomor PO</span>
                <span>Barang</span>
                <span style={{ textAlign: 'center' }}>Status Transfer</span>
                <span style={{ textAlign: 'right' }}>Total Cair</span>
              </div>

              {suppliers.map(po => (
                <div key={po.id} style={styles.tableRow}>
                  <span style={{ fontWeight: '800' }}>#{po.id.toUpperCase()}</span>
                  <span>{po.itemName} ({po.qty})</span>
                  <span style={{ textAlign: 'center' }}>
                    <span className={`badge ${po.status === 'Selesai' ? 'badge-success' : 'badge-warning'}`}>
                      {po.status === 'Selesai' ? 'LUNAS (Transfer Sukses)' : 'PENDING APPROVAL'}
                    </span>
                  </span>
                  <span style={{ textAlign: 'right', fontWeight: '800' }}>Rp {po.price.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>
        </>
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
  poContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  secTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    marginBottom: '4px',
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
    boxShadow: 'var(--shadow-sm)',
  },
  poLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  poIconBg: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
    color: 'var(--c-supplier)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poItemName: {
    fontSize: '0.9rem',
    fontWeight: '800',
  },
  poQty: {
    color: 'var(--c-supplier)',
  },
  poKitchen: {
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
  poPriceSec: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  poPriceLabel: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
  poPriceVal: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
  },
  waitingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    color: '#d97706',
    border: '1px solid rgba(245, 158, 11, 0.15)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '0.72rem',
    fontWeight: '800',
    width: '180px',
    justifyContent: 'center',
  },
  btnDeliver: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    backgroundColor: 'var(--c-supplier)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '800',
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-title)',
    width: '180px',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all var(--transition-fast)',
  },
  doneBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    color: '#059669',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '0.72rem',
    fontWeight: '800',
    width: '180px',
    justifyContent: 'center',
  },
  invoiceTable: {
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    overflow: 'hidden',
    marginTop: '16px',
  },
  tableRowHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 2fr 1fr',
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
    gridTemplateColumns: '1fr 2fr 2fr 1fr',
    padding: '14px 20px',
    fontSize: '0.85rem',
    borderBottom: '1px solid var(--border-color)',
    alignItems: 'center',
  },
};

export default SupplierView;
