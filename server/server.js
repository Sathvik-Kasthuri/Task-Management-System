const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

//Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Task Management Api is running",
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on the ${port}`);
});
