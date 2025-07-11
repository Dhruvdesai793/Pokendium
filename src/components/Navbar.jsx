import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo23.png'




const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/" }, 
    { name: "Pokedex", path: "/search" },
    { name: "Berry Dex", path: "/berries" },
    { name: "Smogon Explorer", path: "/teams" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 bg-opacity-90 backdrop-blur-md p-4 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between ">
        
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="" className='h-[50px]'/>
          <p className="font-bold text-inherit text-white text-lg">Pokendium</p>
        </Link>

        
        <div className="hidden md:flex flex-grow justify-center items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-white text-lg font-semibold hover:text-blue-400 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-700"
            >
              {item.name}
            </Link>
          ))}
        </div>

        
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 rounded-md"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      
      <div
        className={`
          fixed inset-0 top-16 bg-gray-900 bg-opacity-95 backdrop-blur-md z-40 
          transition-transform duration-300 ease-in-out transform
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}
      >
        <div className="flex flex-col items-center py-8 gap-4 bg-gray-900 bg-opacity-75 backdrop-blur-md">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center text-white text-xl font-semibold hover:text-blue-400 transition-colors duration-200 px-3 py-4 rounded-md hover:bg-gray-700"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;