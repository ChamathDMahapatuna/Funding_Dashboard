// src/components/Header.jsx
import { useContext } from 'react';
import { 
  BellIcon, 
  QuestionMarkCircleIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex-1"></div> {/* Empty div to maintain layout */}
        
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