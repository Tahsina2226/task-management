import React from "react";
import { motion } from "framer-motion";
import { FaTasks, FaClipboardList, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex justify-center items-center bg-gradient-to-br from-teal-50 via-yellow-50 to-pink-100 p-5 min-h-screen overflow-hidden">
      {/* Soft Background Color */}
      <div className="z-0 absolute inset-0 bg-teal-200 opacity-20"></div>

      {/* Animated Background Gradient */}
      <div className="z-0 absolute inset-0 bg-gradient-to-br from-teal-50 via-yellow-50 to-pink-100 opacity-50 animate-pulse"></div>

      {/* Floating Decorative Elements */}
      <div className="top-0 left-0 z-0 absolute bg-yellow-200 opacity-30 rounded-full w-40 h-40 hover:scale-110 transition-all animate-pulse"></div>
      <div className="right-0 bottom-0 z-0 absolute bg-pink-200 opacity-30 rounded-full w-28 h-28 hover:scale-110 transition-all animate-pulse"></div>
      <div className="bottom-10 left-1/2 z-0 absolute bg-teal-200 opacity-20 rounded-full w-60 h-60 -translate-x-1/2 animate-pulse transform"></div>

      <motion.div
        className="z-10 relative bg-white bg-opacity-30 shadow-2xl hover:shadow-3xl backdrop-blur-lg p-10 rounded-2xl w-11/12 md:w-3/5 lg:w-2/5 text-center hover:scale-105 transition-all transform"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Animated Heading */}
        <motion.h1
          className="font-bold text-gray-800 text-3xl md:text-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Task Tracker
        </motion.h1>

        {/* Icon-Based Illustration */}
        <motion.div
          className="flex justify-center mt-6 text-gray-800 text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <FaClipboardList />
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-4 text-gray-800 text-lg md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Stay organized, achieve your goals, and track your progress with ease!
        </motion.p>

        {/* CTA Button */}
        <motion.button
          className="z-10 relative flex justify-center items-center gap-2 bg-white hover:bg-teal-50 shadow-lg hover:shadow-xl mt-6 px-6 py-3 rounded-full font-semibold text-teal-600 text-lg hover:scale-105 transition-all transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          onClick={() => navigate("/tasks")}
        >
          <FaTasks /> Get Started
        </motion.button>

        {/* User Info Section */}
        <motion.div
          className="bg-white bg-opacity-40 shadow-md mt-10 p-6 rounded-xl hover:scale-105 transition-all transform"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            className="flex justify-center items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
          >
            <FaUserCircle className="text-teal-500 text-5xl" />
            <div className="text-gray-800">
              <h2 className="font-semibold text-xl">Welcome Back!</h2>
              <p className="text-sm">Keep track of your tasks and stay organized.</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Footer with links or useful information */}
      <motion.footer
        className="bottom-0 absolute bg-white bg-opacity-40 py-4 w-full text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <p className="text-gray-600 text-sm">
          &copy; 2025 Task Tracker | <a href="/privacy-policy" className="text-teal-600">Privacy Policy</a> | <a href="/terms" className="text-teal-600">Terms & Conditions</a>
        </p>
      </motion.footer>

      {/* Overlay for background interaction */}
      <motion.div
        className="z-0 absolute inset-0 bg-black opacity-10 hover:opacity-20 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    </div>
  );
};

export default HomePage;
