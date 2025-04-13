import React, { useState } from 'react';
import { Code2, Terminal, Rocket, Star, ChevronRight, Github, ChevronDown } from 'lucide-react';
import "./Main.css";
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";

function Home() {
  const [openMenu, setOpenMenu] = useState(null);
    const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-jaini md:text-4xl font-bold mb-6">Start Your</h1>
        <span className='font-press text-5xl animate-spin'>Coding Adventure</span>
        <h2 className="text-3xl font-jaini md:text-3xl font-bold mb-6">
          Learn to code the <span className="text-[#00FF7F] font-jaini">fun</span> way ⋆˙⟡
        </h2>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Master programming fundamentals through bite-sized lessons and interactive exercises.
          Build projects, earn points, and level up your coding skills!
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button       onClick={() => navigate("/home")} className="bg-[#00FF7F] text-black px-8 py-3 rounded-full font-medium hover:bg-[#00CC6A] transition-colors flex items-center gap-2">
            Start Learning <ChevronRight className="w-5 h-5" />
          </button>
          <button className="border border-gray-700 px-8 py-3 rounded-full font-medium hover:border-[#00FF7F] transition-colors flex items-center gap-2">
            <Github className="w-5 h-5" /> Join Community
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;