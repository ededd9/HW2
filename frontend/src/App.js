import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
//imports
const App = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    id: "",
    points: "",
  });
  const [editingStudent, setEditingStudent] = useState(null);

  // Fetch all students from the backend, "[]" so it renders the data once instead of multiple times if site is refreshed
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/students");
      setStudents(response.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Add stuudent
  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:3001/students", newStudent);
      setNewStudent({ name: "", id: "", points: "" });
      fetchStudents();
    } catch (e) {
      console.error(e);
    }
  };

  // Update student
  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:3001/students/${editingStudent.id}`,
        editingStudent
      );
      setEditingStudent(null);
      fetchStudents();
    } catch (e) {
      console.error(e);
    }
  };

  //Delete student
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/students/${id}`);
      fetchStudents();
    } catch (e) {
      console.error(e);
    }
  };

  //handle input changes
  const handleChange = (e, isNewStudent = false) => {
    const { name, value } = e.target;
    const updatedValue = name === "points" ? Number(value) : value;
    //updating data of new studen t being added or of the student that is being edited
    if (isNewStudent) {
      setNewStudent((prev) => ({ ...prev, [name]: updatedValue }));
    } else {
      setEditingStudent((prev) => ({ ...prev, [name]: updatedValue }));
    }
  };
  //jsx
  return (
    <div className="App">
      <h1>Student Records</h1>
      <div>
        {/*Add student form*/}
        <h2>Add New Student</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => handleChange(e, true)}
        />
        <input
          type="number"
          name="id"
          placeholder="ID"
          value={newStudent.id}
          onChange={(e) => handleChange(e, true)}
        />
        <input
          type="number"
          name="points"
          placeholder="Points"
          value={newStudent.points}
          onChange={(e) => handleChange(e, true)}
        />
        <button onClick={handleCreate}>Save</button>
      </div>
      {/*Table displaying student info*/}
      <table>
        <tr>
          <th>Name</th>
          <th>ID</th>
          <th>Score</th>
        </tr>
        <tbody>
          {/*map through db to display each student and their id/points*/}
          {students.map((student) => (
            <tr key={student.id}>
              {/*if Edit button is clicked(editingStudent state is T), display edit option - name*/}
              <td>
                {editingStudent && editingStudent.id === student.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editingStudent.name}
                    onChange={handleChange}
                  />
                ) : (
                  student.name
                )}
              </td>
              {/*student idd never changes*/}
              <td>{student.id}</td>
              <td>
                {/*if Edit button is clicked(editingStudent state is T), display edit options - points*/}
                {editingStudent && editingStudent.id === student.id ? (
                  <input
                    type="number"
                    name="points"
                    value={editingStudent.points}
                    onChange={handleChange}
                  />
                ) : (
                  student.points
                )}
              </td>
              <td>
                {/*if Edit button is clicked(editingStudent state is T), display save else vice versa*/}
                {editingStudent && editingStudent.id === student.id ? (
                  <button onClick={handleSave}>Save</button>
                ) : (
                  <button onClick={() => setEditingStudent(student)}>
                    Edit
                  </button>
                )}
                {/*delete student*/}
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
