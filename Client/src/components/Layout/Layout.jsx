import { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { AuthContext } from '/src/context/AuthContext.jsx'; 


const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} username={user?.name || 'User'} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
