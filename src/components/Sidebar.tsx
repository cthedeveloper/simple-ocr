import React from "react";
import { Menu } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#004D40] p-6 text-white flex flex-col items-center min-h-screen">
      {/* App Name */}
      <h2 className="text-2xl font-semibold text-center mb-12">OCRMate</h2>

      {/* Single Menu Item */}
      <nav className="w-full">
        <ul className="space-y-4">
          <li>
            <button className="flex items-center text-white hover:bg-[#00332D] p-3 rounded-lg w-full">
              <Menu className="h-6 w-6 mr-3" />
              App Menu
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
