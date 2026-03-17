import { useState } from "react";
import API from "./api.js";
import Dashboard from "./components/DashBoard.jsx";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async () => {
    try {
      await API.post("/auth/login", { email, password });
      setLoggedIn(true);
    } catch (err) {
      alert("Login failed");
    }
  };

  if (!loggedIn) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f5f5",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            width: "300px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>Login 🔐</h2>

          <p style={{ fontSize: "12px", color: "gray", marginBottom: "20px" }}>
            Test: test@gmail.com / 123456
          </p>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "10px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}

export default App;
