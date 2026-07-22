const API = "http://localhost:5000/api/tasks";
const token = localStorage.getItem("adminToken");

if (!token) {
    alert("Please login first.");
    window.location.href = "admin-login.html";
}

async function api(url, options = {}) {

    options.headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Server Error");
    }

    return data;
}
async function loadTasks() {

    try {

        const data = await api(API + "/admin/all");

        const tbody = document.getElementById("taskTable");

        tbody.innerHTML = "";

        if (data.tasks.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7">No Tasks Found</td>
                </tr>
            `;

            return;
        }

        data.tasks.forEach(task => {

            tbody.innerHTML += `

            <tr>

                <td>${task.id}</td>

                <td>${task.title}</td>

                <td>${task.description}</td>

                <td>${task.commission}</td>

                <td>${task.required_vip}</td>

                <td class="${task.status}">
                    ${task.status}
                </td>

                <td>

                    <button
                        class="edit"
                        onclick="openEdit(${task.id},
                        '${task.title}',
                        '${task.description}',
                        ${task.commission},
                        ${task.required_vip},
                        '${task.status}')">

                        Edit

                    </button>

                    <button
                        class="delete"
                        onclick="deleteTask(${task.id})">

                        Delete

                    </button>

                    <button
                        class="toggle"
                        onclick="toggleTask(${task.id})">

                        Toggle

                    </button>

                </td>

            </tr>

            `;

        });

    } catch (err) {

        console.log(err);

        alert(err.message);

    }

}
async function createTask() {

    const title = document.getElementById("title").value.trim();

    const description = document.getElementById("description").value.trim();

    const commission = document.getElementById("commission").value;

    const vip = document.getElementById("vip").value;

    if (!title || !description || !commission || !vip) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const data = await api(API + "/admin/create", {

            method: "POST",

            body: JSON.stringify({

                title,

                description,

                commission,

                required_vip: vip

            })

        });

        document.getElementById("message").innerHTML =
            data.message;

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("commission").value = "";
        document.getElementById("vip").value = "";

        loadTasks();

    } catch (err) {

        alert(err.message);

    }

}
function openEdit(id, title, description, commission, vip, status) {

    document.getElementById("editModal").style.display = "flex";

    document.getElementById("editId").value = id;
    document.getElementById("editTitle").value = title;
    document.getElementById("editDescription").value = description;
    document.getElementById("editCommission").value = commission;
    document.getElementById("editVIP").value = vip;
    document.getElementById("editStatus").value = status;

}

function closeModal() {

    document.getElementById("editModal").style.display = "none";

}
async function updateTask() {

    const id = document.getElementById("editId").value;

    try {

        const data = await api(API + "/admin/update/" + id, {

            method: "PUT",

            body: JSON.stringify({

                title: document.getElementById("editTitle").value,

                description: document.getElementById("editDescription").value,

                commission: document.getElementById("editCommission").value,

                required_vip: document.getElementById("editVIP").value,

                status: document.getElementById("editStatus").value

            })

        });

        alert(data.message);

        closeModal();

        loadTasks();

    } catch (err) {

        alert(err.message);

    }

}
async function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {

        const data = await api(API + "/admin/delete/" + id, {

            method: "DELETE"

        });

        alert(data.message);

        loadTasks();

    } catch (err) {

        alert(err.message);

    }

}
async function toggleTask(id) {

    try {

        const data = await api(API + "/admin/toggle/" + id, {

            method: "PUT"

        });

        alert(data.message);

        loadTasks();

    } catch (err) {

        alert(err.message);

    }

}
loadTasks();