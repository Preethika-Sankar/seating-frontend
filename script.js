document.getElementById("searchButton").addEventListener("click", function () {
  const name = document.getElementById("searchName").value.trim();
  if (!name) {
    alert("Please enter a student name.");
    return;
  }

  // Fetch students and seating plans together
  Promise.all([
    fetch(`${BASE_URL}/students`).then(res => res.json()),
    fetch(`${BASE_URL}/plan/1`).then(res => res.json()), // Exam 1
    fetch(`${BASE_URL}/plan/2`).then(res => res.json())  // Exam 2
  ])
    .then(([students, plan1, plan2]) => {
      const student = students.find(s => s.name.toLowerCase() === name.toLowerCase());
      const container = document.getElementById("searchResultContainer");
      container.innerHTML = "";

      if (student) {
        // Find seating entries for this student across exams
        const seatingEntries = [...plan1, ...plan2].filter(p => p.studentId === student.id);

        let html = `
          <table border="1">
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