import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Terminal, Code2 } from "lucide-react";

function Cart1() {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`https://courses-npmj.vercel.app/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute  inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=2000")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-8xl font-bold text-white mb-8 font-mono" style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}>
            No Course Found
          </h1>
          <p className="text-xl text-gray-200 mb-6 leading-relaxed">
            The course you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-2 mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black/30 text-white backdrop-blur-sm border border-white/10">
            <Terminal className="w-4 h-4 mr-2" />
            {/* Assuming `level` is not part of the API response, you can hardcode it or remove it */}
            BEGINNER
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-blue-400">CLUB</span>
            <span className="text-pink-400 ml-1">COURSE</span>
          </div>
        </div>

        <h1 className="text-8xl font-bold text-white mb-8 font-mono" style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.2)" }}>
          {course.courseName}
        </h1>

        <div className="max-w-3xl">
          <p className="text-xl text-gray-200 mb-6 leading-relaxed">
            {course.courseDescription}
          </p>

          <p className="text-lg text-gray-300 mb-8">
            Instructor:{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              {course.courseTeacher}
            </a>
          </p>

          <button className="group relative inline-flex items-center px-8 py-4 text-xl font-bold text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-1">
            <Code2 className="w-6 h-6 mr-2" />
            Start Learning
            <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
          </button>
        </div>

        {/* If you want to include an image, you can add a default image or fetch it from the API if available */}
        <div className="absolute bottom-0 right-0 w-96 pt-11 h-96 opacity-80">
          <img
            src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2000" // Default image or dynamically fetched image
            alt={course.courseName}
            className="object-cover rounded-tl-3xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Cart1;