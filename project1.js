const form = document.getElementById("main1");
const btn1 = document.getElementById("btn1");

let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editIndex = null;

function saveToLocalStorage() {
  localStorage.setItem("employees", JSON.stringify(employees));
}

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

function validName() {
  const aname = document.getElementById("name").value.trim();
  const nameError = document.getElementById("nameError");

  const regex = /^[A-Za-z ]{2,}$/;

  if (!regex.test(aname)) {
    nameError.innerText = "Enter atleast 2 characters ";
    return false;
  } else {
    nameError.innerText = "";
    return true;
  }
}

function validA() {
  const address = document.getElementById("add1").value.trim();
  const addressError = document.getElementById("addressError");

  const regex = /^[a-zA-Z0-9\s,.-/#]{5,}$/;

  if (!regex.test(address)) {
    addressError.innerText = "Enter a valid address";
    return false;
  } else {
    addressError.innerText = "";
    return true;
  }
}

function validP() {
  const phone = document.querySelector('input[name="phone"]').value.trim();
  const phoneError = document.getElementById("phoneError");

  if (!/^[0-9]{10}$/.test(phone)) {
    if (phoneError) {
      phoneError.innerText = "Enter a valid 10-digit phone number";
    }
    return false;
  } else {
    if (phoneError) {
      phoneError.innerText = "";
    }
    return true;
  }
}

 function validateForm() {
  const gender = document.querySelector('input[name="gender"]:checked');
  const hobbies = document.querySelectorAll('input[name="hobbies"]:checked');
  const designation = document.getElementById("designation").value;

  if (!validName()) {
    document.getElementById("hide0").style.display = "initial";
    return false;
  } else {
    document.getElementById("hide0").style.display = "none";
  }

  if (!validE()) {
    
    document.getElementById("hide1").style.display = "initial";
    return false;   
  } else {
    document.getElementById("hide1").style.display = "none";
  }
  
  if (!validA()) {
    document.getElementById("hide2").style.display = "initial";
    return false;
  } else {
    document.getElementById("hide2").style.display = "none";
  }

  if (!validP()) {
    document.getElementById("hide3").style.display = "initial";
    return false;
  } else {
    document.getElementById("hide3").style.display = "none";
  }

  if (!gender) {
    document.getElementById("hide4").style.display = "initial";
    return false;
  } else {
    document.getElementById("hide4").style.display = "none";
  }

  if (hobbies.length === 0) {
    document.getElementById("hide5").style.display = "initial";
    return false;
  } else {
    document.getElementById("hide5").style.display = "none";
  }

  if (designation === "") {
    document.getElementById("hide6").style.display = "initial";
    return false;
  } else {
    document.getElementById("hide6").style.display = "none";
  }

  return true;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const employee = {
    name: document.getElementById("name").value,
    email: document.getElementById("mail").value,
    address: document.getElementById("add1").value,
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

  saveToLocalStorage();
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
  document.getElementById("add1").value = emp.address;
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
    saveToLocalStorage();
    renderTable();
  }
}

renderTable();
