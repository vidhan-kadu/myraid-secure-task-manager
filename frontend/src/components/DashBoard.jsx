import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const getTasks = async () => {
    try {
      let url = `/tasks?page=${page}`;

      if (status) url += `&status=${status}`;
      if (search) url += `&search=${search}`;

const res = await API.get(url);
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTasks();
  }, [page, search, status]);

  const addTask = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      getTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      getTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: " auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Task Manager 🚀
      </h1>
      <br></br>
      <br></br>
      <button
        onClick={logout}
        style={{
          background: "black",
          height: "40px",
          width: "80px",
          color: "white",
          border: "none",
          padding: "8px 12px",
          cursor: "pointer",
          borderRadius: "5px",
          right: "50px",
          top: "38px",
          position: "absolute",
        }}
      >
        Logout
      </button>

      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          gap: "10px",
          height: "30px",
          width: "100%",
        }}
      >
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ flex: 2, padding: "8px" }}
        />
        <button onClick={addTask} style={{ width: "60px", display: "block" }}>
          Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p style={{ textAlign: "center" }}>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: "0" }}>{task.title}</h3>
              <p style={{ margin: "5px 0", color: "gray" }}>
                {task.description}
              </p>
            </div>

            <button
              onClick={() => deleteTask(task._id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "6px 10px",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>Page {page}</span>

        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default Dashboard;
