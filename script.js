//even listeners for buttons
document.getElementById("addRow").addEventListener("click", addRow);
document.getElementById("calculate").addEventListener("click", calculateGPA);
document.getElementById("reset").addEventListener("click", resetTable);
document
  .getElementById("selectAll")
  .addEventListener("change", toggleSelectAll);

//function to add a new row
function addRow() {
  const tableBody = document.getElementById("tableBody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="checkbox" class="course-select" checked /></td>
    <td><input type="text" class="course-name" placeholder="Course Name" /></td>
    <td>
      <select class="grade">
        <option value="" disabled selected>--</option>
        <option value="4">A+</option>
        <option value="4">A</option>
        <option value="3.7">A−</option>
        <option value="3.3">B+</option>
        <option value="3">B</option>
        <option value="2.7">B−</option>
        <option value="2.3">C+</option>
        <option value="2">C</option>
        <option value="1.7">C−</option>
        <option value="1.3">D+</option>
        <option value="1">D</option>
        <option value="0.7">D−</option>
        <option value="0">F</option>
      </select>
    </td>
    <td><input type="number" class="credits" min="0" step="0.5" /></td>
    <td><button class="deleteRow">X</button></td>
  `;

  // Delete row and update the state of the header checkbox
  row.querySelector(".deleteRow").addEventListener("click", () => {
    row.remove();
    updateSelectAllState();

    if (document.querySelectorAll("#tableBody tr").length === 0) {
      document.getElementById("selectAll").checked = false;
    }
  });

  row
    .querySelector(".course-select")
    .addEventListener("change", updateSelectAllState);

  tableBody.appendChild(row);
  updateSelectAllState();
}
//function to toggle the selection of all course checboxes
function toggleSelectAll() {
  const selectAll = document.getElementById("selectAll");
  const checkboxes = document.querySelectorAll(".course-select");
  checkboxes.forEach((checkbox) => (checkbox.checked = selectAll.checked));
}
//function to update the state of the select all checkbox based on the individual checkbox state
function updateSelectAllState() {
  const checkboxes = document.querySelectorAll(".course-select");
  const selectAll = document.getElementById("selectAll");
  selectAll.checked = Array.from(checkboxes).every(
    (checkbox) => checkbox.checked
  );
}
//function to calculate the GPA
function calculateGPA() {
  const rows = document.querySelectorAll("#tableBody tr");
  let totalPoints = 0;
  let totalCredits = 0;
  let isValid = true;
  let hasSelected = false;

  rows.forEach((row) => {
    const isSelected = row.querySelector(".course-select").checked;
    const grade = row.querySelector(".grade").value;
    const credits = row.querySelector(".credits").value;

    if (isSelected) {
      hasSelected = true;

      if (!grade || credits === "") {
        isValid = false;
        return;
      }

      totalPoints += parseFloat(grade) * parseFloat(credits);
      totalCredits += parseFloat(credits);
    }
  });

  if (!hasSelected) {
    showWarning("Please select at least one row to calculate GPA.");
    return;
  }

  if (!isValid) {
    showWarning("Please fill in all grades and credits for selected courses!");
    return;
  }

  const gpa = totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
  document.getElementById("gpaValue").textContent = gpa;
  hideWarning();
}
//function to display a warning message
function showWarning(message) {
  const warningDiv = document.getElementById("warning");
  warningDiv.textContent = message;
  warningDiv.classList.remove("hidden");
}
//function t0 hide the warning message
function hideWarning() {
  document.getElementById("warning").classList.add("hidden");
}
//function to reset the table
function resetTable() {
  const rows = document.querySelectorAll("#tableBody tr");

  rows.forEach((row) => {
    row.querySelector(".course-select").checked = false;
    row.querySelector(".course-name").value = "";
    row.querySelector(".grade").selectedIndex = 0;
    row.querySelector(".credits").value = "";
  });

  document.getElementById("gpaValue").textContent = "0.00";
  document.getElementById("selectAll").checked = false;
  hideWarning();
}
//add an initial row when page load
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelectorAll("#tableBody tr").length === 0) {
    addRow();
  }
});
