import React, { useState, useEffect } from "react";
import { Book } from "lucide-react";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://courses-npmj.vercel.app/api/courses/all");
        const data = await response.json();
        setCourses(data); // Assuming API response is an array of courses
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#020817] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Book className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl font-bold">All Courses</h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-gray-900/50 rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 border-4 border-white/50"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{course.courseName}</h3>
                  </div>
                  <div className="text-sm text-emerald-400 mb-2">
                    Instructor: {course.courseTeacher}
                  </div>
                  <div className="text-xs text-gray-400">Course ID: {course.courseId}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
