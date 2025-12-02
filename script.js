function loadStudents() {
  fetch("http://localhost:8080/api/students")
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById("studentList");
      list.innerHTML = "";
      data.forEach(student => {
        const li = document.createElement("li");
        li.textContent = student.name;
        list.appendChild(li);
      });
    });
}