import React from "react";
const Tasklist = ({ taskList, handleDeleteTask }) => {
  return (
    <div className="bg-gray-800 mt-3 p-6 rounded-lg shadow-lg text-white max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Task List</h2>

      {taskList.length === 0 ||
      taskList.every((user) => user.tasks.length === 0) ? (
        <p className="text-center text-gray-400">No tasks available</p>
      ) : (
        <ul className="space-y-4">
          {taskList.map(
            (user) =>
              user.tasks.length > 0 && (
                <div key={user.ID} className="mb-6">
                  <h3 className="text-lg font-bold text-blue-400">
                    User ID: {user.ID} - {user.name}
                  </h3>
                  <ul>
                    {user.tasks.map((task) => (
                      <li
                        key={task._id}
                        className="p-4 rounded-lg bg-gray-700 flex justify-between items-center"
                      >
                        <div>
                          <h4 className="font-bold">{task.title}</h4>
                          <p>Description: {task.description}</p>
                          <p>Category: {task.category}</p>
                          <p>Priority: {task.priority}</p>
                          <p>Due Date: {task.date}</p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="px-2 py-1 text-white text-sm font-semibold rounded-full bg-yellow-500">
                            {task.status}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteTask(user.ID, task._id)
                            }
                            className="text-red-600 text-xl hover:text-red-500"
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
  );
};

export default Tasklist;
