import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const CreateMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Employee",
    ID: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    const { name, email, role, ID, password, confirmPassword } = formData;

    // Input Validations
    if (!name.trim() || !email.trim() || !ID.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://employeemanagement-ccan.onrender.com/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, ID, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to create member.");

      setMessage("Member created successfully! 🎉");
      setFormData({ name: "", email: "", role: "Employee", ID: "", password: "", confirmPassword: "" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate(); 

  const handleBack = () => {
    navigate('/admin');
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between w-full max-w-2xl mb-4">
      <button  
    onClick={handleBack} 
    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
  >
    back
  </button>
  </div>
        <h2 className="text-2xl font-bold text-center text-white mb-6">Create Member</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter name"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>

          {/* User ID */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">User ID</label>
            <input
              type="text"
              name="ID"
              value={formData.ID}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter User ID"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Confirm password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-500 disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Member"}
          </button>
        </form>

        {/* Success or Error Message */}
        {message && (
          <p className={`text-center mt-4 ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateMember;
