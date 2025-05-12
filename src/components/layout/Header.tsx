import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        <div className="relative hidden md:block w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="hidden md:flex items-center space-x-2">
          {currentUser && (
            <>
              <span className="text-sm font-medium text-gray-700">
                {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Logout"
              >
                <LogOut size={20} className="text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;