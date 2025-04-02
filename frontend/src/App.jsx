import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AdvancedSearch from './components/AdvancedSearch';
import FundingDetails from './components/FundingDetails.jsx';
import CompanyProfile from './components/CompanyProfile';
import Login from './pages/Login.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <AuthProvider>
      <Routes>
        {/* Login route outside the main layout */}
        <Route path="/login" element={<Login />} />
        
        {/* All other routes with Sidebar and Header */}
        <Route path="/*" element={
          <div className="flex h-screen bg-gray-50">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/advanced-search" element={<AdvancedSearch />} />
                  <Route path="/funding-details" element={<FundingDetails />} />
                  <Route path="/company-profile" element={<CompanyProfile />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;