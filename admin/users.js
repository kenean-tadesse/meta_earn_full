// =====================================
// METAERN ADMIN USERS
// =====================================

// ================================
// API CONFIGURATION
// ================================

const API = "https://meta-earn-14.onrender.com/api/admin/users";
const ADMIN_API = "https://meta-earn-14.onrender.com/api/admin";

const token = localStorage.getItem("token");

let users = [];


// ================================
// CHECK ADMIN TOKEN
// ================================

if (!token) {

    alert("Admin session expired. Please login again.");

    window.location.href = "login.html";

}


// ================================
// LOAD USERS
// ================================

async function loadUsers() {

    try {

        const response = await fetch(API, {

            method: "GET",

            headers: {

                "Authorization": "Bearer " + token,

                "Content-Type": "application/json"

            }

        });


        // ================================
        // CHECK HTTP RESPONSE
        // ================================

        if (!response.ok) {

            throw new Error(

                `HTTP Error: ${response.status}`

            );

        }


        // ================================
        // READ JSON
        // ================================

        const data = await response.json();


        // ================================
        // CHECK API SUCCESS
        // ================================

        if (!data.success) {

            alert(

                data.message ||

                "Unable to load users"

            );

            return;

        }


        // ================================
        // SAVE USERS
        // ================================

        users = Array.isArray(data.users)

            ? data.users

            : [];


        // ================================
        // DISPLAY USERS
        // ================================

        displayUsers(users);


        // ================================
        // UPDATE DASHBOARD CARDS
        // ================================

        updateCards();

    }

    catch (error) {

        console.error(

            "LOAD USERS ERROR:",

            error

        );


        const table = document.getElementById(

            "userTable"

        );


        if (table) {

            table.innerHTML = `

                <tr>

                    <td

                        colspan="11"

                        class="loading"

                    >

                        ❌ Unable to load users.

                    </td>

                </tr>

            `;

        }

    }

}


// ================================
// DISPLAY USERS
// ================================

function displayUsers(list) {

    const table = document.getElementById(

        "userTable"

    );


    if (!table) {

        console.error(

            "userTable element not found"

        );

        return;

    }


    // ================================
    // CLEAR TABLE
    // ================================

    table.innerHTML = "";


    // ================================
    // NO USERS
    // ================================

    if (!Array.isArray(list) || list.length === 0) {

        table.innerHTML = `

            <tr>

                <td

                    colspan="11"

                    class="loading"

                >

                    No users found.

                </td>

            </tr>

        `;

        return;

    }


    // ================================
    // CREATE USER ROWS
    // ================================

    list.forEach(user => {


        // =================================
        // NORMALIZE TASK STATUS
        // =================================

        const taskStatusValue = String(

            user.task_status || ""

        )

            .trim()

            .toLowerCase();


        // =================================
        // CHECK ACTIVE STATUS
        // =================================

        const taskAccess =

            taskStatusValue === "active";


        // =================================
        // TASK STATUS TEXT
        // =================================

        const taskStatus = taskAccess

            ?

        `

            <span class="taskActive">

                🟢 ACTIVATED

            </span>

        `

            :

        `

            <span class="taskInactive">

                🔴 INACTIVE

            </span>

        `;


        // =================================
        // TASK BUTTON
        // =================================

        const taskButton = taskAccess

            ?

        `

            <button

                type="button"

                class="taskAccessBtn deactivateTaskBtn"

                onclick="toggleTaskAccess(${user.id}, 'inactive')"

                title="Click to deactivate task access"

            >

                ✅ Activated

            </button>

        `

            :

        `

            <button

                type="button"

                class="taskAccessBtn activateTaskBtn"

                onclick="toggleTaskAccess(${user.id}, 'active')"

                title="Click to activate task access"

            >

                🟢 Activate

            </button>

        `;


        // =================================
        // ROLE CLASS
        // =================================

        const roleClass =

            user.role === "admin"

            ? "roleAdmin"

            : "roleUser";


        // =================================
        // SAFE VALUES
        // =================================

        const username =

            user.username || "-";


        const email =

            user.email || "-";

        const phone =

            user.phone || "-";

        const referralCode =

            user.referral_code || "-";


        const balance =

            Number(user.balance || 0)

                .toFixed(2);


        const vipLevel =

            Number(user.vip_level || 0);


        const role =

            user.role || "user";


        const createdDate =

            user.created_at

            ?

            new Date(

                user.created_at

            ).toLocaleDateString()

            :

            "-";


        // =================================
        // ADD ROW
        // =================================

        table.innerHTML += `

            <tr>


                <!-- ID -->

                <td>

                    ${user.id}

                </td>


                <!-- USERNAME -->

                <td>

                    ${username}

                </td>


                <!-- EMAIL -->

                <td>

                    ${email}

                </td>
                
                <!-- PHONE -->

                <td>

                    ${phone}

                </td>


                <!-- BALANCE -->

                <td>

                    ${balance} ETB

                </td>


                <!-- VIP -->

                <td class="vip">

                    VIP ${vipLevel}

                </td>


                <!-- REFERRAL -->

                <td>

                    ${referralCode}

                </td>


                <!-- ROLE -->

                <td class="${roleClass}">

                    ${role}

                </td>


                <!-- TASK ACCESS -->

                <td>

                    <div>

                        ${taskStatus}

                    </div>


                    <div

                        style="margin-top:8px;"

                    >

                        ${taskButton}

                    </div>

                </td>


                <!-- CREATED -->

                <td>

                    ${createdDate}

                </td>


                <!-- ACTIONS -->

                <td>


                    <button

                        type="button"

                        class="actionBtn vipBtn"

                        onclick='openEditor(${JSON.stringify(user).replace(/'/g, "&#39;")})'

                    >

                        Edit

                    </button>


                    <button

                        type="button"

                        class="actionBtn deleteBtn"

                        onclick="deleteUser(${user.id})"

                    >

                        Delete

                    </button>


                </td>


            </tr>

        `;

    });

}


