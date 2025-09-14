import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // initialize navigate

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove authentication token
    localStorage.removeItem("role");  // Remove role
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 px-6 py-4 text-white shadow-md w-full">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold tracking-wide">MANAGE IT</h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Log Out
      </button>
    </div>
  );
};

export default Navbar;
