const BASE_URL = "https://seating-system-lm0y.onrender.com";

// Load all students
document.getElementById("loadButton").addEventListener("click", function () {
  fetch(`${BASE_URL}/students`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    })
    .then(data => renderStudentsTable(data, "studentTableContainer"))
    .catch(error => {
      document.getElementById("studentTableContainer").innerHTML =
        "<p class='error'>Failed to load students.</p>";
      console.error("Fetch error:", error);
    });
});

// Search by name (with room + seat info)
document.getElementById("searchButton").addEventListener("click", function () {
  const name = document.getElementById("searchName").value.trim();
  if (!name) {
    alert("Please enter a student name.");
    return;
  }

  Promise.all([
    fetch(`${BASE_URL}/students`).then(res => res.json()),
    fetch(`${BASE_URL}/plan/1`).then(res => res.json()),
    fetch(`${BASE_URL}/plan/2`).then(res => res.json())
  ])
    .then(([students, plan1, plan2]) => {
      const student = students.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
      const container = document.getElementById("searchResultContainer");
      container.innerHTML = "";

      if (student) {
        const seatingEntries = [...plan1, ...plan2].filter(p => p.studentId === student.id);

        let html = `
          <table>
            <tr><th>Name</th><td>${student.name}</td></tr>
            <tr><th>Roll No</th><td>${student.rollNo}</td></tr>
            <tr><th>Course</th><td>${student.course}</td></tr>
            <tr><th>Semester</th><td>${student.semester}</td></tr>
        `;

        if (seatingEntries.length > 0) {
          seatingEntries.forEach(entry => {
            html += `
              <tr><th>Exam ID</th><td>${entry.examId}</td></tr>
              <tr><th>Room</th><td>${entry.roomNo}</td></tr>
              <tr><th>Seat No</th><td>${entry.seatNo}</td></tr>
            `;
          });
        } else {
          html += `<tr><th>Seating</th><td>No seating assigned</td></tr>`;
        }

        html += `</table>`;
        container.innerHTML = html;
      } else {
        container.innerHTML = "<p>No student found with that name.</p>";
      }
    })
    .catch(error => {
      document.getElementById("searchResultContainer").innerHTML =
        "<p class='error'>Failed to search student.</p>";
      console.error("Fetch error:", error);
    });
});

// Seating plan view by exam ID
document.getElementById("planButton").addEventListener("click", function () {
  const examId = document.getElementById("examId").value;
  if (!examId) {
    alert("Please enter an exam ID.");
    return;
  }

  Promise.all([
    fetch(`${BASE_URL}/plan/${examId}`).then(res => res.json()),
    fetch(`${BASE_URL}/students`).then(res => res.json())
  ])
    .then(([planData, studentData]) => {
      const merged = planData.map(entry => {
        const student = studentData.find(s => s.id === entry.studentId);
        return {
          ...entry,
          name: student?.name || "Unknown",
          rollNo: student?.rollNo || "Unknown",
          course: student?.course || "Unknown",
          semester: student?.semester || "Unknown"
        };
      });
      renderSeatingPlanTable(merged, "planContainer");
    })
    .catch(error => {
      document.getElementById("planContainer").innerHTML =
        "<p class='error'>Failed to load seating plan.</p>";
      console.error("Fetch error:", error);
    });
});

// Render student table
function renderStudentsTable(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (!data || data.length === 0) {
    container.innerHTML = "<p>No data found.</p>";
    return;
  }
  const table = document.createElement("table");
  const header = document.createElement("tr");
  header.innerHTML = `
    <th>Name</th>
    <th>Roll No</th>
    <th>Course</th>
    <th>Semester</th>
  `;
  table.appendChild(header);

  data.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.rollNo}</td>
      <td>${student.course}</td>
      <td>${student.semester}</td>
    `;
    table.appendChild(row);
  });

  container.appendChild(table);
}

// Render seating plan table
function renderSeatingPlanTable(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (!data || data.length === 0) {
    container.innerHTML = "<p>No seating plan found.</p>";
    return;
  }
  const table = document.createElement("table");
  const header = document.createElement("tr");
  header.innerHTML = `
    <th>Name</th>
    <th>Roll No</th>
    <th>Course</th>
    <th>Semester</th>
    <th>Room</th>
    <th>Seat No</th>
  `;
  table.appendChild(header);

  data.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.rollNo}</td>
      <td>${entry.course}</td>
      <td>${entry.semester}</td>
      <td>${entry.roomNo}</td>
      <td>${entry.seatNo}</td>
    `;
    table.appendChild(row);
  });

  container.appendChild(table);
}