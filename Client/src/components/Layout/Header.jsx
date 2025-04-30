import { Menu, Bell, User } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '/src/context/AuthContext.jsx'; 

import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, username }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="text-gray-300 focus:outline-none lg:hidden mr-2"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-white ml-2">NEA Server Monitor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white focus:outline-none relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="text-gray-300">{username}</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
