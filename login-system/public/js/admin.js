// Fetch user data from the new /admin/users API and populate the table
fetch('/admin/users')
    .then(response => response.json())
    .then(data => {
        const userList = document.getElementById('user-list');
        
        // Clear the table in case of previous data
        userList.innerHTML = "";

        // Check if there is data
        if (data.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 2; // Span across two columns (username and email)
            cell.textContent = "No users found.";
            row.appendChild(cell);
            userList.appendChild(row);
        } else {
            // Loop through each user and create a table row for each one
            data.forEach(user => {
                const row = document.createElement('tr');

                const usernameCell = document.createElement('td');
                usernameCell.textContent = user.username;

                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;

                row.appendChild(usernameCell);
                row.appendChild(emailCell);

                userList.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });
