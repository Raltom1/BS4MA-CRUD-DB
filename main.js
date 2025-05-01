document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Get the input values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const idNumber = document.getElementById('idNumber').value;
  
    // Send the data to the backend (POST request)
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        idNumber
      })
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      alert('User added successfully');
      // Optionally, clear form or reload the user table
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  
  // Function to fetch and display users
  function fetchUsers() {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => {
        const userTable = document.getElementById('userTable');
        userTable.innerHTML = ''; // Clear existing rows
        data.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.idNumber}</td>
            <td>
              <button onclick="deleteUser(${user.id})">Delete</button>
              <button onclick="editUser(${user.id})">Edit</button>
            </td>
          `;
          userTable.appendChild(row);
        });
      })
      .catch(error => console.error('Error fetching users:', error));
  }
  
  // Function to delete a user
  function deleteUser(id) {
    fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      alert('User deleted successfully');
      fetchUsers(); // Reload users
    })
    .catch(error => console.error('Error:', error));
  }
  
  // Load users when the page loads
  fetchUsers();
  
