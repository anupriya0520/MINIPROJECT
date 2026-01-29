let allEnrollments = [];

function logout() {
    localStorage.clear();
    location.href = "login.html";
}

function hideAll() {
    [
        "viewCourses",
        "createCourse",
        "updateCourse",
        "deleteCourse",
        "enrollmentsSection"
    ].forEach(id => document.getElementById(id).style.display = "none");
}

function showSection(sectionId) {
    hideAll();
    document.getElementById(sectionId).style.display = "block";

    if (sectionId === "viewCourses") loadCourses();
    if (sectionId === "enrollmentsSection") loadEnrollments();
        if (sectionId === "updateCourse") resetUpdateForm();  // ✅ reset inputs

}

/* =========================
   COURSES
========================= */

async function loadCourses() {
    const res = await fetch(API_BASE + "/Course");
    const data = await res.json();

    courses.innerHTML = data.map(c => `
        <div class="course-card">
            <p><b>Course ID:</b> ${c.courseId}</p>
            <h4>${c.title}</h4>
            <p>${c.description}</p>
            <p><b>Price:</b> ₹${c.price}</p>

            ${c.videoUrl ? `
                <div class="video-container">
                    <iframe width="320" height="180" 
                        src="${convertYoutubeUrl(c.videoUrl)}" 
                        title="${c.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            ` : `<p>No video available</p>`}
        </div>
    `).join("");
}

// Helper function to convert regular YouTube URL to embeddable format
function convertYoutubeUrl(url) {
    if (!url) return "";
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

function resetUpdateForm() {
    uId.value = "";
    uTitle.value = "";
    uDescription.value = "";
    uPrice.value = "";
    uVideo.value = "";
}
async function createCourse() {
    await fetch(API_BASE + "/Course", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            title: cTitle.value,
            description: cDescription.value,
            price: cPrice.value,
            videoUrl: cVideo.value
        })
    });

showPopup("Course created successfully");
    cTitle.value = cDescription.value = cPrice.value = cVideo.value = "";
}

async function updateCourse() {
    const id = uId.value.trim();
    const title = uTitle.value.trim();
    const description = uDescription.value.trim();
    const price = parseFloat(uPrice.value);
    const video = uVideo.value.trim();

    // ✅ Frontend validation
    if (!id || !title || !description || !video || isNaN(price) || price <= 0) {
showPopup("All fields are required and price must be positive");
        return;
    }

    const res = await fetch(API_BASE + `/Course/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ courseId: id, title, description, price, videoUrl: video })
    });

    if (res.ok) {
showPopup("Course updated successfully");
        resetUpdateForm(); // clear fields
        loadCourses(); // refresh course list
    } else {
        const err = await res.text();
showPopup("Update failed: " + err);
    }
}

async function deleteCourse() {
    const id = dId.value;

    await fetch(API_BASE + `/Course/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });

showPopup("Course deleted successfully");
}

/* =========================
   ENROLLMENTS
========================= */

async function loadEnrollments() {
    const res = await fetch(API_BASE + "/Enrollment/all", {
        headers: getHeaders()
    });

    allEnrollments = await res.json();
    renderEnrollments(allEnrollments);
}
function renderEnrollments(data) {
    if (data.length === 0) {
        enrollments.innerHTML = "<p>No enrollments found</p>";
        return;
    }

    enrollments.innerHTML = data.map(e => `
        <div class="course-card">
            <p><b>User:</b> ${e.userName}</p>
            <p><b>Course:</b> ${e.courseTitle}</p>
            <p><strong>Enrolled On:</strong> ${new Date(e.enrolledDate).toLocaleDateString()}</p>
        </div>
    `).join("");
}

function filterEnrollments() {
    const filter = courseFilter.value.toLowerCase();

    const filtered = allEnrollments.filter(e =>
        e.courseTitle.toLowerCase().includes(filter)
    );

    renderEnrollments(filtered);
}

function resetEnrollments() {
    courseFilter.value = "";
    renderEnrollments(allEnrollments);
}
