import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './ui/Navbar';

const Layout: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 w-full overflow-hidden" style={{ marginTop: '3rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;