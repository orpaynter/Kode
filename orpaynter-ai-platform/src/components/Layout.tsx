import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NavItem } from '../types';

type UserRole = 'homeowner' | 'contractor' | 'insurance' | 'supplier';
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  CreditCardIcon, 
  UserCircleIcon, 
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'HomeIcon',
      roles: ['homeowner', 'contractor', 'insurance', 'supplier']
    },
    {
      label: 'Projects',
      href: '/projects',
      icon: 'ClipboardDocumentListIcon',
      roles: ['homeowner', 'contractor', 'insurance']
    },
    {
      label: 'Subscription',
      href: '/subscription',
      icon: 'CreditCardIcon',
      roles: ['homeowner', 'contractor', 'insurance', 'supplier']
    },
    {
      label: 'Support',
      href: '/support',
      icon: 'QuestionMarkCircleIcon',
      roles: ['homeowner', 'contractor', 'insurance', 'supplier']
    }
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      HomeIcon,
      ClipboardDocumentListIcon,
      CreditCardIcon,
      UserCircleIcon,
      QuestionMarkCircleIcon
    };
    
    const IconComponent = iconMap[iconName] || HomeIcon;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-secondary transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OP</span>
            </div>
            <span className="text-white font-bold text-lg">OrPaynter</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors
                  ${isActive 
                    ? 'bg-accent-blue text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon && getIconComponent(item.icon)}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="bg-dark-secondary border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-400 hover:text-white relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-secondary rounded-lg shadow-lg border border-gray-700 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/subscription"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Subscription
                      </Link>
                      <hr className="my-1 border-gray-700" />
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}