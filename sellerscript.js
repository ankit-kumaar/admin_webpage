// Global variable for the API base URL
const apiBaseUrl = 'https://crudcrud.com/api/5b9f5b75b11f45a388d49a7e9766cc54';

// Function to fetch items from the backend
async function fetchItems() {
    try {
        const response = await fetch(`${apiBaseUrl}/items`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
        return []; // Return an empty array to handle the error gracefully
    }
}

// Function to delete an item
async function deleteItem(itemId) {
    try {
        await fetch(`${apiBaseUrl}/items/${itemId}`, { method: 'DELETE' });
        // Reload the item list after successful deletion
        displayItems();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

// Function to calculate and display the total value
function displayTotalValue(items) {
    const totalValueElement = document.getElementById('totalValue');
    const totalValue = items.reduce((acc, item) => acc + parseFloat(item.price), 0);
    totalValueElement.textContent = totalValue.toFixed(2); // Display total value with two decimal places
}

// Function to display items in the table
async function displayItems() {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    const items = await fetchItems();

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><button class="delete-btn" data-id="${item._id}">Delete</button></td>
        `;
        itemList.appendChild(row);
    });

    // Add event listeners to the delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = event.target.getAttribute('data-id');
            deleteItem(itemId);
        });
    });

    // Display the total value
    displayTotalValue(items);
}

// Function to handle form submission
async function addItem(event) {
    event.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);

    try {
        await fetch(`${apiBaseUrl}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: itemName, price: itemPrice })
        });

        // Clear the form fields after successful addition
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';

        // Reload the item list after successful addition
        displayItems();
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

// Add event listener for the form submission
const itemForm = document.getElementById('itemForm');
itemForm.addEventListener('submit', addItem);

// Display the items initially on page load
document.addEventListener('DOMContentLoaded', () => {
    displayItems();
});