// ================================
// ACTIVATE / DEACTIVATE TASK ACCESS
// ================================

async function toggleTaskAccess(

    id,

    status

) {


    // ================================
    // DETERMINE ACTION
    // ================================

    const action =

        status === "active"

        ? "activate"

        : "deactivate";


    // ================================
    // CONFIRM
    // ================================

    const confirmed = confirm(

        `Are you sure you want to ${action} task access for this user?`

    );


    if (!confirmed) {

        return;

    }


    try {


        // ================================
        // SEND UPDATE TO SERVER
        // ================================

        const response = await fetch(

            `${API}/${id}/task-status`,

            {

                method: "PUT",

                headers: {

                    "Authorization":

                        "Bearer " + token,

                    "Content-Type":

                        "application/json"

                },

                body: JSON.stringify({

                    task_status: status

                })

            }

        );


        // ================================
        // READ SERVER RESPONSE
        // ================================

        const data = await response.json();


        // ================================
        // CHECK RESPONSE
        // ================================

        if (

            !response.ok ||

            !data.success

        ) {

            alert(

                data.message ||

                `Unable to ${action} task access`

            );

            return;

        }


        // ================================
        // UPDATE LOCAL USER DATA
        // ================================

        const userIndex = users.findIndex(

            user =>

                Number(user.id) ===

                Number(id)

        );


        if (userIndex !== -1) {

            users[userIndex].task_status =

                status;

        }


        // ================================
        // SHOW SUCCESS MESSAGE
        // ================================

        alert(

            status === "active"

            ?

            "✅ Task access activated successfully!"

            :

            "🔴 Task access deactivated successfully!"

        );


        // ================================
        // KEEP SEARCH RESULTS
        // ================================

        const searchInput =

            document.getElementById(

                "search"

            );


        const searchText =

            searchInput

            ?

            searchInput.value

                .toLowerCase()

                .trim()

            :

            "";


        // ================================
        // FILTER CURRENT USERS
        // ================================

        const filteredUsers =

            users.filter(user => {


                const username =

                    String(

                        user.username || ""

                    )

                        .toLowerCase();


                const email =

                    String(

                        user.email || ""

                    )

                        .toLowerCase();


                return (

                    username.includes(

                        searchText

                    )

                    ||

                    email.includes(

                        searchText

                    )

                );

            });


        // ================================
        // UPDATE TABLE IMMEDIATELY
        // ================================

        displayUsers(

            filteredUsers

        );


        // ================================
        // UPDATE DASHBOARD CARDS
        // ================================

        updateCards();


        // ================================
        // OPTIONAL SERVER VERIFICATION
        // ================================

        // We do NOT reload immediately here.
        // The local data has already been updated.
        // This prevents the old status from
        // appearing temporarily in the UI.

    }

    catch (error) {


        console.error(

            "TASK ACCESS ERROR:",

            error

        );


        alert(

            "❌ Server error while changing task access."

        );

    }

}


// ================================
// SEARCH USERS
// ================================

function searchUsers() {


    const searchInput =

        document.getElementById(

            "search"

        );


    if (!searchInput) {

        return;

    }


    const text =

        searchInput.value

            .toLowerCase()

            .trim();


    // ================================
    // FILTER
    // ================================

    const filtered =

        users.filter(user => {


            const username =

                String(

                    user.username || ""

                )

                    .toLowerCase();


            const email =

                String(

                    user.email || ""

                )

                    .toLowerCase();


            return (

                username.includes(text)

                ||

                email.includes(text)

            );

        });


    // ================================
    // DISPLAY RESULTS
    // ================================

    displayUsers(filtered);

}


// ================================
// UPDATE DASHBOARD CARDS
// ================================

