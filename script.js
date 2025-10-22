// SPLASH SCREEN
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    const loginPage = document.getElementById("login-page");
    if (loginPage) loginPage.classList.remove("hidden");
  }, 2500);
});

// REGISTER
function register() {
  const name = document.getElementById("reg-name").value.trim();
  if (!name) return alert("Isi nama pengguna dulu!");
  localStorage.setItem("tyeta_user", name);
  alert("Akun berhasil dibuat!");
  window.location.href = "index.html";
}

// LOGIN
function login() {
  const name = document.getElementById("login-name").value.trim();
  const saved = localStorage.getItem("tyeta_user");
  if (name === saved) {
    localStorage.setItem("tyeta_logged", name);
    window.location.href = "dashboard.html";
  } else {
    alert("Nama tidak ditemukan. Silakan daftar dulu!");
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("tyeta_logged");
  window.location.href = "index.html";
}

// DASHBOARD
let balance = 1000000;
let currentAction = null;

if (window.location.pathname.includes("dashboard.html")) {
  const name = localStorage.getItem("tyeta_logged");
  if (!name) window.location.href = "index.html";
  document.getElementById("welcome").innerText = `Halo, ${name}!`;
  document.getElementById("balance").innerText = `Rp ${balance.toLocaleString()}`;
}

// POPUP SYSTEM
function openPopup(action) {
  currentAction = action;
  const popup = document.getElementById("popup-container");
  const title = document.getElementById("popup-title");
  const amountInput = document.getElementById("popup-amount");
  const qr = document.getElementById("qr-container");
  const confirmBtn = document.getElementById("confirm-btn");

  qr.classList.add("hidden");
  amountInput.classList.remove("hidden");
  confirmBtn.classList.remove("hidden");

  if (action === "topup") title.innerText = "Isi Saldo";
  else if (action === "transfer") title.innerText = "Transfer Saldo";
  else if (action === "qr") {
    title.innerText = "Kode QR Pembayaran";
    qr.classList.remove("hidden");
    amountInput.classList.add("hidden");
    confirmBtn.classList.add("hidden");

    const user = localStorage.getItem("tyeta_logged") || "User";
    const qrImg = document.getElementById("qr-image");
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TyetaPay-${user}-${Date.now()}`;
  }

  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup-container").classList.add("hidden");
}

function confirmAction() {
  const amount = parseInt(document.getElementById("popup-amount").value);
  if (!amount || amount <= 0) return alert("Masukkan jumlah yang valid!");
  const balanceEl = document.getElementById("balance");
  const transactionsEl = document.getElementById("transactions");

  if (currentAction === "topup") {
    balance += amount;
    transactionsEl.innerHTML = `<li>+ Rp${amount.toLocaleString()} — Isi Saldo</li>` + transactionsEl.innerHTML;
  } else if (currentAction === "transfer") {
    if (balance < amount) return alert("Saldo tidak cukup!");
    balance -= amount;
    transactionsEl.innerHTML = `<li>- Rp${amount.toLocaleString()} — Transfer</li>` + transactionsEl.innerHTML;
  }

  balanceEl.innerText = `Rp ${balance.toLocaleString()}`;
  closePopup();
}
