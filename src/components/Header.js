import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import UserProfile from './UserProfile';

const Header = ({ isDarkMode, toggleDarkMode, user, setUser }) => {
  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          MovieFinder
        </Link>
      </div>
      <div className="flex-none">
        <button onClick={toggleDarkMode} className="btn btn-ghost">
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        {user ? (
          <UserProfile user={user} setUser={setUser} />
        ) : (
          <div className="flex-none">
            <Link to="/login" className="btn btn-ghost btn-sm mr-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
