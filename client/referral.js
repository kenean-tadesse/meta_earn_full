// =========================================
// META_EARN Referral Center
// referral.js
// =========================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let referrals = [];
let filteredReferrals = [];
let currentPage = 1;
const rowsPerPage = 10;

// =========================================
// API
// =========================================

async function api(url) {

    const res = await fetch("http://localhost:5000" + url, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
}

// =========================================
// LOADER
// =========================================

function showLoader() {

    document.getElementById("loader").style.display = "flex";

}

function hideLoader() {

    document.getElementById("loader").style.display = "none";

}

// =========================================
// TOAST
// =========================================

function toast(message) {

    const t = document.getElementById("toast");

    t.innerHTML = message;

    t.style.display = "block";

    setTimeout(() => {

        t.style.display = "none";

    }, 25000);

}

// =========================================
// LOAD REFERRAL LINK
// =========================================

async function loadReferralLink() {

    const data = await api("/api/referral/my-link");

    console.log("Referral API:", data);

    if (!data.success) {
        toast("Failed to load referral link.");
        return;
    }

    document.getElementById("referralLink").value = data.link;

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(
        document.getElementById("qrcode"),
        {
            text: data.link,
            width: 180,
            height: 180
        }
    );
}

// =========================================
// LOAD STATS
// =========================================

async function loadStats() {

    const data = await api("/api/referral/stats");

    if (!data.success) return;

    document.getElementById("earnings").innerHTML =
        data.earnings + " ETB";

    document.getElementById("wallet").innerHTML =
        data.wallet + " ETB";

    document.getElementById("direct").innerHTML =
        data.direct;

    document.getElementById("team").innerHTML =
        data.direct;
document.getElementById("commission").innerHTML =
data.commission + " ETB";
}

// =========================================
// LOAD REFERRALS
// =========================================

async function loadReferrals() {

    const data = await api("/api/referral/list");

    if (!data.success) return;

    referrals = data.referrals;

    filteredReferrals = [...referrals];

    renderTable();

}

// =========================================
// RENDER TABLE
// =========================================

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

<td colspan="5">

No referrals found.

</td>

</tr>

`;

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

</tr>

`;

    });

    updatePagination();

}
// =========================================
// PAGINATION
// =========================================

function updatePagination() {

    const totalPages = Math.max(
        1,
        Math.ceil(filteredReferrals.length / rowsPerPage)
    );

    document.getElementById("pageInfo").innerHTML =
        `Page ${currentPage} of ${totalPages}`;

    document.getElementById("prevPage").disabled =
        currentPage === 1;

    document.getElementById("nextPage").disabled =
        currentPage === totalPages;

}

document.getElementById("prevPage").addEventListener("click", () => {

    if (currentPage > 1) {

        currentPage--;

        renderTable();

    }

});

document.getElementById("nextPage").addEventListener("click", () => {

    const totalPages = Math.max(
        1,
        Math.ceil(filteredReferrals.length / rowsPerPage)
    );

    if (currentPage < totalPages) {

        currentPage++;

        renderTable();

    }

});

// =========================================
// SEARCH
// =========================================

document.getElementById("searchInput")
.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase().trim();

    filteredReferrals = referrals.filter(ref => {

        return (

            (ref.fullname || "").toLowerCase().includes(keyword) ||

            (ref.username || "").toLowerCase().includes(keyword) ||

            (ref.status || "").toLowerCase().includes(keyword)

        );

    });

    currentPage = 1;

    renderTable();

});

// =========================================
// COPY REFERRAL LINK
// =========================================

function copyReferral() {

    const link =
        document.getElementById("referralLink").value;

    navigator.clipboard.writeText(link);

    toast("Referral link copied successfully.");

}

// =========================================
// SHARE
// =========================================

function shareWhatsApp() {

    const link =
        document.getElementById("referralLink").value;

    window.open(

        "https://wa.me/?text=" +
        encodeURIComponent(
            "Join META_EARN using my referral link:\n" + link
        )

    );

}

function shareTelegram() {

    const link =
        document.getElementById("referralLink").value;

    window.open(

        "https://t.me/share/url?url=" +
        encodeURIComponent(link)

    );

}

function shareFacebook() {

    const link =
        document.getElementById("referralLink").value;

    window.open(

        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(link)

    );

}

function shareTwitter() {

    const link =
        document.getElementById("referralLink").value;

    window.open(

        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(
            "Join META_EARN using my referral link: " + link
        )

    );

}

// =========================================
// BACK BUTTON
// =========================================

function goBack() {

    if (history.length > 1) {

        history.back();

    } else {

        location.href = "dashboard.html";

    }

}

// =========================================
// AUTO REFRESH
// =========================================

setInterval(async () => {

await loadStats();

await loadReferrals();

},60000);

// =========================================
// INITIALIZE PAGE
// =========================================

async function init() {

    try {

        showLoader();

        await loadReferralLink();

        await loadStats();

        await loadReferrals();

    } catch (err) {

        console.error(err);

        toast("Failed to load referral data.");

    } finally {

        hideLoader();

    }

}

init();