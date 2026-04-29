import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaFire,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

// Moved ABOVE stats so it's defined before use
function calculateStreak(logs) {
  if (logs.length === 0) return 0;

  const dates = [...new Set(logs.map((log) => log.date))].sort();

  // If last study day was more than 1 day ago, streak is broken
  const lastDate = new Date(dates[dates.length - 1]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  const diffFromToday = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  if (diffFromToday > 1) return 0;

  let streak = 1;
  let currentDate = new Date(dates[dates.length - 1]);

  for (let i = dates.length - 2; i >= 0; i--) {
    const prevDate = new Date(dates[i]);
    const diffDays = Math.floor(
      (currentDate - prevDate) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break; // streak broken
    }
  }
  return streak;
}

const Log = () => {
  const [logs, setLogs] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // stores _id of log being edited
  const [editForm, setEditForm] = useState({
    subject: "",
    hours: "",
    notes: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLog, setNewLog] = useState({
    subject: "",
    hours: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [filter, setFilter] = useState("today");

  // Load logs from db
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API}/api/logs`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };
    fetchLogs();
  }, []);

  // Add new log OR save edit — triggered by modal's Save button
  const handleAddLog = async () => {
    if (!newLog.subject || !newLog.hours) {
      alert("Please fill in subject and hours");
      return;
    }

    try {
      const res = await fetch(`${API}/api/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          subject: newLog.subject,
          hours: newLog.hours,
          notes: newLog.notes,
          date: newLog.date,
        }),
      });

      if (!res.ok) throw new Error("Failed to add log");

      const createdLog = await res.json();
      setLogs([createdLog, ...logs]);
      setNewLog({
        subject: "",
        hours: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Error adding log:", err);
    }
  };

  // Save inline edit
  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${API}/api/logs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          subject: editForm.subject,
          hours: editForm.hours,
          notes: editForm.notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to update log");

      const updatedLog = await res.json();
      setLogs(logs.map((t) => (t._id === id ? updatedLog : t)));
      setIsEditing(null);
      setEditForm({ subject: "", hours: "", notes: "" });
    } catch (err) {
      console.error("Error updating log:", err);
    }
  };

  // Delete a log
  const handleDeleteLog = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this study session?",
    );
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API}/api/logs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete log");

      setLogs(logs.filter((log) => log._id !== id));
    } catch (err) {
      console.error("Error deleting log:", err);
    }
  };

  // Open inline edit form for a log
  const handleEditLog = (log) => {
    setIsEditing(log._id);
    setEditForm({
      subject: log.subject,
      hours: log.hours,
      notes: log.notes || "",
    });
  };

  // Calculate statistics
  const stats = {
    totalHours: logs
      .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0)
      .toFixed(1),
    totalSessions: logs.length,
    averageHours:
      logs.length > 0
        ? (
            logs.reduce((sum, log) => sum + parseFloat(log.hours || 0), 0) /
            logs.length
          ).toFixed(1)
        : 0,
    streak: calculateStreak(logs),
    todayHours: logs
      .filter((log) => log.date === new Date().toISOString().split("T")[0])
      .reduce((sum, log) => sum + parseFloat(log.hours || 0), 0)
      .toFixed(1),
  };

  const getFilteredLogs = () => {
    let filtered = logs;
    if (filter === "today") {
      filtered = logs.filter(
        (log) => log.date === new Date().toISOString().split("T")[0],
      );
    } else if (filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = logs.filter((log) => new Date(log.date) >= weekAgo);
    } else if (filter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = logs.filter((log) => new Date(log.date) >= monthAgo);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getMotivationalMessage = () => {
    if (stats.totalHours >= 100)
      return "🌟 Master Level! You're a studying legend!";
    if (stats.totalHours >= 50)
      return "🔥 Incredible dedication! Keep the momentum going!";
    if (stats.totalHours >= 20)
      return "📚 Great progress! You're building amazing habits!";
    if (stats.totalHours >= 10)
      return "🌱 You're on the right track! Every hour counts!";
    if (stats.totalHours > 0)
      return "💪 Every study session brings you closer to your goals!";
    return "✨ Start your first study session today!";
  };

  return (
    <div className="bg-linear-to-br from-amber-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-stone-400 via-stone-400 to-stone-400 text-white py-10 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-6xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-amber-200 hover:text-white transition-colors mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="text-5xl mb-4 animate-bounce-slow">📓</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Daily Study Log
              </h1>
              <p className="text-amber-100 text-lg">
                Track your progress, celebrate your growth
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="group px-6 py-3 border border-white bg-stone-500 backdrop-blur-sm rounded-full font-semibold hover:bg-stone-600 transition-all duration-300 flex items-center gap-2"
            >
              <FaPlus className="group-hover:rotate-90 transition-transform" />
              Log Study Session
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="container mx-auto px-4 max-w-6xl -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { icon: "📚", value: `${stats.totalHours}h`, label: "Total Hours" },
            { icon: "📖", value: stats.totalSessions, label: "Total Sessions" },
            {
              icon: "⭐",
              value: `${stats.averageHours}h`,
              label: "Avg/Session",
            },
            { icon: "🔥", value: stats.streak, label: "Day Streak" },
            { icon: "🎯", value: `${stats.todayHours}h`, label: "Today" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm  relative z-10 rounded-2xl p-4 shadow-lg border border-amber-200/50 text-center group hover:scale-105 transition-all"
            >
              <div className="text-amber-600 text-2xl mb-2 group-hover:animate-bounce">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-stone-800">
                {stat.value}
              </div>
              <div className="text-xs text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="container mx-auto px-4 max-w-6xl mb-8 relative z-10">
        <div className="bg-linear-to-r from-stone-100/70 via-white to-stone-100/70 rounded-2xl p-6 shadow-lg border border-stone-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">💡</div>
            <p className="text-stone-700 font-medium flex-1">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="container mx-auto px-4 max-w-6xl mb-6">
        <div className="flex gap-2 flex-wrap">
          {["all", "today", "week", "month"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full font-medium transition-all capitalize ${
                filter === f
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-white/60 text-stone-600 hover:bg-amber-100"
              }`}
            >
              {f === "all"
                ? "All Time"
                : f === "week"
                  ? "Last 7 Days"
                  : f === "month"
                    ? "Last 30 Days"
                    : "Today"}
            </button>
          ))}
        </div>
      </div>

      {/* Study Logs List */}
      <div className="container mx-auto px-4 max-w-6xl pb-20">
        {getFilteredLogs().length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 text-center border border-amber-200/50">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">
              No study sessions yet
            </h3>
            <p className="text-stone-500 mb-6">
              Start tracking your study journey today!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors"
            >
              Log Your First Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredLogs().map((log) => (
              <div
                key={log._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all group"
              >
                {isEditing === log._id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) =>
                        setEditForm({ ...editForm, subject: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Subject"
                    />
                    <input
                      type="number"
                      step="0.5"
                      value={editForm.hours}
                      onChange={(e) =>
                        setEditForm({ ...editForm, hours: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Hours"
                    />
                    <textarea
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, notes: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      rows="2"
                      placeholder="Notes (optional)"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(log._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">
                          {log.subject.toLowerCase().includes("math")
                            ? "📐"
                            : log.subject.toLowerCase().includes("science")
                              ? "🔬"
                              : log.subject.toLowerCase().includes("aptitude")
                                ? "🧠"
                                  : log.subject.toLowerCase().includes("coding")
                                  ? "💻"
                                     : log.subject.toLowerCase().includes("web dev")
                                  ? "🌐"
                                    : log.subject.toLowerCase().includes("computer")
                                      ? "🤖"
                                      : "📖"}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-stone-800 mb-1">
                            {log.subject}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-2">
                            <span className="flex items-center gap-1">
                              <FaClock className="text-amber-600" /> {log.hours}{" "}
                              hours
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-amber-600" />{" "}
                              {new Date(log.date).toLocaleDateString()}
                            </span>
                          </div>
                          {log.notes && (
                            <p className="text-stone-600 text-sm italic">
                              "{log.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditLog(log)}
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteLog(log._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-stone-800">
                Log Study Session
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newLog.subject}
                  onChange={(e) =>
                    setNewLog({ ...newLog, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Mathematics, Science, History"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Hours Spent *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={newLog.hours}
                  onChange={(e) =>
                    setNewLog({ ...newLog, hours: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., 2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newLog.date}
                  onChange={(e) =>
                    setNewLog({ ...newLog, date: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]} // to restrict adding study sesh from today after
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={newLog.notes}
                  onChange={(e) =>
                    setNewLog({ ...newLog, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows="3"
                  placeholder="What did you learn? Any insights?"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddLog}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Save Session
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-stone-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom badge */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-amber-600 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          <FaFire className="animate-pulse" />
          <span className="text-sm font-medium">Keep studying! 🔥</span>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .group:hover .group-hover\\:animate-bounce {
          animation: bounce 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Log;
