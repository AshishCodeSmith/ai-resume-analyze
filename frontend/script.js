/* --------------------------------------------------------
   SCROLL TO UPLOAD SECTION
---------------------------------------------------------*/
function goToUpload() {
    document.getElementById("uploadSection").scrollIntoView({
        behavior: "smooth"
    });
}


/* --------------------------------------------------------
   ANIMATE ATS SCORE CIRCLE
---------------------------------------------------------*/
function animateScore(value) {
    let current = 0;
    const speed = 20;

    const interval = setInterval(() => {
        if (current >= value) {
            clearInterval(interval);
        } else {
            current++;
            document.getElementById("scoreValue").innerText = current + "%";
        }
    }, speed);
}


/* --------------------------------------------------------
   ANALYZE RESUME (MAIN FUNCTION)
---------------------------------------------------------*/
function analyze() {

    const fileInput = document.getElementById("resume");
    const jobDesc = document.getElementById("jobDesc").value.trim();

    if (!fileInput.files[0]) {
        alert("Please upload a resume!");
        return;
    }

    if (!jobDesc) {
        alert("Please paste a Job Description!");
        return;
    }

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);
    formData.append("jobDesc", jobDesc);

    fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
        mode: "cors"     // 🔥 Required for Windows / Live Server
    })
        .then(res => res.json())
        .then(data => {

            // Show dashboard section
            document.getElementById("dashboard").classList.remove("hidden");

            // Animate Score
            animateScore(data["ATS Score (%)"]);

            // Found Skills
            const found = document.getElementById("foundSkills");
            found.innerHTML = "";
            data["Skills Found in Resume"].forEach(skill => {
                found.innerHTML += `<span class="badge found">${skill}</span>`;
            });

            // Missing Skills
            const missing = document.getElementById("missingSkills");
            missing.innerHTML = "";
            data["Missing Skills"].forEach(skill => {
                missing.innerHTML += `<span class="badge missing">${skill}</span>`;
            });

            // Suggestions
            const sugBox = document.getElementById("suggestionsList");
            sugBox.innerHTML = "";
            data["Suggestions"].forEach(s => {
                sugBox.innerHTML += `<li>${s}</li>`;
            });

            // Scroll to Results automatically
            document.getElementById("dashboard").scrollIntoView({
                behavior: "smooth"
            });

        })
        .catch((error) => {
            console.error("Backend error:", error);
            alert("❌ Could not connect to backend. Make sure Flask is running!");
        });
}


/* --------------------------------------------------------
   BACK TO TOP BUTTON
---------------------------------------------------------*/
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


/* --------------------------------------------------------
   DARK / LIGHT MODE TOGGLE
---------------------------------------------------------*/
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) {

    let savedTheme = localStorage.getItem("theme");

    // LOAD SAVED THEME
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeBtn.textContent = "🌙 Dark Mode";
    } else {
        themeBtn.textContent = "☀️ Light Mode"; // Default dark mode
    }

    // CLICK TO TOGGLE THEME
    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            themeBtn.textContent = "🌙 Dark Mode";
            localStorage.setItem("theme", "light");
        } else {
            themeBtn.textContent = "☀️ Light Mode";
            localStorage.setItem("theme", "dark");
        }
    });
}
