TECH STACK: MERN
MongoDB
Express JS
React
Node JS

How to run, make sure to have the following modules installed before anything:
npm install express
THIS IS IMPORTANT: USE THIS VERSION OF MONGOOSE OR CODE WILL NOT CONNECT TO DB
npm install mongoose@8.5.2

npm install body-parser
npm install cors
npm install dotenv
npm install axios

Now to actually start:
move into /frontend directory and type npm start
open another terminal and move into /backend and type node server.js

Go to http://localhost:3001/ and refresh, data should show up

Don't get what you meant by api call names(maybe when i try to fetch data from the api?)

All in App.js
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

Or in server.js, http://localhost:3000/students to see all students
http://localhost:3000/student[id] to see a specific student by id
