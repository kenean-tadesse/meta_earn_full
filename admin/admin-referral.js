// ==========================================
// META_EARN ADMIN REFERRAL DASHBOARD
// admin-referral.js
// ==========================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "admin-login.html";
}

let referrals = [];
let filteredReferrals = [];

let currentPage = 1;
const rowsPerPage = 10;

// ==========================================
// API
// ==========================================

const API = "http://localhost:5000";

async function api(url, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const res = await fetch(API + url, options);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
}

// ==========================================
// LOADER
// ==========================================

function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// ==========================================
// TOAST
// ==========================================

function toast(message) {

    const t = document.getElementById("toast");

    t.innerHTML = message;

    t.style.display = "block";

    setTimeout(() => {

        t.style.display = "none";

    }, 2500);

}

// ==========================================
// LOAD STATS
// ==========================================

async function loadStats() {

    const data = await api("/api/admin/referrals/stats");

    if (!data.success) return;

    document.getElementById("totalReferrals").innerHTML =
        data.total;

    document.getElementById("approvedCount").innerHTML =
        data.approved;

    document.getElementById("pendingCount").innerHTML =
        data.pending;

    document.getElementById("rejectedCount").innerHTML =
        data.rejected;

    document.getElementById("totalCommission").innerHTML =
        data.commission + " ETB";

}

// ==========================================
// LOAD REFERRALS
// ==========================================

async function loadReferrals() {

    const data = await api("/api/admin/referrals");

    if (!data.success) return;

    referrals = data.referrals;

    filteredReferrals = [...referrals];

    renderTable();

}

// ==========================================
// TABLE
// ==========================================

function renderTable() {

    const tbody =
        document.getElementById("referralTable");

    tbody.innerHTML = "";

    const start =
        (currentPage - 1) * rowsPerPage;

    const end =
        start + rowsPerPage;

    const rows =
        filteredReferrals.slice(start, end);

    if (rows.length === 0) {

        tbody.innerHTML = `
<tr>
<td colspan="6" style="text-align:center">
No referrals found.
</td>
</tr>`;

        return;

    }

    rows.forEach(ref => {

        tbody.innerHTML += `

<tr>

<td>${ref.fullname}</td>

<td>${ref.username}</td>

<td>

<span class="status ${ref.status.toLowerCase()}">

${ref.status}

</span>

</td>

<td>${ref.commission} ETB</td>

<td>${new Date(ref.created_at).toLocaleDateString()}</td>

<td>

<button
class="action-btn approve-btn"
onclick="approveReferral(${ref.id})">

Approve

</button>

<button
class="action-btn reject-btn"
onclick="rejectReferral(${ref.id})">

Reject

</button>

<button
class="action-btn delete-btn"
onclick="deleteReferral(${ref.id})">

Delete

</button>

</td>

</tr>

`;

    });

    updatePagination();

}

// ==========================================
// PAGINATION
// ==========================================

function updatePagination() {

    const totalPages =
        Math.max(
            1,
            Math.ceil(filteredReferrals.length / rowsPerPage)
        );

    document.getElementById("pageInfo").innerHTML =
        `Page ${currentPage} of ${totalPages}`;

}

document.getElementById("prevPage").onclick = () => {

    if (currentPage > 1) {

        currentPage--;

        renderTable();

    }

};

document.getElementById("nextPage").onclick = () => {

    const totalPages =
        Math.max(
            1,
            Math.ceil(filteredReferrals.length / rowsPerPage)
        );

    if (currentPage < totalPages) {

        currentPage++;

        renderTable();

    }

};

// ==========================================
// SEARCH
// ==========================================

document.getElementById("searchInput")
.addEventListener("keyup", function () {

    const keyword =
        this.value.toLowerCase();

    filteredReferrals =
        referrals.filter(ref =>

            ref.fullname.toLowerCase().includes(keyword) ||

            ref.username.toLowerCase().includes(keyword)

        );

    currentPage = 1;

    renderTable();

});

// ==========================================
// FILTER
// ==========================================

document.getElementById("statusFilter")
.addEventListener("change", function () {

    const status = this.value;

    if (status === "") {

        filteredReferrals = [...referrals];

    } else {

        filteredReferrals =
            referrals.filter(

                r => r.status === status

            );

    }

    currentPage = 1;

    renderTable();

});

// ==========================================
// APPROVE
// ==========================================

async function approveReferral(id) {

    const data =
        await api(
            "/api/admin/referrals/" + id + "/approve",
            "PUT"
        );

    toast(data.message);

    loadStats();

    loadReferrals();

}

// ==========================================
// REJECT
// ==========================================

async function rejectReferral(id) {

    const data =
        await api(
            "/api/admin/referrals/" + id + "/reject",
            "PUT"
        );

    toast(data.message);

    loadStats();

    loadReferrals();

}

// ==========================================
// DELETE
// ==========================================

async function deleteReferral(id) {

    if (!confirm("Delete this referral?"))
        return;

    const data =
        await api(
            "/api/admin/referrals/" + id,
            "DELETE"
        );

    toast(data.message);

    loadStats();

    loadReferrals();

}

// ==========================================
// BACK
// ==========================================

function goBack() {

    location.href =
        "admin-dashboard.html";

}

// ==========================================
// AUTO REFRESH
// ==========================================

setInterval(() => {

    loadStats();

    loadReferrals();

}, 60000);

// ==========================================
// INIT
// ==========================================

async function init() {

    try {

        showLoader();

        await loadStats();

        await loadReferrals();

    } catch (err) {

        console.log(err);

        toast("Failed to load referrals.");

    } finally {

        hideLoader();

    }

}

init();