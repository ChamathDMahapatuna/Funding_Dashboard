// src/components/Header.jsx
import { useState, useContext } from 'react';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  QuestionMarkCircleIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for companies, investors, or deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </div>
          
          <QuestionMarkCircleIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          
          <div className="flex items-center cursor-pointer">
            <UserCircleIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-2 hidden md:block">
              {user ? (
                <>
                  <div className="text-sm font-medium text-gray-700">
                    {user.email ? (user.email.includes('@') ? user.email.split('@')[0] : user.email) : "User"}
                  </div>
                  <div className="text-xs text-gray-500">{user.role || "Guest"}</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-gray-700">Guest</div>
                  <div className="text-xs text-gray-500">Not logged in</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
    
    </header>
  );
}

export default Header;