import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Menu, X, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  transparent?: boolean;
  currency: string;
  setCurrency: (currency: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const Navbar = ({ 
  transparent = false,
  currency,
  setCurrency,
  language,
  setLanguage
}: NavbarProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };
  
  // Navigate to appropriate dashboard based on user role
  const goToDashboard = () => {
    if (!user) return;
    
    setIsUserMenuOpen(false);
    navigate(`/dashboard/${user.role}`);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      transparent ? "bg-transparent" : "bg-white shadow-sm"
    )}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Home className={cn(
              "h-8 w-8 mr-2", 
              transparent ? "text-white" : "text-primary-600"
            )} />
            <span className={cn(
              "font-bold text-xl", 
              transparent ? "text-white" : "text-gray-900"
            )}>
              PropertyConnect
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => cn(
                transparent ? "text-white/90 hover:text-white" : "nav-link",
                isActive && (transparent ? "text-white font-semibold" : "nav-link-active")
              )}
            >
              Home
            </NavLink>
            <NavLink 
              to="/search" 
              className={({ isActive }) => cn(
                transparent ? "text-white/90 hover:text-white" : "nav-link",
                isActive && (transparent ? "text-white font-semibold" : "nav-link-active")
              )}
            >
              Properties
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({ isActive }) => cn(
                transparent ? "text-white/90 hover:text-white" : "nav-link",
                isActive && (transparent ? "text-white font-semibold" : "nav-link-active")
              )}
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => cn(
                transparent ? "text-white/90 hover:text-white" : "nav-link",
                isActive && (transparent ? "text-white font-semibold" : "nav-link-active")
              )}
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => cn(
                transparent ? "text-white/90 hover:text-white" : "nav-link",
                isActive && (transparent ? "text-white font-semibold" : "nav-link-active")
              )}
            >
              Contact
            </NavLink>
          </nav>

          {/* Currency and Language selector (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={cn(
                "text-sm font-medium bg-transparent border-none focus:ring-0",
                transparent ? "text-white" : "text-gray-700"
              )}
            >
              <option value="UGX">UGX</option>
              <option value="KES">KES</option>
              <option value="TZS">TZS</option>
              <option value="RWF">RWF</option>
              <option value="USD">USD</option>
            </select>

            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={cn(
                "text-sm font-medium bg-transparent border-none focus:ring-0",
                transparent ? "text-white" : "text-gray-700"
              )}
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
              <option value="lg">Luganda</option>
              <option value="rw">Kinyarwanda</option>
            </select>

            {/* Authentication buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-white" 
                    />
                  ) : (
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      transparent ? "bg-white text-primary-600" : "bg-primary-100 text-primary-700"
                    )}>
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className={cn(
                    "ml-2 font-medium",
                    transparent ? "text-white" : "text-gray-700"
                  )}>
                    {user?.name.split(' ')[0]}
                  </span>
                </button>

                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={goToDashboard}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={cn(
                    "font-medium",
                    transparent ? "text-white hover:text-white/90" : "text-primary-600 hover:text-primary-700"
                  )}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={cn(
                    transparent ? 
                      "bg-white text-primary-700 hover:bg-gray-100" : 
                      "bg-primary-600 text-white hover:bg-primary-700",
                    "px-3 py-1.5 rounded-md text-sm font-medium"
                  )}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu}
            className={cn(
              "md:hidden p-2 rounded-md",
              transparent ? "text-white" : "text-gray-600"
            )}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/search" 
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>

          {/* Currency and Language selector (mobile) */}
          <div className="px-5 py-3 border-t border-gray-200 flex justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Currency:</span>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-sm font-medium bg-transparent border-none"
              >
                <option value="UGX">UGX</option>
                <option value="KES">KES</option>
                <option value="TZS">TZS</option>
                <option value="RWF">RWF</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Language:</span>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm font-medium bg-transparent border-none"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
                <option value="lg">Luganda</option>
                <option value="rw">Kinyarwanda</option>
              </select>
            </div>
          </div>

          {/* Mobile auth section */}
          <div className="px-5 py-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full mr-2" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 mr-2">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="font-medium text-gray-700">{user?.name}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={goToDashboard}
                    className="text-primary-600 font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 font-medium flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between">
                <Link 
                  to="/login" 
                  className="text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 py-1 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;