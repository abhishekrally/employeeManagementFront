import React from "react";

const TaskForm = ({ task, handleChange, handleSubmit, message }) => {
  return (
    <div className="bg-gray-800 p-3 mt-3 rounded-lg shadow-lg text-white max-w-md w-full mb-3">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Task</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300">Title:</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Description:</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm"
            rows="3"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Due Date:</label>
          <input
            type="date"
            name="date"
            value={task.date}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">User ID:</label>
          <input
            type="text"
            name="ID"
            value={task.ID}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Category:</label>
          <select
            name="category"
            value={task.category}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm"
            required
          >
            <option value="">Select Category</option>
            <option value="Development">Development</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300">Status:</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">overdue</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300">Priority:</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white text-sm"
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
        >
          Create Task
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-yellow-500 text-sm">{message}</p>
      )}
    </div>
  );
};

export default TaskForm;
