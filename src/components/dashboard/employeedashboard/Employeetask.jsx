import React from "react";
import { CheckCircle, ClipboardList, Calendar, FileText } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "No due date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Employeetask = ({ pendingTasks = [], completedTasks = [], onComplete }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pending Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-blue-400" /> Pending Tasks
        </h2>
        {pendingTasks.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center shadow-md">
            <p className="text-gray-400">No pending tasks.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    {task.title}
                  </h4>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300">
                    {task.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{task.description}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Due: {formatDate(task.date)}
                </p>

                <button
                  onClick={() => onComplete(task._id)}
                  className="flex items-center gap-2 mt-3 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                >
                  <CheckCircle className="w-4 h-4" /> Mark as Done
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" /> Completed Tasks
        </h2>
        {completedTasks.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center shadow-md">
            <p className="text-gray-400">No completed tasks.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div key={task._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    {task.title}
                  </h4>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300">
                    {task.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{task.description}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Completed: {formatDate(task.date)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Employeetask;
