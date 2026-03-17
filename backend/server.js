const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:[
      "http://localhost:5173",
      "https://myraid-backend-o7sl.onrender.com"
    ],
    credentials: true,
  }),
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/authroutes");
app.use("/api/auth", authRoutes);

const taskRoutes = require("./routes/taskroutes");
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
