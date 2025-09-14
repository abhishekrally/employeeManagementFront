import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Meetings.css"; // custom overrides

const Meetings = ({ role, userId }) => {
  const [date, setDate] = useState(new Date());
  const [meetings, setMeetings] = useState({});
  const [newMeeting, setNewMeeting] = useState("");

  const formattedDate = date.toISOString().split("T")[0];
  const todaysMeetings = meetings[formattedDate] || [];

  // ✅ Fetch meetings from backend
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        let url = "";
        let options = {};

        if (role === "admin") {
          url = "https://employeemanagement-ccan.onrender.com/api/meetings/fetchAll";
          options = { method: "GET" };
        } else if (role === "employee") {
          url = "https://employeemanagement-ccan.onrender.com/api/meetings/fetchByUser";
          options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          };
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch meetings");

        // Group meetings by date
        const grouped = {};
        data.forEach((m) => {
          const d = m.date.split("T")[0]; // ISO date -> YYYY-MM-DD
          if (!grouped[d]) grouped[d] = [];
          grouped[d].push({
            id: m._id,
            title: m.title,
            userId: m.userId,
          });
        });

        setMeetings(grouped);
      } catch (error) {
        console.error("❌ Error fetching meetings:", error.message);
      }
    };

    fetchMeetings();
  }, [role, userId]);

  // ✅ Add new meeting
  const handleAddMeeting = async () => {
    if (!newMeeting.trim()) return;

    try {
      const response = await fetch(
        "https://employeemanagement-ccan.onrender.com/api/meetings/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newMeeting.trim(),
            date: formattedDate,
            createdBy: role,
            userId: userId || null,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add meeting");

      setMeetings((prev) => {
        const updated = { ...prev };
        if (!updated[formattedDate]) updated[formattedDate] = [];
        updated[formattedDate].push({
          id: data._id, // assume backend returns created meeting
          title: newMeeting.trim(),
          userId: userId || null,
        });
        return updated;
      });

      setNewMeeting("");
    } catch (error) {
      console.error("❌ Error adding meeting:", error.message);
    }
  };

  // ✅ Delete meeting
  const handleDeleteMeeting = async (meetingId, index) => {
    try {
      const response = await fetch(
        `https://employeemanagement-ccan.onrender.com/api/meetings/delete/${meetingId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete meeting");

      setMeetings((prev) => {
        const updated = { ...prev };
        updated[formattedDate] = updated[formattedDate].filter((_, i) => i !== index);
        return updated;
      });
    } catch (error) {
      console.error("❌ Error deleting meeting:", error.message);
    }
  };

  // ✅ Highlight meeting dates
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toISOString().split("T")[0];
      if (meetings[dateStr]) {
        return "has-meeting";
      }
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h2 className="text-4xl mb-8">
        {role === "admin" ? "All Meetings Calendar" : "My Meetings Calendar"}
      </h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-3xl">
        <Calendar
          onChange={setDate}
          value={date}
          tileClassName={tileClassName}
          className="react-calendar dark-calendar mx-auto"
        />
        <div className="mt-6">
          <h3 className="text-2xl mb-4">Meetings for {formattedDate}:</h3>
          {todaysMeetings.length > 0 ? (
            <ul className="space-y-2">
              {todaysMeetings.map((meeting, index) => (
                <li
                  key={meeting.id || index}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded"
                >
                  <span>{meeting.title}</span>
                  <button
                    onClick={() => handleDeleteMeeting(meeting.id, index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No meetings scheduled for this day.</p>
          )}
        </div>
        <div className="flex space-x-4 mt-4">
          <input
            type="text"
            value={newMeeting}
            onChange={(e) => setNewMeeting(e.target.value)}
            placeholder="Add new meeting..."
            className="flex-1 p-3 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleAddMeeting}
            className="bg-blue-500 px-6 py-3 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Meetings;
