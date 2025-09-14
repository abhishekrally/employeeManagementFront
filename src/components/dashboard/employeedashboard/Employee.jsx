import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Empsidebar from "./Empsidebar";
import Employeetask from "./Employeetask";
import Meetings from "../Meetings";

const Employee = () => {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState({ pending: [], completed: [] });
  const [userId, setUserId] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();

  // ✅ Decode JWT Token
  const decodeJWT = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("❌ Invalid token:", error);
      return null;
    }
  };

  // ✅ Get User Details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userDetails = decodeJWT(token);
      if (userDetails) {
        setUserId(userDetails.id);
        setUserName(userDetails.name || "User");
      }
    }
  }, []);

  // ✅ Fetch Tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://employeemanagement-ccan.onrender.com/api/users/fetchTaskUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId }),
        }
      );

      const data = await response.json();
      if (data.pendingTasks && data.completedTasks) {
        setTasks({
          pending: data.pendingTasks,
          completed: data.completedTasks,
        });
      }
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  // ✅ Update Task Status
  const updateTaskStatus = async (taskId) => {
    try {
      const response = await fetch(
        "https://employeemanagement-ccan.onrender.com/api/users/updateTaskStatus",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            taskId,
            status: "Completed",
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update task");

      fetchTasks(); // refresh after update
    } catch (error) {
      console.error("❌ Failed to update task:", error.message);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      <Navbar />
      <div className="flex flex-1">
        <Empsidebar setActiveView={setActiveView} />

        <main className="flex-1 p-6">
          {activeView === "dashboard" && (
            <div>
              {/* ✅ Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-700 p-6 rounded-lg text-center shadow-lg">
                  <h3 className="text-3xl font-bold">
                    {tasks.pending.length + tasks.completed.length}
                  </h3>
                  <p className="text-gray-400">Total Tasks</p>
                </div>
                <div className="bg-blue-600 p-6 rounded-lg text-center shadow-lg">
                  <h3 className="text-3xl font-bold">{tasks.pending.length}</h3>
                  <p>Pending Tasks</p>
                </div>
                <div className="bg-green-600 p-6 rounded-lg text-center shadow-lg">
                  <h3 className="text-3xl font-bold">{tasks.completed.length}</h3>
                  <p>Completed Tasks</p>
                </div>
                <div className="bg-red-600 p-6 rounded-lg text-center shadow-lg">
                  <h3 className="text-3xl font-bold">
                    {
                      tasks.pending.filter(
                        (task) => new Date(task.date) < new Date()
                      ).length
                    }
                  </h3>
                  <p>Overdue Tasks</p>
                </div>
              </div>

              {/* ✅ Task Lists */}
              <Employeetask
                pendingTasks={tasks.pending}
                completedTasks={tasks.completed}
                onComplete={updateTaskStatus}
              />
            </div>
          )}

          {activeView === "tasklist" && (
            <Employeetask
              pendingTasks={tasks.pending}
              completedTasks={tasks.completed}
              onComplete={updateTaskStatus}
            />
          )}
          {activeView === "meetings" && <Meetings />}
          {activeView === "reports" && <div>Reports Section</div>}
        </main>
      </div>
    </div>
  );
};

export default Employee;
