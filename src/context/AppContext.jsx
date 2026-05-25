import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Current logged-in role: 'login', 'yayasan', 'dapur', 'sekolah', 'kurir', 'umum', 'supplier'
  const [currentRole, setCurrentRole] = useState('login');

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
      ingredients: ['Beras Cianjur', 'Ayam Fillet Lokal', 'Wortel Organik', 'Buncis Hidroponik', 'Telur Puyuh'],
      allergens: ['Kedelai']
    },
    { 
      id: 'm2', 
      name: 'Nasi Putih Organik, Rolade Daging Sapi & Sop Bening Makaroni', 
      calorie: 510, 
      protein: 32, 
      fat: 14, 
      carb: 68,
      cost: 14800, 
      ingredients: ['Beras Cianjur', 'Daging Sapi Giling', 'Brokoli', 'Macaroni', 'Kentang'],
      allergens: ['Gluten']
    }
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
      dailyPorsiGoal: 300
    }
  ]);

  // School Attendance Registers (School updates this in the morning)
  const [attendance, setAttendance] = useState([
    { id: 'sch1', name: 'SDN 01 Kebayoran Lama', students: 120, originalStudents: 120, updated: '07:25 WIB', status: 'Confirmed' },
    { id: 'sch2', name: 'SMPN 12 Jakarta Selatan', students: 180, originalStudents: 180, updated: '07:15 WIB', status: 'Confirmed' }
  ]);

  // Inventory Levels at SPPG Melati Kebayoran
  const [inventory, setInventory] = useState([
    { id: 'i1', name: 'Beras Pandan Wangi', qty: 240, unit: 'kg', minQty: 50, category: 'Kering', status: 'Aman' },
    { id: 'i2', name: 'Daging Ayam Fillet', qty: 15, unit: 'kg', minQty: 25, category: 'Basah (Segar)', status: 'Kritis' },
    { id: 'i3', name: 'Wortel & Buncis', qty: 35, unit: 'kg', minQty: 10, category: 'Basah (Segar)', status: 'Aman' },
    { id: 'i4', name: 'Minyak Goreng Sawit', qty: 45, unit: 'Liter', minQty: 15, category: 'Kering', status: 'Aman' },
    { id: 'i5', name: 'Susu UHT 200ml', qty: 48, unit: 'Pcs', minQty: 100, category: 'Minuman', status: 'Kritis' }
  ]);

  // Delivery & Dispatch Tracker (Dapur releases, Kurir delivers, School receives)
  const [deliveries, setDeliveries] = useState([
    { 
      id: 'd1', 
      schoolId: 'sch1', 
      schoolName: 'SDN 01 Kebayoran Lama', 
      status: 'Dalam Perjalanan', // 'Menunggu Dapur', 'Dalam Perjalanan', 'Selesai'
      courierName: 'Joko Prabowo', 
      courierPhone: '0812-3456-7890', 
      eta: '10 menit', 
      temp: '48°C', 
      porsi: 120, 
      timeStarted: '09:20 WIB', 
      timeCompleted: '',
      photoPOD: null
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
      photoPOD: null
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
      type: 'Positif' 
    },
    { 
      id: 'f2', 
      schoolName: 'SMPN 12 Jakarta Selatan', 
      role: 'Umum / Orang Tua', 
      rating: 4, 
      comments: 'Gizi seimbang sekali, ada susu UHT juga. Mantap!', 
      date: 'Kemarin', 
      type: 'Positif' 
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
      status: 'Selesai', // 'Menunggu Approval', 'Diproses', 'Selesai'
      date: '2026-05-24' 
    },
    { 
      id: 'po2', 
      supplierName: 'Peternakan Berkah Sejahtera', 
      itemName: 'Daging Ayam Fillet Segar', 
      qty: '40 kg', 
      price: 1600000, 
      status: 'Menunggu Approval', 
      date: 'Hari ini' 
    }
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
      totalTasks: 3
    },
    {
      id: 'v2',
      name: 'Ahmad Fauzan',
      zone: 'Jakarta Selatan',
      status: 'Selesai Bertugas',
      clockIn: '06:45 WIB',
      coordinates: '-6.24110, 106.80120 (SDN 01)',
      completedTasks: 4,
      totalTasks: 4
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

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      menu,
      setMenu,
      kitchens,
      attendance,
      inventory,
      deliveries,
      feedback,
      suppliers,
      volunteers,
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
      triggerRestock
    }}>
      {children}
    </AppContext.Provider>
  );
};
