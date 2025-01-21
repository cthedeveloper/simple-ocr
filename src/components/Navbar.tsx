import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center mb-6 p-4 bg-[#00796B] text-white shadow-md">
      <h1 className="text-3xl text-white font-semibold">OCR Tool</h1>
      <div className="flex items-center gap-6">
        {/* Navigation Links */}
        <nav className="flex gap-6">
          <Link
            to="/"
            className="text-white hover:bg-[#004D40] px-4 py-2 rounded transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:bg-[#004D40] px-4 py-2 rounded transition duration-200"
          >
            About
          </Link>
          <Link
            to="/settings"
            className="text-white hover:bg-[#004D40] px-4 py-2 rounded transition duration-200"
          >
            Settings
          </Link>
        </nav>

        {/* Authentication Buttons */}
        <div className="flex items-center gap-4">
          <button className="bg-[#004D40] text-white px-4 py-2 rounded hover:bg-[#00695C] transition duration-200">
            Login
          </button>
          <button className="bg-[#004D40] text-white px-4 py-2 rounded hover:bg-[#00695C] transition duration-200">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
