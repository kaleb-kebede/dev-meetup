import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    // Main container with a pure black background and relative positioning for pseudo-elements
    <div className="bg-black min-h-full h-full flex flex-col items-center justify-center text-center p-4 overflow-hidden relative">
      
      {/* Subtle background glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          Connect, Code, and Collaborate
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300">
          Join <span className="text-cyan-400 font-semibold">Dev Meetup</span>, the exclusive social network for developers. Share your projects, discover new technologies, and build your professional network in a community that speaks your language.
        </p>
        <Link
          to="/login"
          className="mt-12 inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg py-4 px-12 rounded-full transition-transform transform hover:scale-105 duration-300 shadow-lg shadow-cyan-500/20"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
