import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  CurrencyDollarIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

function Sidebar({ currentPage, setCurrentPage }) {
  const [expanded, setExpanded] = useState(true);

  const navigationItems = [
    { id: 'dashboard', path: '/', icon: <HomeIcon className="h-6 w-6" />, label: 'Dashboard' },
    { id: 'advancedSearch', path: '/advanced-search', icon: <MagnifyingGlassIcon className="h-6 w-6" />, label: 'Advanced Search' },
    { id: 'fundingDetails', path: '/funding-details', icon: <CurrencyDollarIcon className="h-6 w-6" />, label: 'Funding Details' },
    { id: 'companyProfile', path: '/company-profile', icon: <BuildingOfficeIcon className="h-6 w-6" />, label: 'Companies' },
  ];

  return (
    <div className={`bg-slate-800 text-white transition-all duration-300 ${expanded ? 'w-64' : 'w-20'} flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white h-8 w-8 rounded flex items-center justify-center font-bold">
            PB
          </div>
          {expanded && <span className="ml-3 font-semibold text-lg">PropTech</span>}
        </div>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-white"
        >
          {expanded ? 
            <ChevronLeftIcon className="h-5 w-5" /> : 
            <ChevronRightIcon className="h-5 w-5" />
          }
        </button>
      </div>

      <nav className="mt-6 flex-grow">
        <ul>
          {navigationItems.map((item) => (
            <li 
              key={item.id}
              className={`
                px-4 py-3 flex items-center cursor-pointer
                transition-colors duration-200
                ${currentPage === item.id ? 'bg-blue-600' : 'hover:bg-slate-700'}
              `}
              onClick={() => setCurrentPage(item.id)}
            >
              <Link to={item.path} className="flex items-center w-full">
                <div>{item.icon}</div>
                {expanded && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with Settings and Logout */}
      <div className="mt-auto w-full border-t border-slate-700">
        <ul>
          <li className="px-4 py-3 flex items-center cursor-pointer hover:bg-slate-700 w-full">
            <Cog6ToothIcon className="h-6 w-6" />
            {expanded && <span className="ml-3">Settings</span>}
          </li>
          <li className="px-4 py-3 flex items-center cursor-pointer hover:bg-slate-700 w-full">
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            {expanded && <span className="ml-3">Logout</span>}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
