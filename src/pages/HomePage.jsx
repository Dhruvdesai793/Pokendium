import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import logo from '../assets/logo23.png';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <a href="https://github.com/Dhruv-Desai-05/Pokendium" target="_blank" rel="noopener noreferrer" className="button">
        <span className="text">Star on GitHub</span>
        <svg aria-hidden="true" fill="currentColor" viewBox="0 0 47.94 47.94" xmlns="http://www.w3.org/2000/svg" className="icon">
          <path d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
          c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
          c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
          c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
          c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
          C22.602,0.567,25.338,0.567,26.285,2.486z" />
        </svg>
      </a>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    font-family: Inter, sans-serif;
    cursor: pointer;
    background: #000000;
    color: #ffffff;
    border: none;
    padding: 12px 25px;
    font-size: 16px;
    font-weight: 700;
    border-radius: 100px;
    transition: all 0.5s ease;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .button:hover {
    scale: 1.1;
  }

  .button:active {
    scale: 1;
  }

  .button:hover .icon {
    fill: #ffff00;
    scale: 1.1;
    rotate: 360deg;
    filter: drop-shadow(0 0 5px rgba(255, 208, 0, 0.8))
      drop-shadow(0 0 10px rgba(255, 208, 0, 0.6));
  }

  .button:hover .text {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.2))
      drop-shadow(0 0 10px rgba(255, 255, 255, 0.4));
  }

  .text {
    transition: all 1s ease;
  }

  .icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-top: -3px;
    transition: all 1s ease;
  }`;


const HomePage = () => {
  const overlayRef = useRef(null);
  const leftBlockRef = useRef(null);
  const rightBlockRef = useRef(null);
  const counterRef = useRef(null);
  const logoImgRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroSubtextRef = useRef(null);
  const ctaButtonRef = useRef(null);
  const pokedexCardRef = useRef(null);
  const berryCardRef = useRef(null);
  const teamsCardRef = useRef(null);
  const mainContentRef = useRef(null);
  const heroOverlayRef = useRef(null);

  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setShowLoadingOverlay(false)
    });

    gsap.set(mainContentRef.current, { opacity: 0 });
    gsap.set(heroSectionRef.current, { scale: 1.2, opacity: 0 });
    gsap.set([heroTextRef.current, heroSubtextRef.current, ctaButtonRef.current], { y: 60, opacity: 0 });
    gsap.set([pokedexCardRef.current, berryCardRef.current, teamsCardRef.current], { opacity: 0, y: 100, rotationX: -90 });
    gsap.set(heroOverlayRef.current, { opacity: 1 });

    let count = { value: 0 };
    tl.to(count, {
      value: 100,
      duration: 3.7,
      ease: "power2.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(count.value) + '%';
        }
      }
    });

    tl.to([logoImgRef.current, counterRef.current], {
      opacity: 0,
      y: -100,
      duration: 0.5,
      ease: "power3.inOut"
    }, "-=1.8");

    tl.to([leftBlockRef.current, rightBlockRef.current], {
      backgroundPosition: '100% 0%',
      duration: 1.2,
      ease: "power2.inOut"
    }, "-=0.7");

    tl.to(leftBlockRef.current, {
      x: '-100%',
      duration: 1.6,
      ease: "power4.inOut"
    }, "<0.2");
    tl.to(rightBlockRef.current, {
      x: '200%',
      duration: 1.3,
      ease: "power4.inOut"
    }, "<");

    tl.to(mainContentRef.current, {
      opacity: 1,
      duration: 0.01,
      ease: "none"
    }, "-=1");

    tl.to(heroSectionRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1.8,
      ease: "power3.out"
    }, "<");

    tl.to(heroOverlayRef.current, {
      opacity: 0,
      duration: 0.61,
      ease: "power2.out"
    }, "<0.2");

    tl.to([heroTextRef.current, heroSubtextRef.current, ctaButtonRef.current, '.hero-buttons-container .button'], {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      stagger: 0.25
    }, "<0.3");

    tl.to([pokedexCardRef.current, berryCardRef.current, teamsCardRef.current], {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.9,
      ease: "back.out(1.7)",
      stagger: 0.2
    }, "-=0.7");

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    }, "+=0.5");

    return () => tl.kill();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans relative overflow-hidden">
      {showLoadingOverlay && (
        <div ref={overlayRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center homepage-loading-overlay">
          <div ref={leftBlockRef} className="absolute top-0 left-0 w-full h-1/2 md:h-full md:w-1/2 bg-indigo-950 homepage-loading-block transform-gpu"></div>
          <div ref={rightBlockRef} className="absolute bottom-0 left-0 w-full h-1/2 md:h-full md:w-1/2 md:bottom-auto md:right-0 bg-indigo-950 homepage-loading-block transform-gpu"></div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div ref={counterRef} className="text-6xl font-bold text-lime-400 mb-8">0%</div>
            <div ref={logoImgRef} className="flex items-center gap-2 flex-col mb-4">
              <img src={logo} alt="Pokendium Logo" className="h-24 w-24 object-contain homepage-logo-icon" />
              <p className="font-bold text-white text-lg homepage-logo-text">Project: Pokendium</p>
              <p className='text-md'>Dhruv Desai</p>
              <p>Visit the Github for source code</p>
              <p>Dont forget to star the repo</p>
            </div>
          </div>
        </div>
      )}

      <div ref={mainContentRef} className="relative z-10 p-4 pt-20 homepage-main-content">
        <section
          ref={heroSectionRef}
          className="relative h-[60vh] flex items-center justify-center bg-cover bg-center rounded-xl shadow-lg mb-12"
          style={{ backgroundImage: 'url(https://static.pokemonpets.com/images/backgrounds/1.jpg)'}}
        >
          <div ref={heroOverlayRef} className="absolute inset-0 bg-black opacity-100 rounded-xl homepage-hero-pixel-overlay"></div>
          <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>
          <div className="relative z-10 text-center p-8">
            <h1 ref={heroTextRef} className="text-5xl font-extrabold text-white leading-tight mb-4 p-4 text-shadow-lg homepage-hero-text">
              Welcome to Pokendium
            </h1>
            <p ref={heroSubtextRef} className="text-xl text-gray-300 mb-8">
              Your ultimate guide to the Pokémon world.
            </p>
            <div className="hero-buttons-container flex flex-col items-center gap-4">
              <Link
                ref={ctaButtonRef}
                to="/search"
                className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Explore Pokémon
              </Link>
              <Button />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div ref={pokedexCardRef} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Pokedex</h2>
            <p className="text-gray-300 mb-4">Dive into the comprehensive Pokedex with detailed information on every Pokémon.</p>
            <Link to="/search" className="text-blue-400 hover:underline">Learn More →</Link>
          </div>
          <div ref={berryCardRef} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Berry Dex</h2>
            <p className="text-gray-300 mb-4">Discover all about Pokémon berries, their effects, and where to find them.</p>
            <Link to="/berries" className="text-blue-400 hover:underline">Learn More →</Link>
          </div>
          <div ref={teamsCardRef} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Competitive Teams</h2>
            <p className="text-gray-300 mb-4">Explore competitive Pokémon teams and strategies from Smogon.</p>
            <Link to="/teams" className="text-blue-400 hover:underline">Learn More →</Link>
          </div>
        </section>

        <footer className="text-center text-gray-500 py-8 border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} Pokendium. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;