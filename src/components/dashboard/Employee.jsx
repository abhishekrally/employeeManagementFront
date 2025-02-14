import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const [userName, setUserName] = useState("");
  const [tasklist, setTaskList] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // ✅ Decode JWT Token
  const decodeJWT = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])); // Decode payload
    } catch (error) {
      console.error("❌ Invalid token:", error);
      return null;
    }
  };

  // ✅ Get User Details from Token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userDetails = decodeJWT(token);
      if (userDetails) {
        console.log("✅ User Details:", userDetails);
        setUserId(userDetails.id);
        setUserName(userDetails.name || "User");
      }
    }
  }, []);

  // ✅ Fetch Tasks Data
  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://employeemanagement-ccan.onrender.com/api/users/fetchTaskUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });
      const data = await response.json();
      console.log("✅ Fetched Tasks:", data);
      setTaskList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  };

  // ✅ Memoized Task Counts
  const pendingTasksCount = useMemo(() => tasklist.filter(task => task.status === "Pending").length, [tasklist]);
  const completedTasksCount = useMemo(() => tasklist.filter(task => task.status === "Complete").length, [tasklist]);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };



  const updateTaskStatus = async (taskId) => {
    try {
      const response = await fetch("https://employeemanagement-ccan.onrender.com/api/users/updateTaskStatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: "Completed" }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setTaskList(prevTasks => prevTasks.map(task => 
          task._id === taskId ? { ...task, status: "Completed" } : task
        ));
      } else {
        console.error("❌ Failed to update task:", data.message);
      }
    } catch (error) {
      console.error("❌ Error updating task status:", error);
    }
  };
  

  return (
    <div className="w-full p-6 bg-gray-900 min-h-screen rounded-lg shadow-lg text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Hello, {userName} 👋</h2>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600">
          Log Out
        </button>
      </div>

      {/* Task Summary */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div className="flex-1 min-w-[150px] bg-blue-500 p-4 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold">{pendingTasksCount}</h3>
          <p>Tasks Assigned</p>
        </div>
        <div className="flex-1 min-w-[150px] bg-green-500 p-4 rounded-lg shadow text-center">
          <h3 className="text-xl font-bold">{completedTasksCount}</h3>
          <p>Completed</p>
        </div>
      </div>

      {/* Task List (No Scrollbar) */}
      <div className="w-full p-4">
        <div className="flex space-x-4 overflow-hidden">
        {tasklist.map((task, index) => (
  <div
    key={index}
    className="bg-gray-800 w-64 h-56 p-4 rounded-lg shadow-lg flex flex-col justify-between"
  >
    <h3 className="text-lg font-bold">📌 {task.title}</h3>
    <p className="text-sm">📝 {task.description}</p>
    <p>📅 {task.date}</p>
    <p>📂 {task.category}</p>
    <p>⚡ {task.priority}</p>
    <p className={`font-bold ${task.status === "Pending" ? "text-red-400" : "text-green-400"}`}>
      🚀 {task.status}
    </p>
    
    {task.status === "Pending" && (
      <button
        onClick={() => updateTaskStatus(task._id)}
        className="px-2 py-1 bg-blue-500 text-white rounded mt-2 hover:bg-blue-600"
      >
        Mark as Completed
      </button>
    )}
  </div>
))}

        </div>
      </div>
    </div>
  );
};

export default Employee;
