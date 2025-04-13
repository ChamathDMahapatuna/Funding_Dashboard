import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import AdvancedSearch from './components/AdvancedSearch';
import AdminAdvancedSearch from './components/AdminAdvancedSearch';
import AdminLogin from './components/AdminLogin';
import Home from './components/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/advanced-search" element={<AdvancedSearch />} />

              <Route path="/admin/advanced-search" element={<AdminAdvancedSearch />} />
              <Route path="/login" element={<AdminLogin />} /> {/* Add this alias route */}
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
