import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sort, setSort] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 5;

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks", {
        params: {
          search,
          status: statusFilter,
          priority: priorityFilter,
          sort,
        },
      });

      setTasks(response.data.tasks);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };
  //All tasks
  const fetchAllTasks = async () => {
    try {
      const response = await api.get("/tasks");

      setAllTasks(response.data.tasks);
    } catch (error) {
      console.error("Failed to fetch all tasks:", error);
    }
  };

  const handleTaskChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/tasks", taskData);

      setTasks([response.data.task, ...tasks]);

      setTaskData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleEditChange = (e) => {
    setEditingTask({
      ...editingTask,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/tasks/${editingTask._id}`, editingTask);

      setTasks(
        tasks.map((task) =>
          task._id === editingTask._id ? response.data.task : task,
        ),
      );

      setEditingTask(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete task");
    }
  };

  const totalTasks = allTasks.length;

  const completedTasks = allTasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pendingTasks = allTasks.filter(
    (task) => task.status === "pending",
  ).length;

  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  //pagination
  const indexOfLastTask = currentPage * tasksPerPage;

  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  useEffect(() => {
    (fetchTasks(), fetchAllTasks());
  }, []);

  return (
    <>
      <Navbar darkMode={darkMode} />

      <div className={`dashboard ${darkMode ? "dark-mode" : ""}`}>
        <div className="dashboard-header">
          <div>
            <h1>Task Management Dashboard</h1>
            <p>Welcome, {user?.fullName}</p>
          </div>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Search & Filter */}
        <section className="filter-section">
          <h2>Search & Filter</h2>

          <div className="filter-controls">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Newest First</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            <button
              onClick={() => {
                setCurrentPage(1);
                fetchTasks();
              }}
            >
              Apply Filters
            </button>
          </div>
        </section>

        <section className="analytics-section">
          <h2>Analytics</h2>

          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Total Tasks</h3>
              <p>{totalTasks}</p>
            </div>

            <div className="analytics-card">
              <h3>Completed Tasks</h3>
              <p>{completedTasks}</p>
            </div>

            <div className="analytics-card">
              <h3>Pending Tasks</h3>
              <p>{pendingTasks}</p>
            </div>

            <div className="analytics-card">
              <h3>Completion Percentage</h3>
              <p>{completionPercentage}%</p>
            </div>
          </div>
        </section>

        {/* create task form */}

        <section className="task-form-section">
          <h2>Create Task</h2>

          <form className="task-form" onSubmit={handleCreateTask}>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={taskData.title}
              onChange={handleTaskChange}
              required
            />

            <textarea
              name="description"
              placeholder="Task description"
              value={taskData.description}
              onChange={handleTaskChange}
            />

            <select
              name="status"
              value={taskData.status}
              onChange={handleTaskChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              name="priority"
              value={taskData.priority}
              onChange={handleTaskChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleTaskChange}
            />

            <button type="submit">Create Task</button>
          </form>
        </section>

        {editingTask && (
          <section className="edit-task-section">
            <h2>Edit Task</h2>

            <form className="edit-task-form" onSubmit={handleUpdateTask}>
              <input
                type="text"
                name="title"
                value={editingTask.title}
                onChange={handleEditChange}
                required
              />

              <textarea
                name="description"
                value={editingTask.description || ""}
                onChange={handleEditChange}
              />

              <select
                name="status"
                value={editingTask.status}
                onChange={handleEditChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <select
                name="priority"
                value={editingTask.priority}
                onChange={handleEditChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                name="dueDate"
                value={
                  editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : ""
                }
                onChange={handleEditChange}
              />

              <div className="edit-task-actions">
                <button className="update-btn" type="submit">
                  Update Task
                </button>

                <button
                  className="cancel-btn"
                  type="button"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="status-message">
            <p>Loading tasks...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* No Tasks */}
        {!loading && !error && tasks.length === 0 && (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Create your first task to get started.</p>
          </div>
        )}

        {/* Task List */}
        <div className="tasks-section">
          <h2>Your Tasks</h2>

          <div className="task-grid">
            {!loading &&
              currentTasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <h3>{task.title}</h3>

                  <p>{task.description || "No description provided."}</p>

                  <div className="task-meta">
                    <span className={`status-badge status-${task.status}`}>
                      {task.status}
                    </span>

                    <span
                      className={`priority-badge priority-${task.priority}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
