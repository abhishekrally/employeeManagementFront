import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  ListTodo,
  Calendar,
  BarChart3,
  Users,
} from "lucide-react";

const Empsidebar = ({ setActiveView }) => {
  return (
    <div className="bg-gray-800 text-white h-screen w-64 flex flex-col p-6 shadow-lg border-t border-r border-gray-400">
      <ul className="space-y-4">
        <li
          className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => setActiveView("dashboard")}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </li>
        <li
          className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => setActiveView("meetings")}
        >
          <Calendar size={20} />
          <span>Meetings</span>
        </li>
        <li
          className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => setActiveView("reports")}
        >
          <BarChart3 size={20} />
          <span>Reports</span>
        </li>
      </ul>
    </div>
  );
};

export default Empsidebar;
