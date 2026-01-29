const API_BASE = "https://localhost:7163/api";

function getToken() {
    return localStorage.getItem("token");
}

function getHeaders() {
    const token = getToken();

    if (!token) {
        location.href = "login.html";
        throw new Error("No token found");
    }

    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
}

function togglePassword() {
  const pwd = document.getElementById("password");
  const icon = document.getElementById("pwdIcon");

  if (pwd.type === "password") {
    pwd.type = "text";
    icon.classList.remove("bi-eye-fill");
    icon.classList.add("bi-eye-slash-fill");
  } else {
    pwd.type = "password";
    icon.classList.remove("bi-eye-slash-fill");
    icon.classList.add("bi-eye-fill");
  }
}

function showPopup(message) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popupMessage");

    if (!popup || !msg) return;

    msg.innerText = message;
    popup.classList.remove("hidden");
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.classList.add("hidden");
}