function updateCards() {


    // ================================
    // TOTAL USERS
    // ================================

    const totalUsers =

        document.getElementById(

            "totalUsers"

        );


    if (totalUsers) {

        totalUsers.textContent =

            users.length;

    }


    // ================================
    // VARIABLES
    // ================================

    let balance = 0;

    let vip = 0;

    let admins = 0;


    // ================================
    // CALCULATE
    // ================================

    users.forEach(user => {


        balance += Number(

            user.balance || 0

        );


        if (

            Number(

                user.vip_level || 0

            ) > 0

        ) {

            vip++;

        }


        if (

            user.role === "admin"

        ) {

            admins++;

        }

    });


    // ================================
    // TOTAL BALANCE
    // ================================

    const totalBalance =

        document.getElementById(

            "totalBalance"

        );


    if (totalBalance) {

        totalBalance.textContent =

            balance.toFixed(2);

    }


    // ================================
    // VIP USERS
    // ================================

    const vipUsers =

        document.getElementById(

            "vipUsers"

        );


    if (vipUsers) {

        vipUsers.textContent =

            vip;

    }


    // ================================
    // ADMIN USERS
    // ================================

    const adminUsers =

        document.getElementById(

            "adminUsers"

        );


    if (adminUsers) {

        adminUsers.textContent =

            admins;

    }

}


// ================================
// EDIT BALANCE
// ================================

async function editBalance(

    id,

    current

) {


    const value = prompt(

        "Enter new balance",

        current

    );


    if (

        value === null

    ) {

        return;

    }


    try {


        const response = await fetch(

            `${ADMIN_API}/${id}/balance`,

            {

                method: "PUT",

                headers: {

                    "Authorization":

                        "Bearer " + token,

                    "Content-Type":

                        "application/json"

                },

                body: JSON.stringify({

                    balance: value

                })

            }

        );


        const data =

            await response.json();


        if (!data.success) {

            alert(

                data.message ||

                "Unable to update balance"

            );

            return;

        }


        alert(

            "✅ Balance updated successfully!"

        );


        await loadUsers();

    }

    catch (error) {

        console.error(

            "BALANCE ERROR:",

            error

        );

        alert(

            "❌ Server error while updating balance."

        );

    }

}


// ================================
// CHANGE VIP
// ================================

async function changeVIP(

    id,

    current

) {


    const vip = prompt(

        "VIP Level",

        current

    );


    if (

        vip === null

    ) {

        return;

    }


    try {


        const response = await fetch(

            `${ADMIN_API}/${id}/vip`,

            {

                method: "PUT",

                headers: {

                    "Authorization":

                        "Bearer " + token,

                    "Content-Type":

                        "application/json"

                },

                body: JSON.stringify({

                    vip_level: vip

                })

            }

        );


        const data =

            await response.json();


        if (!data.success) {

            alert(

                data.message ||

                "Unable to update VIP"

            );

            return;

        }


        alert(

            "✅ VIP level updated successfully!"

        );


        await loadUsers();

    }

    catch (error) {

        console.error(

            "VIP ERROR:",

            error

        );

        alert(

            "❌ Server error while updating VIP."

        );

    }

}


// ================================
// CHANGE ROLE
// ================================

async function changeRole(

    id,

    current

) {


    const role = prompt(

        "Role (admin/user)",

        current

    );


    if (

        role === null

    ) {

        return;

    }


    if (

        role !== "admin" &&

        role !== "user"

    ) {

        alert(

            "Role must be either admin or user."

        );

        return;

    }


    try {


        const response = await fetch(

            `${ADMIN_API}/${id}/role`,

            {

                method: "PUT",

                headers: {

                    "Authorization":

                        "Bearer " + token,

                    "Content-Type":

                        "application/json"

                },

                body: JSON.stringify({

                    role

                })

            }

        );


        const data =

            await response.json();


        if (!data.success) {

            alert(

                data.message ||

                "Unable to update role"

            );

            return;

        }


        alert(

            "✅ User role updated successfully!"

        );


        await loadUsers();

    }

    catch (error) {

        console.error(

            "ROLE ERROR:",

            error

        );

        alert(

            "❌ Server error while updating role."

        );

    }

}


// ================================
// DELETE USER
// ================================

async function deleteUser(

    id

) {


    if (

        !confirm(

            "Delete this user?"

        )

    ) {

        return;

    }


    try {


        const response = await fetch(

            `${ADMIN_API}/${id}`,

            {

                method: "DELETE",

                headers: {

                    "Authorization":

                        "Bearer " + token

                }

            }

        );


        const data =

            await response.json();


        if (!data.success) {

            alert(

                data.message ||

                "Unable to delete user"

            );

            return;

        }


        alert(

            "✅ User deleted successfully!"

        );


        await loadUsers();

    }

    catch (error) {

        console.error(

            "DELETE USER ERROR:",

            error

        );

        alert(

            "❌ Server error while deleting user."

        );

    }

}


// ================================
// START APPLICATION
// ================================

loadUsers();
