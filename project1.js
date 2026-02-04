const form = document.getElementById("main1");
const btn1 = document.getElementById("btn1");

let employees = [];
let editIndex = null;

function validE() {
  const email = document.getElementById("mail").value.trim();
  const emailError = document.getElementById("emailError");
  const regex = /^\S+@\S+\.\S+$/;

  if (!regex.test(email)) {
    emailError.innerText = "Invalid email format";
    return false;
  } else {
    emailError.innerText = "";
    return true;
  }
}

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("add").value.trim();
  const phone = document.querySelector('input[name="phone"]').value.trim();
  const gender = document.querySelector('input[name="gender"]:checked');
  const hobbies = document.querySelectorAll('input[name="hobbies"]:checked');
  const designation = document.getElementById("designation").value;

  if (name.length < 2) {
    alert("Name must be at least 2 characters");
    return false;
  }

  if (!validE()) {
    alert("Enter valid email");
    return false;
  }

  if (address.length < 5) {
    alert("Address must be at least 5 characters");
    return false;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Phone number must be 10 digits");
    return false;
  }

  if (!gender) {
    alert("Please select gender");
    return false;
  }

  if (hobbies.length === 0) {
    alert("Select at least one hobby");
    return false;
  }

  if (designation === "") {
    alert("Select designation");
    return false;
  }

  return true;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const employee = {
    name: document.getElementById("name").value,
    email: document.getElementById("mail").value,
    address: document.getElementById("add").value,
    phone: document.querySelector('input[name="phone"]').value,
    gender: document.querySelector('input[name="gender"]:checked').value,
    hobbies: Array.from(
      document.querySelectorAll('input[name="hobbies"]:checked'),
    ).map((h) => h.value),
    designation: document.getElementById("designation").value,
  };

  if (editIndex === null) {
    employees.push(employee);
  } else {
    employees[editIndex] = employee;
    editIndex = null;
    btn1.innerText = "Submit";
  }

  form.reset();
  renderTable();
});

function renderTable() {
  let table = document.getElementById("empTable");

  if (!table) {
    table = document.createElement("table");
    table.id = "empTable";
    table.border = "1";
    table.style.marginTop = "30px";
    table.style.width = "100%";

    table.innerHTML = `
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Gender</th>
        <th>Hobbies</th>
        <th>Designation</th>
        <th>Actions</th>
      </tr>
    `;

    document.body.appendChild(table);
  }

  table.querySelectorAll("tr:not(:first-child)").forEach((row) => row.remove());

  employees.forEach((emp, index) => {
    const row = table.insertRow();

    row.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.email}</td>
      <td>${emp.address}</td>
      <td>${emp.phone}</td>
      <td>${emp.gender}</td>
      <td>${emp.hobbies.join(", ")}</td>
      <td>${emp.designation}</td>
      <td>
        <button onclick="editEmployee(${index})">Edit</button>
        <button onclick="deleteEmployee(${index})">Delete</button>
      </td>
    `;
  });
}

function editEmployee(index) {
  const emp = employees[index];

  document.getElementById("name").value = emp.name;
  document.getElementById("mail").value = emp.email;
  document.getElementById("add").value = emp.address;
  document.querySelector('input[name="phone"]').value = emp.phone;
  document.getElementById("designation").value = emp.designation;

  document.querySelectorAll('input[name="gender"]').forEach((r) => {
    r.checked = r.value === emp.gender;
  });

  document.querySelectorAll('input[name="hobbies"]').forEach((c) => {
    c.checked = emp.hobbies.includes(c.value);
  });

  editIndex = index;
  btn1.innerText = "Update";
}

function deleteEmployee(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    employees.splice(index, 1);
    renderTable();
  }
}
