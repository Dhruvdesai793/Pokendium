import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';



import HomePage from './pages/HomePage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import SmogonApiExplorerPage from './pages/CompetitiveTeamsPage';
import BerriesPage from './pages/BerriesPage';
import PokemonDetailPage from './pages/PokemonDetailPage'; 

const queryClient = new QueryClient();


const NotFound = () => (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
    <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
    <p className="text-2xl text-gray-300 mb-8">Page Not Found</p>
    <Link to="/home" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors">
      Go to Home
    </Link>
  </div>
);

function AppContent() {
  const location = useLocation();
  
  
  const showNavbar = !location.pathname.startsWith('/Pokendium/pokemon/') &&
                     !location.pathname.startsWith('/pokemon/'); 

  return (
    <>
      {}
      {showNavbar && <Navbar />}

      {}
      {}
      <div className={`parallax-container ${showNavbar ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} /> {}
          <Route path="/home" element={<HomePage />} /> {}
          <Route path="/search" element={<AdvancedSearchPage />} />
          <Route path="/teams" element={<SmogonApiExplorerPage />} />
          <Route path="/berries" element={<BerriesPage />} />
          <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/Pokendium">
        <AppContent />
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </QueryClientProvider>
  );
}

export default App;