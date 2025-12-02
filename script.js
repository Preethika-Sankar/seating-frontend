function loadStudents() {
  // Call your backend API hosted on Render
  fetch("https://seating-system-lm0y.onrender.com/plan/1")
    .then(response => response.json())   // convert backend response to JSON
    .then(data => {
      const studentList = document.getElementById("studentList");
      studentList.innerHTML = ""; // clear old list

      // Loop through the data and add each student to the list
      data.forEach(student => {
        const li = document.createElement("li");
        li.textContent = JSON.stringify(student); // show student info
        studentList.appendChild(li);
      });
    })
    .catch(error => {
      console.error("Error fetching students:", error);
      document.getElementById("studentList").innerHTML =
        "<li>Failed to load students.</li>";
    });
}