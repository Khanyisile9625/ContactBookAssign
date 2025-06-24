document.addEventListener('DOMContentLoaded', function () {
    // Only run if elements exist (for multi-page support)
    if (document.getElementById("refresh")) {
        document.getElementById("refresh").addEventListener('click', fetchContacts);
    }
    if (document.getElementById("addContact")) {
        document.getElementById("addContact").addEventListener('click', function () {
            window.location.href = "addContact.html";
        });
    }
    if (typeof fetchContacts === "function") {
        fetchContacts();
    }
});

function fetchContacts() {
    document.getElementById("errorMsg").textContent = "";
    document.getElementById("table").textContent = "Loading contacts...";
    fetch(rootPath + "controller/get-contacts/?apiKey=" + encodeURIComponent(apiKey))
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            displayOutput(data);
        })
        .catch(error => {
            document.getElementById("errorMsg").textContent = "Failed to load contacts.";
            document.getElementById("table").textContent = "";
        });
}

function displayOutput(data) {
    let output = `<table>
        <tr>
            <th>Avatar</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Action</th>
        </tr>`;
    if (Array.isArray(data) && data.length > 0) {
        data.forEach(contact => {
            output += `
                <tr data-contact-id="${contact.id}">
                    <td>
                        <img class="avatar" src="${contact.avatar ? rootPath + 'controller/uploads/' + contact.avatar : 'placeholder.png'}" width="40" alt="Avatar of ${contact.firstname} ${contact.lastname}" onerror="this.onerror=null;this.src='placeholder.png';"/>
                    </td>
                    <td>${contact.firstname}</td>
                    <td>${contact.lastname}</td>
                    <td>
                        <button class="delete-btn" data-delete-id="${contact.id}">Delete</button>
                    </td>
                </tr>`;
        });
    } else {
        output += `<tr><td colspan="4">No contacts found.</td></tr>`;
    }
    output += `</table>`;
    document.getElementById("table").innerHTML = output;
    document.getElementById("contactCount").textContent = `Total contacts: ${Array.isArray(data) ? data.length : 0}`;

    document.querySelectorAll('#table tr[data-contact-id]').forEach(row => {
        row.addEventListener('click', function (e) {
            if (e.target.closest('button.delete-btn')) return;
            const id = this.getAttribute('data-contact-id');
            window.location.href = "editContact.html?id=" + encodeURIComponent(id);
        });
    });

    document.querySelectorAll('#table button.delete-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const id = this.getAttribute('data-delete-id');
            deleteContact(id);
        });
    });
}

function deleteContact(id) {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    document.getElementById("errorMsg").textContent = "Deleting...";
    fetch(rootPath + "controller/delete-contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, apiKey })
    })
    .then(response => {
        if (!response.ok) throw new Error("Delete failed");
        return response.json();
    })
    .then(result => {
        fetchContacts();
        document.getElementById("errorMsg").textContent = "";
    })
    .catch(error => {
        document.getElementById("errorMsg").textContent = "Failed to delete contact.";
    });
}