import React from 'react';

const M1 = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-[#8b93a7] text-2xl md:text-3xl mb-4 font-jaini">
          Explore the world of
        </h2>
        
        <h1 className="text-white font-press text-5xl md:text-7xl font-bold mb-8" 
            style={{
              letterSpacing: '0.05em',
              textShadow: '2px 2px 0px rgba(255,255,255,0.1)'
            }}>
          edu<span className='text-emerald-500'>X</span>lite
        </h1>

        <p className="text-[#8b93a7] text-lg md:text-xl leading-relaxed font-regular max-w-2xl mx-auto">
          Start your coding journey with 200+ hours of interactive programming exercises paired with real-world projects. Explore for free! ✨
        </p>
      </div>
    </div>
  );
};

export default M1;