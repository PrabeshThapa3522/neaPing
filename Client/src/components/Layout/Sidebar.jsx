import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Map,
  Server,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  BarChart
} from 'lucide-react';
import { AuthContext } from '/src/context/AuthContext.jsx';




const provinces = [
  { id: 1, name: 'Koshi Province' },
  { id: 2, name: 'Madhesh Province' },
  { id: 3, name: 'Bagmati Province' },
  { id: 4, name: 'Gandaki Province' },
  { id: 5, name: 'Lumbini Province' },
  { id: 6, name: 'Karnali Province' },
  { id: 7, name: 'Sudurpashchim Province' }
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [showProvinces, setShowProvinces] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeClass = "bg-blue-700 text-white";
  const inactiveClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <div
      className={`bg-gray-800 fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
        <div className="flex items-center">
          <Server className="h-8 w-8 text-blue-500" />
          <span className="ml-2 text-xl font-semibold text-white">NEA Monitor</span>
        </div>
        <button
          className="lg:hidden text-gray-300 hover:text-white"
          onClick={toggleSidebar}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav className="h-full overflow-y-auto">
        <div className="px-2 py-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive ? activeClass : inactiveClass
              }`
            }
            onClick={() => {
              if (isOpen) toggleSidebar();
            }}
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>

          <div className="mt-2">
            <button
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => setShowProvinces(!showProvinces)}
            >
              <div className="flex items-center">
                <Map className="h-5 w-5 mr-3" />
                <span>Province</span>
              </div>
              {showProvinces ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showProvinces && (
              <div className="ml-4 mt-1 space-y-1">
                {provinces.map((province) => (
                  <NavLink
                    key={province.id}
                    to={`/province/${province.id}`}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive ? activeClass : inactiveClass
                      }`
                    }
                    onClick={() => {
                      if (isOpen) toggleSidebar();
                    }}
                  >
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 mr-2">
                      {province.id}
                    </span>
                    {province.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2">
            <NavLink
              to="/manage-ip"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive ? activeClass : inactiveClass
                }`
              }
              onClick={() => {
                if (isOpen) toggleSidebar();
              }}
            >
              <BarChart className="h-5 w-5 mr-3" />
              Manage IP
            </NavLink>
          </div>

          <div className="mt-2">
            <NavLink
              to="/manage-user"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive ? activeClass : inactiveClass
                }`
              }
              onClick={() => {
                if (isOpen) toggleSidebar();
              }}
            >
              <User className="h-5 w-5 mr-3" />
              Manage User
            </NavLink>
          </div>
        </div>

        <div className="border-t border-gray-700 px-2 py-4">
          <button
            className="flex w-full items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
