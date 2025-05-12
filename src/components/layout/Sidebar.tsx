import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Users, 
  Store, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { currentUser, hasPermission } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      requiredRole: 'employee'
    },
    {
      name: 'Indents',
      path: '/indents',
      icon: <FileText size={20} />,
      requiredRole: 'employee'
    },
    {
      name: 'Approvals',
      path: '/approvals',
      icon: <CheckSquare size={20} />,
      requiredRole: 'manager'
    },
    {
      name: 'Vendors',
      path: '/vendors',
      icon: <Store size={20} />,
      requiredRole: 'procurement_officer'
    },
    {
      name: 'Users',
      path: '/users',
      icon: <Users size={20} />,
      requiredRole: 'admin'
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BarChart3 size={20} />,
      requiredRole: 'manager'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings size={20} />,
      requiredRole: 'employee'
    }
  ];

  // Filter nav items based on user permissions
  const filteredNavItems = navItems.filter(item => 
    hasPermission(item.requiredRole as any)
  );

  return (
    <>
      {/* Mobile menu toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 bg-white rounded-full p-2 shadow-md"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar background overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-20 flex flex-col w-64 h-screen bg-gradient-to-b from-indigo-950 to-indigo-900 text-white transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex items-center justify-center h-16 border-b border-indigo-800">
          <span className="text-xl font-semibold">Intendor</span>
        </div>

        {currentUser && (
          <div className="flex items-center p-4 border-b border-indigo-800">
            <img 
              src={currentUser.avatar || 'https://via.placeholder.com/40'} 
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <div className="font-medium">{currentUser.name}</div>
              <div className="text-xs opacity-70">{currentUser.role.replace('_', ' ')}</div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <p className="text-xs text-center text-indigo-300">
            &copy; 2025 Intendor v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;