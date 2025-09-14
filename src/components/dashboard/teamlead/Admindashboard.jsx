import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "./Sidebar";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Dashboard from "./Dashboard";
import Meetings from "../Meetings";

const Admindashboard = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    date: "",
    ID: "",
    category: "",
    status: "Pending",
    priority: "Normal",
  });

  const [message, setMessage] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [error, setError] = useState(null);

  // State to track which view is active
  const [activeView, setActiveView] = useState("dashboard");

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://employeemanagement-ccan.onrender.com/api/users/fetchAllTasks"
      );
      if (!response.ok) throw new Error("Failed to fetch tasks.");

      const data = await response.json();
      setTaskList(data);
    } catch (err) {
      setError("Error fetching tasks. Please try again.");
      console.error("Fetch Tasks Error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (userID, taskID) => {
    try {
      const response = await fetch(
        `https://employeemanagement-ccan.onrender.com/api/users/deleteTask/${userID}/${taskID}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete task.");

      setTaskList((prevList) =>
        prevList.map((user) =>
          user.ID === userID
            ? { ...user, tasks: user.tasks.filter((t) => t._id !== taskID) }
            : user
        )
      );
    } catch (error) {
      console.error("Delete Task Error:", error);
    }
  };

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, date, ID, category, status, priority } = task;

    if (!title || !description || !date || !ID || !category) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://employeemanagement-ccan.onrender.com/api/users/addTaskToUser",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            date,
            ID,
            category,
            status,
            priority,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create task.");

      setMessage("Task created successfully!");
      setTask({
        title: "",
        description: "",
        date: "",
        ID: "",
        category: "",
        status: "Pending",
        priority: "Normal",
      });

      fetchTasks();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const navigate = useNavigate();
  const handleCreateMember = () => {
    navigate("/admin/createmember");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar setActiveView={setActiveView} />
        <main className="flex-1 flex flex-col items-center">
          {activeView === "dashboard" && <Dashboard />}
          {activeView === "tasks" && (
            <TaskForm
              task={task}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              message={message}
            />
          )}
          {activeView === "tasklist" && (
            <TaskList taskList={taskList} handleDeleteTask={handleDeleteTask} />
          )}
          {activeView === "meetings" && <Meetings/>}
          {activeView === "reports" && <div>Reports Component</div>}
          {activeView === "members" && <div>members</div>}
        </main>
      </div>
    </div>
  );
};

export default Admindashboard;
