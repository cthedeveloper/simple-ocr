import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Home, Settings, FileText, Folder } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const navItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, to: "/" },
    {
      name: "Templates",
      icon: <FileText className="w-5 h-5" />,
      to: "/templates",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      to: "/settings",
    },
    {
      name: "File Management",
      icon: <Folder className="w-5 h-5" />,
      to: "/files",
    },
  ];

  return (
    <div
      className={`transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } bg-[#004D40] min-h-screen text-white flex flex-col`}
    >
      <div className="p-4 flex justify-between items-center">
        {!collapsed && (
          <h2 className="text-xl font-bold tracking-wide">OCRMate</h2>
        )}
        <button onClick={toggleSidebar} className="ml-auto">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <nav className="mt-6 px-2 flex-1">
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.to}
                className="flex items-center gap-3 hover:bg-[#00332D] p-3 rounded-lg transition-colors"
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
