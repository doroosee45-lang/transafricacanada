import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="easy-internal" style={{ display:'flex', flexDirection:'row', height:'100vh', overflow:'hidden', background:'#f4f6fb' }}>
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden' }}>
        
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="easy-app-content" style={{ flex:1 }}>
          <Outlet context={{ setSidebarOpen }} />
        </main>

      </div>
    </div>
  );
};

export default Layout;