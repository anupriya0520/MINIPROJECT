let allCourses = [];
let allEnrollments = [];
let selectedCourseId = null;

const courses = document.getElementById("courses");
const enrollments = document.getElementById("enrollments");

function convertYoutubeUrl(url) {
    if (!url) return "";
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

/* ================= LOGOUT ================= */
function logout() {
    localStorage.clear();
    location.href = "login.html";
}
window.onload = () => {
    const modal = document.getElementById("paymentModal");
    if (modal) modal.style.display = "none";

    selectedCourse = null;
};

/* ================= SECTIONS ================= */
function showSection(sectionId) {
    document.getElementById("coursesSection").style.display = "none";
    document.getElementById("enrollmentsSection").style.display = "none";

    document.getElementById(sectionId).style.display = "block";

    if (sectionId === "coursesSection") loadCourses();
    if (sectionId === "enrollmentsSection") loadEnrollments();
}

/* ================= COURSES ================= */
async function loadCourses() {
    await loadEnrollments(); // get enrolled courses first

    const res = await fetch(API_BASE + "/Course");
    const coursesData = await res.json();
    const enrolledIds = allEnrollments.map(e => e.courseId);

    coursesData.sort((a, b) => {
        const aEnrolled = enrolledIds.includes(a.courseId);
        const bEnrolled = enrolledIds.includes(b.courseId);
        return bEnrolled - aEnrolled; // enrolled=true comes first
    });

    courses.innerHTML = coursesData.map(c => {
        const enrolled = enrolledIds.includes(c.courseId);

        return `
        <div class="course-card">
            <h4>${c.title}</h4>
            <p>${c.description}</p>

            <iframe
                src="${convertYoutubeUrl(c.videoUrl) || ""}"
                width="100%"
                height="180"
                frameborder="0"
                allowfullscreen
                class="${enrolled ? '' : 'video-disabled'}">
            </iframe>

            ${enrolled
                ? `<button class="btn-enrolled">Enrolled</button>`
                : `<button onclick="openEnrollPopup(${c.courseId}, '${c.title}')">Enroll</button>`
            }
        </div>`;
    }).join("");
}


/* ================= COURSE FILTER ================= */
function filterCourses() {
    const q = document.getElementById("courseSearch").value.toLowerCase();
    const filtered = allCourses.filter(c =>
        c.title.toLowerCase().includes(q)
    );
    renderCourseList(filtered);
}

function resetCourses() {
    document.getElementById("courseSearch").value = "";
    renderCourseList(allCourses);
}

function renderCourseList(data) {
    courses.innerHTML = data.map(c => `
        <div class="course-card">
            <h4>${c.title}</h4>
            <p>${c.description}</p>
        </div>
    `).join("");
}

/* ================= ENROLLMENTS ================= */
async function loadEnrollments() {
    try {
        const res = await fetch(API_BASE + "/Enrollment", {
            headers: getHeaders()
        });

        if (res.status === 401) {
showPopup("Session expired. Please login again.");
            logout();
            return;
        }

        allEnrollments = await res.json();
        renderEnrollments(allEnrollments);

    } catch (err) {
        console.error(err);
    }
}

function renderEnrollments(data) {
    if (!data || data.length === 0) {
        enrollments.innerHTML = "<p>Enrollment doesn’t exist</p>";
        return;
    }

    // Remove any duplicate #enrollments wrapping
    enrollments.innerHTML = data.map(e => `
        <div class="course-card">
            <h4>${e.courseTitle}</h4>
            <p>${e.courseDescription}</p>
            <span>₹${e.coursePrice}</span>
            <p><strong>Enrolled On:</strong> ${new Date(e.enrolledDate).toLocaleDateString()}</p>

            ${e.videoUrl ? `
            <iframe width="100%" height="180"
                src="${convertYoutubeUrl(e.videoUrl)}"
                frameborder="0"
                allowfullscreen></iframe>` : `<p>No video available</p>`}
        </div>
    `).join('');
}





/* ================= ENROLLMENT FILTER ================= */
function filterEnrollments() {
    const text = document.getElementById("enrollmentSearch").value.toLowerCase();
    const filtered = allEnrollments.filter(e =>
        e.courseTitle.toLowerCase().includes(text)
    );
    renderEnrollments(filtered);
}

function resetEnrollments() {
    document.getElementById("enrollmentSearch").value = "";
    renderEnrollments(allEnrollments);
}

/* ================= PAYMENT ================= */
function openEnrollPopup(courseId, title) {
    if (!courseId) return;

    selectedCourse = courseId;
    document.getElementById("paymentCourse").innerText =
        `Confirm enrollment for "${title}"`;

    document.getElementById("paymentModal").style.display = "flex";
}


function closePayment() {
    document.getElementById("paymentModal").style.display = "none";
    selectedCourse = null;

    const payBtn = document.getElementById("payBtn");
    if (payBtn) {
        payBtn.disabled = false;
        payBtn.innerText = "Pay Now";
    }
}


async function confirmPayment() {
    if (!selectedCourse) return;

    // prevent double payment
    if (allEnrollments.some(e => e.courseId === selectedCourse)) {
showPopup("You are already enrolled in this course");
        closePayment();
        return;
    }

    const payBtn = document.getElementById("payBtn");
    payBtn.disabled = true;
    payBtn.innerText = "Processing...";

    try {
        const res = await fetch(API_BASE + "/Enrollment", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ courseId: selectedCourse })
        });

        if (!res.ok) {
showPopup("Payment or enrollment failed. Please try again.");
            payBtn.disabled = false;
            payBtn.innerText = "Pay Now";
            return;
        }

        // success: update enrolled courses
        allEnrollments.push({ courseId: selectedCourse });

showPopup("Payment successful! You are now enrolled.");
        closePayment();
        loadCourses(); // make video playable immediately

    } catch (err) {
        console.error(err);
showPopup("Payment failed. Please try again.");
        payBtn.disabled = false;
        payBtn.innerText = "Pay Now";
    }
}

