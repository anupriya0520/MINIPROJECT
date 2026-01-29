document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // stop form from submitting

    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "protonmail.com"];
    const emailValue = document.getElementById("email").value;

    function isAllowedEmail(email) {
        if (!email) return false;
        const parts = email.split("@");
        if (parts.length !== 2) return false;
        const domain = parts[1].toLowerCase();
        return allowedDomains.includes(domain);
    }

    if (!isAllowedEmail(emailValue)) {
showPopup("Only Gmail, Yahoo, Outlook, Hotmail, iCloud, or ProtonMail emails are allowed.");
        return; // stop registration
    }

    const data = {
        name: document.getElementById("name").value,
        email: emailValue,
        password: document.getElementById("password").value
    };

    const res = await fetch(API_BASE + "/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (res.ok) {
    showPopup("Registration successful");
    setTimeout(() => {
        location.href = "login.html";
    }, 1500);
} else {
    const err = await res.text();
    showPopup("Registration failed: " + err);
}

});
