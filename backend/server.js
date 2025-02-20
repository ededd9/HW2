require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  points: { type: Number, required: true },
});
//student model
const Student = mongoose.model("Student", studentSchema);

// Initial Data
const initialStudents = [
  { name: "Steve Smith", id: 211, points: 80 },
  { name: "Jian Wong", id: 122, points: 92 },
  { name: "Chris Peterson", id: 213, points: 91 },
  { name: "Sai Patel", id: 524, points: 94 },
  { name: "Andrew Whitehead", id: 425, points: 99 },
  { name: "Lynn Roberts", id: 626, points: 90 },
  { name: "Robert Sanders", id: 287, points: 75 },
];
//connecting to db
async function connectToDatabase() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");

    //delete all data
    await Student.deleteMany({});
    console.log("Deleted prior data");

    //add testing data
    await Student.insertMany(initialStudents);
    console.log("Testing data added successfully");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}
// Call the async function to connect to the database
connectToDatabase();

//Routes

//GET all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({});
  }
});
//GET a student by ID
app.get("/students/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.id });
    if (!student) {
      return res.status(404).json({});
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({});
  }
});

//CREATE new student
app.post("/students", async (req, res) => {
  try {
    const { name, id, points } = req.body;

    // Validate input
    if (!name || !id || !points) {
      return res.status(400).json({});
    }

    const newStudent = new Student({ name, id, points });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({});
  }
});

//UPDATE student by ID
app.put("/students/:id", async (req, res) => {
  try {
    const { name, points } = req.body;

    // Validate input
    if (!name || !points) {
      return res.status(400).json({});
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { id: req.params.id },
      { name, points },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({});
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({});
  }
});

// 5. DELETE a student by ID
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedStudent) {
      return res.status(404).json();
    }
    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
  }
});

//Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

//Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
