import React from "react";
import { useLocation } from "react-router-dom";
import { Terminal, Code2 } from "lucide-react";

function Cart() {
  const location = useLocation();
  const { course } = location.state || {}; // Get the course details from state

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=2000")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-8xl font-bold text-white mb-8 font-mono" style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}>
            No Course Selected
          </h1>
          <p className="text-xl text-gray-200 mb-6 leading-relaxed">
            Please go back and select a course to purchase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-emerald-900 relative overflow-hidden">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Forest background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Course level badge */}
        <div className="flex items-center gap-2 mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/30 text-white backdrop-blur-sm border border-white/10">
            <Terminal className="w-4 h-4 mr-2" />
            {course.level.toUpperCase()}
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-blue-400">CLUB</span>
            <span className="text-pink-400 ml-1">COURSE</span>
          </div>
        </div>

        {/* Main title */}
        <h1 className="text-8xl font-bold text-white mb-8 font-mono" style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}>
          {course.courseName}
        </h1>

        {/* Course description */}
        <div className="max-w-3xl">
          <p className="text-xl text-gray-200 mb-6 leading-relaxed">
            {course.description}
          </p>

          <p className="text-lg text-gray-300 mb-8">
            Instructor:{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              {course.courseTeacher}
            </a>
          </p>

          {/* CTA Button */}
          <button className="group relative inline-flex items-center px-8 py-4 text-xl font-bold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-1">
            <Code2 className="w-6 h-6 mr-2" />
            Start Learning
            <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
          </button>
        </div>

        {/* Decorative course illustration */}
        <div className="absolute bottom-0 right-0 w-96 pt-11 h-96 opacity-80">
          <img
            src={course.image} // Use the image from the course object
            alt={course.courseName}
            className="object-cover rounded-tl-3xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Cart;