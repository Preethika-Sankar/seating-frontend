document.getElementById("loadButton").addEventListener("click", function () {
  fetch("https://seating-system-lm0y.onrender.com/students")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      const container = document.getElementById("studentTableContainer");
      container.innerHTML = "";

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
    })
    .catch(error => {
      const container = document.getElementById("studentTableContainer");
      container.innerHTML = "<p style='color:red;'>Failed to load students.</p>";
      console.error("Fetch error:", error);
    });
});