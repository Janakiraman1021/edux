import React, { useState } from 'react';
import { Code2, ChevronDown } from 'lucide-react';
import "./Main.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <nav className="container mx-auto px-4 py-6 flex items-center justify-between bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Code2 className="w-8 h-8 text-[#00FF7F]" />
        <span className="text-2xl font-bold font-press">
          edu<span className="text-[#00FF7F]">X</span>lite
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {/* Learn Dropdown */}
        <div className="text-white">
      <div className="relative">
        <button 
          onClick={() => toggleMenu('learn')} 
          className="px-4 py-2 rounded-md hover:text-[#00FF7F] font-jaini text-3xl flex items-center gap-1 transition-colors"
        >
          Learn <ChevronDown className="w-4 h-4" />
        </button>
        
        {openMenu === 'learn' && (
          <div className="z-20 absolute left-0 mt-2 p-6 w-[900px] bg-[#020817] shadow-xl rounded-xl border border-gray-800 grid grid-cols-4 gap-8">
            <div>
              <h3 className="text-gray-400 font-medium mb-4 font-regular">RECOMMENDED</h3>
              <div className="space-y-12 min-w-[16rem]">
                <div className="flex gap-3">
                  <img src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=64&h=64&fit=crop&auto=format" 
                       alt="Python" 
                       className="w-16 h-16 rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium font-regular">Python</h4>
                    <p className="text-sm text-gray-400 font-jaini">Learn the basics of programming with beginner-friendly exercises.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <img src="https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=64&h=64&fit=crop&auto=format" 
                       alt="HTML" 
                       className="w-16 h-16 rounded-lg"
                  />
                  <div>
                    <h4 className="font-medium font-regular">HTML</h4>
                    <p className="text-sm text-gray-400 font-jaini">Create your first website with HTML, the building block of the web.</p>
                  </div>
                </div>
                <button
      className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-md py-3 font-press mt-4 text-sm"
      onClick={() => navigate("/home")}
    >
      All Courses 
    </button>
              </div>
            </div>

            <div className='pl-12'>
              <h3 className="text-gray-400 font-medium mb-4 font-regular">DATA SCIENCE</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Python</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Intermediate Python</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">NumPy</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">SQL</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Gen AI</a>
              </div>
            </div>

            <div>
              <h3 className="text-gray-400 font-medium mb-4 font-regular">WEB DEVELOPMENT</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">HTML</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">CSS</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">JavaScript</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Intermediate JavaScript</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">React</a>
                <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">p5.js</a>
                <div className="flex items-center gap-2">
                  <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Node.js</a>
                  <span className="text-xs px-2 py-1 rounded bg-purple-900 text-purple-300 font-regular">CLUB</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-gray-400 font-medium mb-4 font-regular">TOOLS</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Command Line</a>
                  <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Git & GitHub</a>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-400 font-medium mb-4 font-regular">COMPUTER SCIENCE</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">C++</a>
                  <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Java</a>
                  <div className="flex items-center gap-2">
                    <a href="#" className="block text-gray-300 hover:text-[#00FF7F] font-regular">Data Structures & Algorithms</a>
                    <span className="text-xs px-2 py-1 rounded bg-purple-900 text-purple-300 font-regular">CLUB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

        {/* Practice Dropdown */}
        <div className="relative">
          <button onClick={() => toggleMenu('practice')} className="hover:text-[#00FF7F] font-jaini text-3xl flex items-center gap-1 transition-colors">
            Practice <ChevronDown className="w-4 h-4" />
          </button>
          {openMenu === 'practice' && (
            <div className="absolute left-0 mt-2 w-48 bg-[#020817] shadow-lg rounded-lg">
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 font-regular">Challenges</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 font-regular">Projects</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 font-regular">#30DaysJourney</a>
            </div>
          )}
        </div>

        {/* Build Link */}
        <a href="#" className="hover:text-[#00FF7F] transition-colors font-jaini text-3xl">Build</a>

        {/* Community Dropdown */}
        <div className="relative">
          <button onClick={() => toggleMenu('community')} className="font-jaini text-3xl hover:text-[#00FF7F] flex items-center gap-1 transition-colors">
            Community <ChevronDown className="w-4 h-4" />
          </button>
          {openMenu === 'community' && (
            <div className="absolute left-0 mt-2 w-48 bg-[#020817] shadow-lg rounded-lg">
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 font-regular">Twitter (X)</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 font-regular">Facebook</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 font-regular">LinkedIn</a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-700 font-regular">Github</a>
            </div>
          )}
        </div>

        {/* Courses Link */}
        <a href="#" className="hover:text-[#00FF7F] transition-colors font-jaini text-3xl">Courses</a>
        <a href="/ai-agent" className="hover:text-[#00FF7F] transition-colors font-jaini text-3xl">Aurora AI</a>
      </div>

      {/* Login & Get Started Buttons */}
      <div className="hidden md:flex items-center gap-6">
      <button 
        href="/login" 
        onClick={(e) => { e.preventDefault(); navigate("/login"); }} 
        className="hover:text-[#00FF7F] transition-colors font-jaini text-3xl"
      >
        Login
      </button>
      <button 
        onClick={() => navigate("/register")} 
        className="bg-[#00FF7F] text-black px-6 py-2 rounded-full font-medium hover:bg-[#00CC6A] font-jaini text-3xl transition-colors"
      >
        Get Started
      </button>
    </div>
    </nav>
  );
}

export default Navbar;