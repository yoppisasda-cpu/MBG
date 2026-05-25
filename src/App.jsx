import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Views
import LoginView from './views/login/LoginView';
import YayasanDashboard from './views/yayasan/YayasanDashboard';
import DapurDashboard from './views/dapur/DapurDashboard';
import SupplierView from './views/supplier/SupplierView';

function App() {
  const { currentRole } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');

  // Reset active tab when role changes
  useEffect(() => {
    setActiveTab('overview');
  }, [currentRole]);

  // Main views routing
  const renderRoleView = () => {
    switch (currentRole) {
      case 'login':
        return <LoginView />;
      case 'yayasan':
        return <YayasanDashboard activeTab={activeTab} />;
      case 'dapur':
        return <DapurDashboard activeTab={activeTab} />;
      case 'supplier':
        return <SupplierView activeTab={activeTab} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {currentRole === 'login' ? (
        <div style={{ flex: 1 }}>
          <LoginView />
        </div>
      ) : (
        // WEB LAYOUT: Sidebar + Dashboard Content
        <div className="dashboard-layout">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="dashboard-content">
            {renderRoleView()}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
