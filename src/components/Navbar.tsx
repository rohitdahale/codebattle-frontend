import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Code,
  LogOut,
  User,
  Trophy,
  Star,
  BookOpen,
  LucideIcon
} from 'lucide-react';

// Define types for better type safety
interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface User {
  id: string;
  username: string;
  email: string;
  xp?: number;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
}

const Navbar: React.FC = (): JSX.Element | null => {
  const { user, logout, isAuthenticated }: AuthContextType = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isAuthenticated) return null;

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: User },
    { path: '/practice', label: 'Practice', icon: BookOpen },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  const getAvatarUrl = (username: string): string => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
  };

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CodeBattle
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex space-x-6">
              {navItems.map(({ path, label, icon: Icon }: NavItem) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4 relative">

              {/* Avatar + Dropdown */}
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <img
                    src={user?.avatar || getAvatarUrl(user?.username || 'user')}
                    alt={user?.username || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-cyan-400"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getAvatarUrl(user?.username || 'user');
                    }}
                  />
                  <span className="hidden sm:block text-sm font-medium text-white">
                    {user?.username}
                  </span>
                </div>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl z-50">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-3 transition-all duration-200 rounded-t-lg"
                    >
                      <User className="w-4 h-4" /> 
                      <span className="font-medium">Profile</span>
                    </button>
                    <div className="border-t border-slate-700/50"></div>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowConfirm(true);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-3 transition-all duration-200 rounded-b-lg"
                    >
                      <LogOut className="w-4 h-4" /> 
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Logout Confirmation Modal */}
              {showConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-2xl space-y-4 w-[90%] max-w-sm">
                    <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
                    <p className="text-sm text-slate-300">Are you sure you want to log out? You'll need to sign in again to access your account.</p>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-600/50 transition-all duration-200 border border-slate-600/50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;