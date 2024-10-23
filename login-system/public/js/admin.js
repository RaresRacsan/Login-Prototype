// Fetch user data from the new /admin/users API and populate the table
fetch('/admin/users')
    .then(response => response.json())  // Parse the response data as JSON
    .then(data => {
        const userList = document.getElementById('user-list');
        
        // Clear the table in case of previous data
        userList.innerHTML = "";

        // Check if there is data
        if (data.length === 0) {
            // Create a table row for "No users found" message if no users exist
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

                // Create a cell for the username and populate it
                const usernameCell = document.createElement('td');
                usernameCell.textContent = user.username;

                // Create a cell for the email and populate it
                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;

                // Append the username and email cells to the row
                row.appendChild(usernameCell);
                row.appendChild(emailCell);

                // Append the row to the user list (table body)
                userList.appendChild(row);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);  // Log any error that occurs
    });
