import React, { useState, useEffect } from "react";
import { Book } from "lucide-react";
import Img1 from "../requirements/sol.png";
import Img2 from "../requirements/rust.png";
import Img3 from "../requirements/web.png";
import Img4 from "../requirements/python.png";
import { useNavigate } from "react-router-dom";

// Array of local images to use for courses
const courseImages = [Img1, Img2, Img3, Img4];

// Custom descriptions focused on beginners
const getBeginnerDescription = (courseName) => {
  return `Perfect for beginners, this ${courseName} course starts from the basics and gradually builds your skills. No prior experience required - just bring your enthusiasm and willingness to learn!`;
};

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  
  // Default categories - left empty for manual addition
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://courses-npmj.vercel.app/api/courses/all");
        const data = await response.json();
        
        // Process all courses as beginner courses with custom descriptions and local images
        const processedData = data.map((course, index) => {
          // Use modulo to cycle through the available images
          const imageIndex = index % courseImages.length;
          
          return {
            ...course,
            image: courseImages[imageIndex], // Use local image
            description: course.description || getBeginnerDescription(course.courseName),
            level: "Beginner", // Set all courses to beginner level
            duration: course.duration || "4-6 weeks" // Shorter duration for beginner courses
          };
        });
        
        setCourses(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCategoryClick = (category) => {
    // Toggle the selected category
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  const handleBuyClick = (course) => {
    navigate("/cart", { state: { course } }); // Pass the entire course object
  };

  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.category === selectedCategory)
    : courses;

  return (
    <div className="min-h-screen bg-[#020817] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Book className="w-8 h-8 text-emerald-400" />
          <h1 className="text-2xl font-bold">Beginner Courses</h1>
        </div>

        {/* Filters - Categories placeholder for manual addition */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full transition-colors border-2 ${
                selectedCategory === category
                  ? 'bg-black text-emerald-400 border-emerald-400'
                  : 'bg-gray-800 hover:bg-black hover:text-emerald-400 border-white/60 hover:border-emerald-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-center text-gray-400">Loading courses...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <div
                key={course.courseId}
                className="bg-gray-900/50 rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 border-4 border-white/50"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Course • {course.duration}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{course.courseName}</h3>
                    <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-1 rounded-full">
                      BEGINNER
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-emerald-400">
                      Instructor: {course.courseTeacher}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-800 text-xs px-3 py-1 rounded-full border border-gray-200/20">
                      {course.level}
                    </span>
                  </div>
                  {/* Buy Button */}
                  <button
  onClick={() => handleBuyClick(course)} // Pass the course object
  className="w-full mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors text-white"
>
  Buy Now
</button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No courses found in this category.</p>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              View All Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;