// DỮ LIỆU MẪU: Hãy thay bằng dữ liệu thật của bạn.
const donors = [
    { name: "Nguyễn Hoàng Phong ", amount: 41000 },
    { name: "Xuân Mai", amount: 15000 },
    { name: "Khánh Huyền", amount: 6000 },
    { name: "Bích Diệp", amount: 6000 },
    { name: "Phương Linh", amount: 10000 },
    { name: "Minh Phương", amount: 5000 },
    { name: "Tiến Dũng", amount: 2000 },
     { name: "Ngọc Anh", amount: 10000 },
     { name: "Ngọc Lan", amount: 10000 },
    { name: "Ngọc", amount: 20000 },
    { name: "Thị Nhung", amount: 20000 },
    { name: "Thành Chức", amount: 3000 },
    { name: "Minh Tùng", amount: 13000 },
    { name: "Sao Mai", amount: 2000 }
];

const formatMoney = amount =>
    new Intl.NumberFormat("vi-VN").format(amount) + "đ";

function renderLeaderboard() {
    const sorted = [...donors].sort((a, b) => b.amount - a.amount);

    const medals = ["🥇", "🥈", "🥉"];
    const podiumOrder = [
        sorted[1] || sorted[0],
        sorted[0],
        sorted[2] || sorted[0]
    ];

    document.getElementById("podium").innerHTML =
        podiumOrder.map((donor, index) => {
            const actualRank = index === 0 ? 2 : index === 1 ? 1 : 3;
            const first = actualRank === 1 ? "first" : "";

            return `
                <div class="podium-card ${first}">
                    <div class="medal">${medals[actualRank - 1]}</div>
                    <h3>${escapeHTML(donor.name)}</h3>
                    <p>${formatMoney(donor.amount)}</p>
                    <small>TOP ${actualRank}</small>
                </div>
            `;
        }).join("");

    document.getElementById("donorList").innerHTML =
        sorted.map((donor, index) => `
            <div class="donor-row">
                <span class="rank">#${index + 1}</span>
                <span>${escapeHTML(donor.name)}</span>
                <span class="money">${formatMoney(donor.amount)}</span>
            </div>
        `).join("");

    const total = donors.reduce((sum, donor) => sum + donor.amount, 0);

    document.getElementById("total").textContent = formatMoney(total);
    document.getElementById("donorCount").textContent = donors.length;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function selectAmount(amount) {
    document.getElementById("amount").value = amount;

    document.querySelectorAll(".amounts button").forEach(button => {
        button.classList.toggle(
            "active",
            Number(button.textContent.replace(/\D/g, "")) === amount
        );
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function donateNow() {
    const name = document.getElementById("name").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const message = document.getElementById("message").value.trim();

    if (!name) {
        showToast("Vui lòng nhập tên hiển thị!");
        return;
    }

    if (!Number.isSafeInteger(amount) || amount < 1000) {
        showToast("Vui lòng nhập số tiền từ 1.000đ trở lên!");
        return;
    }

    const bankCode = "TPBank";
    const accountNumber = "11111190207";

    const transferContent = (`DONATE ${name} ${message}`)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 50);

    const paymentURL = new URL("https://qr.sepay.vn/img");

    paymentURL.searchParams.set("bank", bankCode);
    paymentURL.searchParams.set("acc", accountNumber);
    paymentURL.searchParams.set("template", "compact");
    paymentURL.searchParams.set("amount", String(amount));
    paymentURL.searchParams.set("des", transferContent || "DONATE");

    window.location.href = paymentURL.toString();
}
    

function copyAccount() {
    const account = document.getElementById("accountNumber").textContent.trim();

    if (!navigator.clipboard) {
        showToast("Hãy sao chép số tài khoản thủ công!");
        return;
    }

    navigator.clipboard.writeText(account)
        .then(() => showToast("Đã sao chép số tài khoản!"))
        .catch(() => showToast("Không thể sao chép. Hãy thử lại!"));
}

// Thông tin ngân hàng — thay bằng thông tin thật.
document.getElementById("bankName").textContent = "Tp Bank";
document.getElementById("accountName").textContent = "PHAM TIEN DUNG";
document.getElementById("accountNumber").textContent = "11111190207";

renderLeaderboard();
