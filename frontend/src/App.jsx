// src/App.jsx
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import advancedSearch from './components/AdvancedSearch';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'advancedSearch':
        return <advancedSearch />;
      case 'fundingDetails':
        return <FundingDetails />;
      case 'companyProfile':
        return <CompanyProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;