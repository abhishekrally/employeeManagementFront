import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [taskList, setTaskList] = useState([]); // Store tasks from the backend
  const [error, setError] = useState(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("https://employeemanagement-ccan.onrender.com/api/users/fetchAllTasks");
      if (!response.ok) throw new Error("Failed to fetch tasks.");

      const data = await response.json();
      console.log("Fetched Tasks:", data); // Debugging

      setTaskList(data); // Set the entire data array (users with tasks)
    } catch (err) {
      setError("Error fetching tasks. Please try again.");
      console.error("Fetch Tasks Error:", err);
    }
  };
  // Run fetchTasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (userID, taskID) => {
    try {
      const response = await fetch(`https://employeemanagement-ccan.onrender.com/api/users/deleteTask/${userID}/${taskID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task.");
      }

      // Update UI after successful deletion
      setTaskList(prevList =>
        prevList.map(user =>
          user.ID === userID
            ? { ...user, tasks: user.tasks.filter(task => task._id !== taskID) }
            : user
        )
      );
    } catch (error) {
      console.error("Delete Task Error:", error);
    }
  };
  // Handle form changes
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // Submit the task to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, date, ID, category, status, priority } = task;

    if (!title || !description || !date || !ID || !category || !status || !priority) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("https://employeemanagement-ccan.onrender.com/api/users/addTaskToUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, ID, category, status, priority }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task.");
      }

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

      fetchTasks(); // Refresh the task list
    } catch (error) {
      setMessage(error.message);
    }
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove authentication token
    localStorage.removeItem('role'); // Remove role from local storage
    navigate('/'); // Redirect to login page
  };
  const handleCreateMember = () => {
    navigate('/admin/createmember'); // Match the correct route
  };
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center px-4 py-8">
      <div className="flex justify-between w-full max-w-2xl mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Log Out
        </button>
        <button
          onClick={handleCreateMember}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create Member
        </button>
      </div>
      {/* Task Creation Form */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white max-w-lg w-full mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Task Title */}
          <div>
            <label className="block text-gray-300">Title:</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-gray-300">Description:</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            ></textarea>
          </div>

          {/* Task Due Date */}
          <div>
            <label className="block text-gray-300">Due Date:</label>
            <input
              type="date"
              name="date"
              value={task.date}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          {/* User ID */}
          <div>
            <label className="block text-gray-300">User ID:</label>
            <input
              type="text"
              name="ID"
              value={task.ID}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-300">Category:</label>
            <select
              name="category"
              value={task.category}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            >
              <option value="">Select Category</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-gray-300">Status:</label>
            <select
              name="status"
              value={task.status}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label className="block text-gray-300">Priority:</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create Task
          </button>
        </form>
        {message && <p className="mt-4 text-center text-yellow-500">{message}</p>}
      </div>

      {/* Task List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Task List</h2>

        {/* Check if there are any users with tasks */}
        {taskList.length === 0 || taskList.every(user => user.tasks.length === 0) ? (
          <p className="text-center text-gray-400">No tasks available</p>
        ) : (
          <ul className="space-y-4">
            {taskList.map((user) =>
              user.tasks.length > 0 && ( // Only show users who have tasks
                <div key={user.ID} className="mb-6">
                  <h3 className="text-lg font-bold text-blue-400">
                    User ID: {user.ID} - {user.name}
                  </h3>
                  <ul>
                    {user.tasks.map((task) => (
                      <li key={task._id} className="p-4 rounded-lg bg-gray-700 flex justify-between items-center">
                        {/* Task Details */}
                        <div>
                          <h4 className="font-bold">{task.title}</h4>
                          <p>Description: {task.description}</p>
                          <p>Category: {task.category}</p>
                          <p>Priority: {task.priority}</p>
                          <p>Due Date: {task.date}</p>
                        </div>

                        {/* Status & Delete Button */}
                        <div className="flex items-center space-x-4">
                          {/* Status - Oval Shape */}
                          <span className="px-2 py-1 text-white text-sm font-semibold rounded-full bg-yellow-500">
                            {task.status}
                          </span>

                          {/* Delete Button - Just "X", No Border */}
                          <button
                            onClick={() => handleDeleteTask(user.ID, task._id)}
                            className="text-red-600 text-xl bg-transparent hover:text-red-500 focus:outline-none"
                          >
                            ✖
                          </button>

                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </ul>

        )}
      </div>
    </div>
  );
};


export default Admindashboard;