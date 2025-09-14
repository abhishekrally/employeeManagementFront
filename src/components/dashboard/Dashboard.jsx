import React, { useState, useEffect } from "react";
import { FaTrash, FaPen } from "react-icons/fa";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [inputNote, setInputNote] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("myNotes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem("myNotes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (inputNote.trim() === "") return;

    if (editIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = inputNote.trim();
      setNotes(updatedNotes);
      setEditIndex(null);
    } else {
      setNotes([...notes, inputNote.trim()]);
    }
    setInputNote("");
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const handleEditNote = (index) => {
    setInputNote(notes[index]);
    setEditIndex(index);
  };

  const sections = [
    {
      id: "notes",
      title: "📝 My Notes for Today",
      data: notes,
      emptyText: "Create and manage notes",
    },
    {
      id: "tasks",
      title: "✅ My Tasks",
      data: tasks,
      emptyText: "View and manage your tasks.",
    },
    {
      id: "notifications",
      title: "🔔 Notifications",
      data: notifications,
      emptyText: "Feature coming soon!",
    },
    {
      id: "reports",
      title: "📊 Reports",
      data: reports,
      emptyText: "Feature coming soon!",
    },
  ];

  return (
    <div className="w-full h-screen bg-gray-900 p-6 overflow-hidden relative">
      {/* Grid */}
      <div
        className={`grid grid-cols-2 grid-rows-2 gap-6 h-full transition-all duration-300 ${
          activeSection ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {sections.map((section) => {
          const hasData = section.data && section.data.length > 0;

          return (
            <div
              key={section.id}
              className="bg-gray-800 rounded-lg shadow-md p-6 flex flex-col h-full cursor-pointer hover:bg-gray-700 hover:scale-105 transform transition-all duration-300"
              onClick={() => setActiveSection(section.id)}
            >
              {hasData ? (
                <>
                  <h2 className="text-lg font-semibold text-white mb-3 border-b border-gray-600 pb-2 text-center">
                    {section.title}
                  </h2>
                  <div className="flex-1 overflow-y-auto space-y-2 w-full px-2">
                    {section.data.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm text-gray-300 bg-gray-700 p-2 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <div className="text-5xl mb-3">
                    {section.id === "notes" && "📝"}
                    {section.id === "tasks" && "✅"}
                    {section.id === "notifications" && "🔔"}
                    {section.id === "reports" && "📊"}
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    {section.title}
                  </h2>
                  <p className="text-gray-400">{section.emptyText}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Popup Modal */}
      {activeSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl h-[90%] p-6 flex flex-col animate-scaleIn">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <h2 className="text-2xl text-white">
                {sections.find((sec) => sec.id === activeSection)?.title}
              </h2>
              <button
                className="bg-red-600 text-white text-xl px-3 py-1 rounded hover:bg-red-500"
                onClick={() => setActiveSection(null)}
              >
                &times;
              </button>
            </div>

            {/* Notes Content */}
            {activeSection === "notes" ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                  {notes.length === 0 ? (
                    <p className="text-gray-400">No notes yet.</p>
                  ) : (
                    notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-700 p-2 rounded"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-white">{note}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300"
                            onClick={() => handleEditNote(index)}
                          >
                            <FaPen size={14} />
                          </button>
                          <button
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-500"
                            onClick={() => handleDeleteNote(index)}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 bg-gray-700 text-white p-3 rounded focus:outline-none"
                    placeholder="Write a note..."
                    value={inputNote}
                    onChange={(e) => setInputNote(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleAddNote();
                    }}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-500"
                    onClick={handleAddNote}
                  >
                    {editIndex !== null ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
                Feature coming soon!
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
