import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Current logged-in role: 'login', 'yayasan', 'dapur', 'sekolah', 'kurir', 'umum', 'supplier'
  const [currentRole, setCurrentRole] = useState('login');

  // 1.5 Multi-Tenant Yayasan Setup
  const [yayasans, setYayasans] = useState([
    { id: 'y_melati', name: 'Yayasan Gizi Melati', zone: 'Jakarta Selatan', logo: '🌸', password: 'melati123' },
    { id: 'y_harmoni', name: 'Yayasan Gizi Harmoni', zone: 'Bandung Barat', logo: '🍃', password: 'harmoni123' }
  ]);
  const [activeYayasanId, setActiveYayasanId] = useState('y_melati');

  // 2. Reactive Mock Database
  
  // Menu & Nutrition Standards
  const [menu, setMenu] = useState([
    { 
      id: 'm1', 
      name: 'Nasi Kuning Premium, Ayam Bakar Madu & Sayur Tumis Warni', 
      calorie: 480, 
      protein: 29, 
      fat: 12, 
      carb: 64,
      cost: 14500, 
      ingredients: ['Beras Cianjur', 'Ayam Fillet Lokal', 'Wortel Organik', 'Buncis Hidroponik', 'Telur Puyuh', 'Minyak Goreng Sawit', 'Bumbu Kuning Racik (Batch)', 'Garam & Penyegar Dapur'],
      recipe: [
        { name: 'Beras Cianjur', amount: 120, unit: 'g', price: 15000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Ayam Fillet Lokal', amount: 80, unit: 'g', price: 65000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Wortel Organik', amount: 30, unit: 'g', price: 20000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Buncis Hidroponik', amount: 20, unit: 'g', price: 25000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Telur Puyuh', amount: 1, unit: 'butir', price: 1500, priceUnit: 'butir', allocationType: 'portion' },
        { name: 'Minyak Goreng Sawit', amount: 8, unit: 'ml', price: 18000, priceUnit: 'L', allocationType: 'portion' },
        { name: 'Bumbu Kuning Racik (Batch)', amount: 200, unit: 'g', price: 35000, priceUnit: 'kg', allocationType: 'batch100' },
        { name: 'Garam & Penyegar Dapur', amount: 150, unit: 'g', price: 10000, priceUnit: 'kg', allocationType: 'batch100' }
      ],
      allergens: ['Kedelai'],
      yayasanId: 'y_melati'
    },
    { 
      id: 'm2', 
      name: 'Nasi Putih Organik, Rolade Daging Sapi & Sop Bening Makaroni', 
      calorie: 510, 
      protein: 32, 
      fat: 14, 
      carb: 68,
      cost: 14800, 
      ingredients: ['Beras Cianjur', 'Daging Sapi Giling', 'Brokoli', 'Macaroni', 'Kentang', 'Minyak Goreng Sawit', 'Bumbu Sop & Kaldu (Batch)'],
      recipe: [
        { name: 'Beras Cianjur', amount: 120, unit: 'g', price: 15000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Daging Sapi Giling', amount: 75, unit: 'g', price: 120000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Brokoli', amount: 40, unit: 'g', price: 22000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Macaroni', amount: 15, unit: 'g', price: 18000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Kentang', amount: 30, unit: 'g', price: 14000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Minyak Goreng Sawit', amount: 6, unit: 'ml', price: 18000, priceUnit: 'L', allocationType: 'portion' },
        { name: 'Bumbu Sop & Kaldu (Batch)', amount: 250, unit: 'g', price: 40000, priceUnit: 'kg', allocationType: 'batch100' }
      ],
      allergens: ['Gluten'],
      yayasanId: 'y_melati'
    },
    {
      id: 'm3',
      name: 'Nasi Uduk Organik, Ayam Ungkep Jahe & Sop Bening Kentang',
      calorie: 470,
      protein: 28,
      fat: 11,
      carb: 62,
      cost: 14100,
      ingredients: ['Beras Lembang', 'Ayam Kampung Lokal', 'Brokoli Organik', 'Wortel Lembang', 'Minyak Goreng Sawit', 'Bumbu Uduk & Sop (Batch)'],
      recipe: [
        { name: 'Beras Lembang', amount: 120, unit: 'g', price: 16000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Ayam Kampung Lokal', amount: 90, unit: 'g', price: 70000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Brokoli Organik', amount: 40, unit: 'g', price: 25000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Wortel Lembang', amount: 30, unit: 'g', price: 18000, priceUnit: 'kg', allocationType: 'portion' },
        { name: 'Minyak Goreng Sawit', amount: 7, unit: 'ml', price: 18000, priceUnit: 'L', allocationType: 'portion' },
        { name: 'Bumbu Uduk & Sop (Batch)', amount: 220, unit: 'g', price: 38000, priceUnit: 'kg', allocationType: 'batch100' }
      ],
      allergens: ['Kedelai'],
      yayasanId: 'y_harmoni'
    }
  ]);

  // Weekly Menu Planning per Yayasan (Multi-Tenant)
  const [weeklyMenu, setWeeklyMenu] = useState([
    { id: 'w1', day: 'Senin', menuId: 'm1', yayasanId: 'y_melati' },
    { id: 'w2', day: 'Selasa', menuId: 'm2', yayasanId: 'y_melati' },
    { id: 'w3', day: 'Rabu', menuId: 'm1', yayasanId: 'y_melati' },
    { id: 'w4', day: 'Kamis', menuId: 'm2', yayasanId: 'y_melati' },
    { id: 'w5', day: 'Jumat', menuId: 'm1', yayasanId: 'y_melati' },
    { id: 'w5_sat', day: 'Sabtu', menuId: 'm2', yayasanId: 'y_melati' },
    { id: 'w6', day: 'Senin', menuId: 'm3', yayasanId: 'y_harmoni' },
    { id: 'w7', day: 'Selasa', menuId: 'm3', yayasanId: 'y_harmoni' },
    { id: 'w8', day: 'Rabu', menuId: 'm3', yayasanId: 'y_harmoni' },
    { id: 'w9', day: 'Kamis', menuId: 'm3', yayasanId: 'y_harmoni' },
    { id: 'w10', day: 'Jumat', menuId: 'm3', yayasanId: 'y_harmoni' },
    { id: 'w10_sat', day: 'Sabtu', menuId: 'm3', yayasanId: 'y_harmoni' }
  ]);

  // Active SPPG Kitchens
  const [kitchens, setKitchens] = useState([
    { 
      id: 'k1', 
      name: 'SPPG Melati Kebayoran', 
      chef: 'Koki Budi Santoso', 
      score: '98%', 
      status: 'Aktif', 
      address: 'Jl. Melati Raya No. 12, Kebayoran Baru, Jakarta Selatan', 
      hygieneCheck: true,
      lastQC: '06:15 WIB',
      dailyPorsiGoal: 300,
      yayasanId: 'y_melati'
    },
    { 
      id: 'k2', 
      name: 'SPPG Mawar Lembang', 
      chef: 'Koki Agus Hermawan', 
      score: '95%', 
      status: 'Aktif', 
      address: 'Jl. Raya Lembang No. 45, Lembang, Bandung Barat', 
      hygieneCheck: true,
      lastQC: '06:30 WIB',
      dailyPorsiGoal: 250,
      yayasanId: 'y_harmoni'
    }
  ]);

  // School Attendance Registers (School updates this in the morning)
  const [attendance, setAttendance] = useState([
    { id: 'sch1', name: 'SDN 01 Kebayoran Lama', students: 120, originalStudents: 120, updated: '07:25 WIB', status: 'Confirmed', yayasanId: 'y_melati' },
    { id: 'sch2', name: 'SMPN 12 Jakarta Selatan', students: 180, originalStudents: 180, updated: '07:15 WIB', status: 'Confirmed', yayasanId: 'y_melati' },
    
    { id: 'sch3', name: 'SDN 02 Lembang', students: 100, originalStudents: 100, updated: '07:35 WIB', status: 'Confirmed', yayasanId: 'y_harmoni' },
    { id: 'sch4', name: 'SMPN 01 Bandung Barat', students: 150, originalStudents: 150, updated: '07:20 WIB', status: 'Confirmed', yayasanId: 'y_harmoni' }
  ]);

  // Inventory Levels at SPPG Kitchens
  const [inventory, setInventory] = useState([
    { id: 'i1', name: 'Beras Pandan Wangi', qty: 240, unit: 'kg', minQty: 50, category: 'Kering', status: 'Aman', yayasanId: 'y_melati' },
    { id: 'i2', name: 'Daging Ayam Fillet', qty: 15, unit: 'kg', minQty: 25, category: 'Basah (Segar)', status: 'Kritis', yayasanId: 'y_melati' },
    { id: 'i3', name: 'Wortel & Buncis', qty: 35, unit: 'kg', minQty: 10, category: 'Basah (Segar)', status: 'Aman', yayasanId: 'y_melati' },
    
    { id: 'i4', name: 'Beras Organik', qty: 180, unit: 'kg', minQty: 40, category: 'Kering', status: 'Aman', yayasanId: 'y_harmoni' },
    { id: 'i5', name: 'Daging Sapi Giling', qty: 30, unit: 'kg', minQty: 20, category: 'Basah (Segar)', status: 'Aman', yayasanId: 'y_harmoni' },
    { id: 'i6', name: 'Kentang & Sawi Lembang', qty: 12, unit: 'kg', minQty: 15, category: 'Basah (Segar)', status: 'Kritis', yayasanId: 'y_harmoni' }
  ]);

  // Delivery & Dispatch Tracker (Dapur releases, Kurir delivers, School receives)
  const [deliveries, setDeliveries] = useState([
    { 
      id: 'd1', 
      schoolId: 'sch1', 
      schoolName: 'SDN 01 Kebayoran Lama', 
      status: 'Dalam Perjalanan', 
      courierName: 'Joko Prabowo', 
      courierPhone: '0812-3456-7890', 
      eta: '10 menit', 
      temp: '48°C', 
      porsi: 120, 
      timeStarted: '09:20 WIB', 
      timeCompleted: '',
      photoPOD: null,
      yayasanId: 'y_melati'
    },
    { 
      id: 'd2', 
      schoolId: 'sch2', 
      schoolName: 'SMPN 12 Jakarta Selatan', 
      status: 'Menunggu Dapur', 
      courierName: 'Doni Setiawan', 
      courierPhone: '0878-9012-3456', 
      eta: '--', 
      temp: '--', 
      porsi: 180, 
      timeStarted: '', 
      timeCompleted: '',
      photoPOD: null,
      yayasanId: 'y_melati'
    },
    
    { 
      id: 'd3', 
      schoolId: 'sch3', 
      schoolName: 'SDN 02 Lembang', 
      status: 'Selesai', 
      courierName: 'Rudi Tabuti', 
      courierPhone: '0856-7890-1234', 
      eta: 'Tiba', 
      temp: '45°C', 
      porsi: 100, 
      timeStarted: '08:45 WIB', 
      timeCompleted: '09:30 WIB',
      photoPOD: 'https://images.unsplash.com/photo-1594610600063-f2ca024be53b?q=80&w=300&auto=format&fit=crop',
      yayasanId: 'y_harmoni'
    },
    { 
      id: 'd4', 
      schoolId: 'sch4', 
      schoolName: 'SMPN 01 Bandung Barat', 
      status: 'Dalam Perjalanan', 
      courierName: 'Eka Saputra', 
      courierPhone: '0899-0123-4567', 
      eta: '15 menit', 
      temp: '50°C', 
      porsi: 150, 
      timeStarted: '09:10 WIB', 
      timeCompleted: '',
      photoPOD: null,
      yayasanId: 'y_harmoni'
    }
  ]);

  // Public & School Feedback
  const [feedback, setFeedback] = useState([
    { 
      id: 'f1', 
      schoolName: 'SDN 01 Kebayoran Lama', 
      role: 'Koordinator', 
      rating: 5, 
      comments: 'Makanannya hangat, sayur masih renyah. Anak-anak sangat suka nasi kuningnya!', 
      date: 'Kemarin', 
      type: 'Positif',
      yayasanId: 'y_melati'
    },
    { 
      id: 'f2', 
      schoolName: 'SMPN 12 Jakarta Selatan', 
      role: 'Umum / Orang Tua', 
      rating: 4, 
      comments: 'Gizi seimbang sekali, ada susu UHT juga. Mantap!', 
      date: 'Kemarin', 
      type: 'Positif',
      yayasanId: 'y_melati'
    },
    { 
      id: 'f3', 
      schoolName: 'SDN 02 Lembang', 
      role: 'Koordinator', 
      rating: 5, 
      comments: 'Citarasa sop jahenya pas untuk udara dingin Lembang. Mantap gizi seimbangnya.', 
      date: 'Kemarin', 
      type: 'Positif',
      yayasanId: 'y_harmoni'
    }
  ]);

  // Supplier & PO Management
  const [suppliers, setSuppliers] = useState([
    { 
      id: 'po1', 
      supplierName: 'Kelompok Tani Makmur (Pak Yadi)', 
      itemName: 'Beras Pandan Wangi', 
      qty: '150 kg', 
      price: 2100000, 
      status: 'Selesai', 
      date: '2026-05-24',
      yayasanId: 'y_melati'
    },
    { 
      id: 'po2', 
      supplierName: 'Peternakan Berkah Sejahtera', 
      itemName: 'Daging Ayam Fillet Segar', 
      qty: '40 kg', 
      price: 1600000, 
      status: 'Menunggu Approval', 
      date: 'Hari ini',
      yayasanId: 'y_melati'
    },
    
    { 
      id: 'po3', 
      supplierName: 'Koperasi Pangan Lembang', 
      itemName: 'Beras Organik Sehat', 
      qty: '120 kg', 
      price: 1800000, 
      status: 'Selesai', 
      date: '2026-05-24',
      yayasanId: 'y_harmoni'
    }
  ]);

  // Operational Expenses Management (Kebutuhan Operasional Dapur & Logistik)
  const [operationalExpenses, setOperationalExpenses] = useState([
    { id: 'op1', title: 'Gas LPG Dapur & Air Mineral SPPG', amount: 350000, category: 'Utilitas', date: '2026-05-24', notes: 'Pembelian gas LPG 3kg 10 tabung & isi ulang galon air', yayasanId: 'y_melati' },
    { id: 'op2', title: 'Insentif Tambahan Relawan Kebersihan', amount: 500000, category: 'Relawan & SDM', date: '2026-05-23', notes: 'Insentif untuk 5 relawan lembur saat QC Audit', yayasanId: 'y_melati' },
    { id: 'op3', title: 'Pembelian Kemasan Ramah Lingkungan Lembang', amount: 750000, category: 'Logistik & Kemasan', date: '2026-05-24', notes: 'Box kemasan food-grade 500 pcs', yayasanId: 'y_harmoni' }
  ]);

  const [expenseCategories, setExpenseCategories] = useState([
    'Utilitas', 'Relawan & SDM', 'Logistik & Kemasan', 'Bahan Baku Tambahan', 'Lain-lain'
  ]);

  // Volunteer Mobilization (Relawan)
  const [volunteers, setVolunteers] = useState([
    {
      id: 'v1',
      name: 'Siti Rahma',
      zone: 'Jakarta Selatan',
      status: 'Sedang Bertugas',
      clockIn: '07:30 WIB',
      coordinates: '-6.22970, 106.79780 (SPPG Melati)',
      completedTasks: 2,
      totalTasks: 3,
      date: '2026-05-25',
      yayasanId: 'y_melati'
    },
    {
      id: 'v2',
      name: 'Ahmad Fauzan',
      zone: 'Jakarta Selatan',
      status: 'Selesai Bertugas',
      clockIn: '06:45 WIB',
      coordinates: '-6.24110, 106.80120 (SDN 01)',
      completedTasks: 4,
      totalTasks: 4,
      date: '2026-05-25',
      yayasanId: 'y_melati'
    },
    {
      id: 'v3',
      name: 'Siti Rahma',
      zone: 'Jakarta Selatan',
      status: 'Selesai Bertugas',
      clockIn: '07:15 WIB',
      coordinates: '-6.22970, 106.79780 (SPPG Melati)',
      completedTasks: 3,
      totalTasks: 3,
      date: '2026-05-24',
      yayasanId: 'y_melati'
    },
    {
      id: 'v4',
      name: 'Ahmad Fauzan',
      zone: 'Jakarta Selatan',
      status: 'Selesai Bertugas',
      clockIn: '07:00 WIB',
      coordinates: '-6.24110, 106.80120 (SDN 01)',
      completedTasks: 4,
      totalTasks: 4,
      date: '2026-05-24',
      yayasanId: 'y_melati'
    },
    {
      id: 'v5',
      name: 'Bambang Pamungkas',
      zone: 'Jakarta Selatan',
      status: 'Selesai Bertugas',
      clockIn: '08:00 WIB',
      coordinates: '-6.25010, 106.81220 (SMPN 12)',
      completedTasks: 2,
      totalTasks: 2,
      date: '2026-05-23',
      yayasanId: 'y_melati'
    },
    {
      id: 'v6',
      name: 'Siti Rahma',
      zone: 'Jakarta Selatan',
      status: 'Selesai Bertugas',
      clockIn: '07:20 WIB',
      coordinates: '-6.22970, 106.79780 (SPPG Melati)',
      completedTasks: 3,
      totalTasks: 3,
      date: '2026-05-23',
      yayasanId: 'y_melati'
    },
    
    // For Yayasan Gizi Harmoni (y_harmoni)
    {
      id: 'v7',
      name: 'Andi Wijaya',
      zone: 'Bandung Barat',
      status: 'Sedang Bertugas',
      clockIn: '07:00 WIB',
      coordinates: '-6.82410, 107.61120 (SPPG Lembang)',
      completedTasks: 1,
      totalTasks: 2,
      date: '2026-05-25',
      yayasanId: 'y_harmoni'
    },
    {
      id: 'v8',
      name: 'Dewi Lestari',
      zone: 'Bandung Barat',
      status: 'Selesai Bertugas',
      clockIn: '06:30 WIB',
      coordinates: '-6.81550, 107.62120 (SDN 02)',
      completedTasks: 3,
      totalTasks: 3,
      date: '2026-05-25',
      yayasanId: 'y_harmoni'
    },
    {
      id: 'v9',
      name: 'Andi Wijaya',
      zone: 'Bandung Barat',
      status: 'Selesai Bertugas',
      clockIn: '07:00 WIB',
      coordinates: '-6.82410, 107.61120 (SPPG Lembang)',
      completedTasks: 2,
      totalTasks: 2,
      date: '2026-05-24',
      yayasanId: 'y_harmoni'
    }
  ]);

  // UI Theme state
  const [theme, setTheme] = useState('light');

  // Trigger role styling overrides in root CSS variables
  useEffect(() => {
    const root = document.documentElement;
    let roleHsl = '243, 75%, 59%'; // yayasan Indigo
    
    switch (currentRole) {
      case 'yayasan':
        roleHsl = '243, 75%, 59%';
        break;
      case 'dapur':
        roleHsl = '142, 72%, 29%';
        break;
      case 'sekolah':
        roleHsl = '38, 92%, 50%';
        break;
      case 'kurir':
        roleHsl = '271, 91%, 65%';
        break;
      case 'umum':
        roleHsl = '199, 89%, 48%';
        break;
      case 'supplier':
        roleHsl = '340, 82%, 52%';
        break;
      default:
        roleHsl = '243, 75%, 59%';
    }
    
    root.style.setProperty('--color-role-hsl', roleHsl);
  }, [currentRole]);

  // 3. Shared Interactive Functions (Real-time Simulation Engine)
  
  // Update School Attendance (Simulates School Coordinator)
  const updateAttendance = (schoolId, newStudentsCount) => {
    // 1. Update Attendance State
    setAttendance(prev => prev.map(sch => {
      if (sch.id === schoolId) {
        return { ...sch, students: parseInt(newStudentsCount) || 0, updated: 'Hari ini (Baru)' };
      }
      return sch;
    }));

    // 2. Automatically update target cooking porsi in Dapur & Deliveries
    setDeliveries(prev => prev.map(del => {
      if (del.schoolId === schoolId) {
        return { ...del, porsi: parseInt(newStudentsCount) || 0 };
      }
      return del;
    }));

    // 3. Update SPPG target
    setKitchens(prev => prev.map(k => {
      if (k.id === 'k1') {
        const total = attendance.reduce((sum, sch) => {
          if (sch.id === schoolId) return sum + (parseInt(newStudentsCount) || 0);
          return sum + sch.students;
        }, 0);
        return { ...k, dailyPorsiGoal: total };
      }
      return k;
    }));
  };

  // Kitchen QC Checklist Submission (Simulates Dapur SPPG)
  const submitQC = () => {
    setKitchens(prev => prev.map(k => {
      if (k.id === 'k1') {
        return { ...k, hygieneCheck: true, lastQC: 'Baru saja selesai (LULUS)' };
      }
      return k;
    }));
  };

  // Dispatch meal to courier (Simulates Dapur SPPG dispatch)
  const dispatchDelivery = (deliveryId) => {
    setDeliveries(prev => prev.map(del => {
      if (del.id === deliveryId) {
        return { 
          ...del, 
          status: 'Dalam Perjalanan', 
          eta: '12 menit', 
          temp: '55°C', 
          timeStarted: 'Baru saja berangkat' 
        };
      }
      return del;
    }));
  };

  // Confirm delivery receipt (Simulates School Coordinator scanning courier's QR)
  const completeDelivery = (deliveryId, ratingScore, commentText) => {
    let targetDelivery = null;

    setDeliveries(prev => prev.map(del => {
      if (del.id === deliveryId) {
        targetDelivery = del;
        return { 
          ...del, 
          status: 'Selesai', 
          eta: 'Tiba', 
          temp: '44°C', 
          timeCompleted: 'Baru saja diterima',
          photoPOD: 'https://images.unsplash.com/photo-1594610600063-f2ca024be53b?q=80&w=300&auto=format&fit=crop'
        };
      }
      return del;
    }));

    // Generate automatic feedback
    if (ratingScore && targetDelivery) {
      setFeedback(prev => [
        {
          id: `f_${Date.now()}`,
          schoolName: targetDelivery.schoolName,
          role: 'Koordinator',
          rating: ratingScore,
          comments: commentText || 'Serah terima terverifikasi secara digital. Porsi lengkap.',
          date: 'Hari ini',
          type: ratingScore >= 4 ? 'Positif' : 'Aduan'
        },
        ...prev
      ]);
    }
  };

  // Submit public/parent feedback (Simulates Public Portal)
  const addPublicFeedback = (schoolName, ratingScore, commentText) => {
    setFeedback(prev => [
      {
        id: `f_${Date.now()}`,
        schoolName: schoolName,
        role: 'Umum / Orang Tua',
        rating: parseInt(ratingScore),
        comments: commentText,
        date: 'Hari ini',
        type: ratingScore >= 4 ? 'Positif' : 'Aduan'
      },
      ...prev
    ]);
  };

  // Approve Supplier PO Invoice (Simulates Yayasan / Pusat)
  const approvePO = (poId) => {
    setSuppliers(prev => prev.map(po => {
      if (po.id === poId) {
        return { ...po, status: 'Diproses' };
      }
      return po;
    }));

    // Instantly increase stock in Dapur's inventory!
    const targetPo = suppliers.find(po => po.id === poId);
    if (targetPo) {
      setInventory(prev => prev.map(item => {
        if (targetPo.itemName.includes(item.name) || item.name.includes('Ayam') && targetPo.itemName.includes('Ayam')) {
          const addedVal = parseInt(targetPo.qty) || 40;
          return { 
            ...item, 
            qty: item.qty + addedVal, 
            status: item.qty + addedVal >= item.minQty ? 'Aman' : 'Kritis' 
          };
        }
        return item;
      }));
    }
  };

  // Supplier fulfills raw ingredients shipment (Simulates Supplier portal)
  const deliverIngredients = (poId) => {
    setSuppliers(prev => prev.map(po => {
      if (po.id === poId) {
        return { ...po, status: 'Selesai' };
      }
      return po;
    }));

    // Update inventory to safe
    const targetPo = suppliers.find(po => po.id === poId);
    if (targetPo) {
      setInventory(prev => prev.map(item => {
        if (targetPo.itemName.includes(item.name) || item.name.includes('Ayam') && targetPo.itemName.includes('Ayam')) {
          const addedVal = parseInt(targetPo.qty) || 40;
          return { 
            ...item, 
            qty: item.qty + addedVal, 
            status: 'Aman' 
          };
        }
        return item;
      }));
    }
  };

  // Trigger inventory restock directly
  const triggerRestock = (itemId, addedQty) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = item.qty + addedQty;
        return { ...item, qty: newQty, status: newQty >= item.minQty ? 'Aman' : 'Kritis' };
      }
      return item;
    }));
  };

  // SaaS Tenant Registration (Simulates registering a new Yayasan client)
  const registerYayasan = (name, zone, logo, password) => {
    const newId = `y_${Date.now()}`;
    const newYayasan = { id: newId, name, zone, logo: logo || '⭐️', password: password || '123456' };
    
    // 1. Add to yayasans list
    setYayasans(prev => [...prev, newYayasan]);
    
    // 2. Seed default/starter mock data so the new tenant isn't blank
    const startSchoolId = `sch_${Date.now()}`;
    
    // 2a. Starter Menu
    const starterMenuId = `m_${Date.now()}`;
    setMenu(prev => [
      ...prev,
      {
        id: starterMenuId,
        name: 'Menu Perdana: Nasi Uduk Ayam Bakar & Tumis Buncis Organik',
        calorie: 460,
        protein: 26,
        fat: 10,
        carb: 60,
        cost: 13800,
        ingredients: ['Beras Lokal', 'Daging Ayam', 'Buncis Lembang', 'Telur Puyuh'],
        recipe: [
          { name: 'Beras Lokal', amount: 120, unit: 'g' },
          { name: 'Daging Ayam', amount: 80, unit: 'g' },
          { name: 'Buncis Lembang', amount: 30, unit: 'g' },
          { name: 'Telur Puyuh', amount: 1, unit: 'butir' }
        ],
        allergens: ['Kedelai'],
        yayasanId: newId
      }
    ]);
    
    // 2b. Starter Kitchen
    setKitchens(prev => [
      ...prev,
      {
        id: `k_${Date.now()}`,
        name: `SPPG ${name}`,
        chef: 'Koki Rekanan Lokal',
        score: '100%',
        status: 'Aktif',
        address: `Jl. Raya Utama Sentra Gizi, Kec. ${zone}`,
        hygieneCheck: true,
        lastQC: '07:00 WIB',
        dailyPorsiGoal: 100,
        yayasanId: newId
      }
    ]);
    
    // 2c. Starter School Attendance
    setAttendance(prev => [
      ...prev,
      { id: startSchoolId, name: `SDN 01 ${zone}`, students: 100, originalStudents: 100, updated: 'Baru Terdaftar', status: 'Confirmed', yayasanId: newId }
    ]);
    
    // 2d. Starter Inventory
    setInventory(prev => [
      ...prev,
      { id: `i_${Date.now()}_1`, name: 'Beras Premium', qty: 150, unit: 'kg', minQty: 40, category: 'Kering', status: 'Aman', yayasanId: newId },
      { id: `i_${Date.now()}_2`, name: 'Daging Ayam Segar', qty: 25, unit: 'kg', minQty: 10, category: 'Basah (Segar)', status: 'Aman', yayasanId: newId }
    ]);
    
    // 2e. Starter Delivery Order
    setDeliveries(prev => [
      ...prev,
      {
        id: `d_${Date.now()}`,
        schoolId: startSchoolId,
        schoolName: `SDN 01 ${zone}`,
        status: 'Menunggu Dapur',
        courierName: 'Kemitraan Kurir Daerah',
        courierPhone: '0812-XXXX-XXXX',
        eta: '--',
        temp: '--',
        porsi: 100,
        timeStarted: '',
        timeCompleted: '',
        photoPOD: null,
        yayasanId: newId
      }
    ]);

    // 2f. Starter Operational Expense
    setOperationalExpenses(prev => [
      ...prev,
      {
        id: `op_${Date.now()}`,
        title: 'Pembelian LPG & Galon Higienis SPPG',
        amount: 250000,
        category: 'Utilitas',
        date: 'Hari ini',
        notes: 'Alokasi kebutuhan operasional dapur perdana',
        yayasanId: newId
      }
    ]);

    // 2g. Starter Weekly Menu Items
    setWeeklyMenu(prev => [
      ...prev,
      { id: `w_${Date.now()}_1`, day: 'Senin', menuId: starterMenuId, yayasanId: newId },
      { id: `w_${Date.now()}_2`, day: 'Selasa', menuId: starterMenuId, yayasanId: newId },
      { id: `w_${Date.now()}_3`, day: 'Rabu', menuId: starterMenuId, yayasanId: newId },
      { id: `w_${Date.now()}_4`, day: 'Kamis', menuId: starterMenuId, yayasanId: newId },
      { id: `w_${Date.now()}_5`, day: 'Jumat', menuId: starterMenuId, yayasanId: newId },
      { id: `w_${Date.now()}_6`, day: 'Sabtu', menuId: starterMenuId, yayasanId: newId },
    ]);
    
    return newId;
  };

  // Add new operational expense
  const addOperationalExpense = (title, amount, category, notes, yayasanId) => {
    const newExpense = {
      id: `op_${Date.now()}`,
      title,
      amount: parseFloat(amount) || 0,
      category,
      date: 'Hari ini',
      notes,
      yayasanId
    };
    setOperationalExpenses(prev => [newExpense, ...prev]);
  };

  // Add custom category to categories list
  const addExpenseCategory = (newCategory) => {
    if (!newCategory) return;
    setExpenseCategories(prev => {
      if (prev.includes(newCategory)) return prev;
      return [...prev, newCategory];
    });
  };

  // Update weekly menu assignment
  const updateWeeklyMenu = (day, menuId, yayasanId) => {
    setWeeklyMenu(prev => prev.map(item => {
      if (item.day === day && item.yayasanId === yayasanId) {
        return { ...item, menuId };
      }
      return item;
    }));
  };

  // Add new custom menu with recipe/SOP
  const addNewMenu = (name, calorie, protein, fat, carb, cost, ingredients, recipe, allergens, yayasanId) => {
    const newMenuObj = {
      id: `m_${Date.now()}`,
      name,
      calorie: parseInt(calorie) || 0,
      protein: parseInt(protein) || 0,
      fat: parseInt(fat) || 0,
      carb: parseInt(carb) || 0,
      cost: parseFloat(cost) || 0,
      ingredients: ingredients || [],
      recipe: recipe || [],
      allergens: allergens || [],
      yayasanId
    };
    setMenu(prev => [...prev, newMenuObj]);
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      yayasans,
      activeYayasanId,
      setActiveYayasanId,
      menu,
      setMenu,
      kitchens,
      attendance,
      inventory,
      deliveries,
      feedback,
      suppliers,
      volunteers,
      operationalExpenses,
      expenseCategories,
      weeklyMenu,
      theme,
      setTheme,
      
      // Reactive Actions
      updateAttendance,
      submitQC,
      dispatchDelivery,
      completeDelivery,
      addPublicFeedback,
      approvePO,
      deliverIngredients,
      triggerRestock,
      registerYayasan,
      addOperationalExpense,
      addExpenseCategory,
      updateWeeklyMenu,
      addNewMenu
    }}>
      {children}
    </AppContext.Provider>
  );
};
