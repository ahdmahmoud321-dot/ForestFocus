// ===============================
// Forest Focus - Focus Mode
// ===============================

// المستخدم الحالي
const currentUser = localStorage.getItem("currentUser") || "Guest";

function userKey(key) {
    return currentUser + "_" + key;
}

// عناصر الصفحة
const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const progressCircle = document.getElementById("progressCircle");

const totalStudyTimeText = document.getElementById("totalStudyTime");
const focusPointsText = document.getElementById("focusPoints");
const focusTreesText = document.getElementById("focusTrees");

// البيانات
let points = parseInt(localStorage.getItem(userKey("studyPoints"))) || 0;

let totalSeconds =
parseInt(localStorage.getItem(userKey("studySeconds"))) || 0;

let allForests =
JSON.parse(localStorage.getItem(userKey("allForests"))) || [[]];

// المؤقت
let timerInterval = null;

let currentSessionSeconds = 30 * 60;

const initialSessionSeconds = 30 * 60;

// إعداد الدائرة
const radius = 90;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = 0;

// ===============================
// تحديث الإحصائيات
// ===============================

function updateStatsDisplay() {

    focusPointsText.textContent = points;

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    totalStudyTimeText.textContent =
        `${String(hrs).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;

    let treeCount = 0;

    allForests.forEach(function (forest) {

        treeCount += forest.length;

    });

    focusTreesText.textContent = treeCount;

}

// ===============================
// تحديث المؤقت
// ===============================

function updateTimerDisplay() {

    const mins =
        String(Math.floor(currentSessionSeconds / 60)).padStart(2, "0");

    const secs =
        String(currentSessionSeconds % 60).padStart(2, "0");

    timerDisplay.textContent = `${mins}:${secs}`;

    const percentage =
        currentSessionSeconds / initialSessionSeconds;

    const offset =
        circumference * (1 - percentage);

    progressCircle.style.strokeDashoffset = offset;

}

// ===============================
// بدء الجلسة
// ===============================

startTimerBtn.addEventListener("click", function () {

    if (timerInterval !== null) return;

    startTimerBtn.disabled = true;

    timerInterval = setInterval(function () {

        if (currentSessionSeconds > 0) {

            currentSessionSeconds--;

            totalSeconds++;

            localStorage.setItem(
                userKey("studySeconds"),
                totalSeconds
            );

            updateTimerDisplay();

            if (
                (initialSessionSeconds - currentSessionSeconds) % 1800 === 0
            ) {

                points += 10;

                localStorage.setItem(
                    userKey("studyPoints"),
                    points
                );

                updateStatsDisplay();

                alert(
                    "🎉 Excellent! You completed 30 minutes of focused study and earned +10 Points!"
                );

            }

        } else {

            clearInterval(timerInterval);

            timerInterval = null;

            startTimerBtn.disabled = false;
                        points += 20;

            localStorage.setItem(
                userKey("studyPoints"),
                points
            );

            updateStatsDisplay();

            alert("🏆 Session Completed! Take a short break, champion!");

            currentSessionSeconds = initialSessionSeconds;

            updateTimerDisplay();

        }

    }, 1000);

});

// ===============================
// إيقاف مؤقت
// ===============================

pauseTimerBtn.addEventListener("click", function () {

    clearInterval(timerInterval);

    timerInterval = null;

    startTimerBtn.disabled = false;

});

// ===============================
// إعادة ضبط
// ===============================

resetTimerBtn.addEventListener("click", function () {

    if (confirm("Reset current session timer?")) {

        clearInterval(timerInterval);

        timerInterval = null;

        startTimerBtn.disabled = false;

        currentSessionSeconds = initialSessionSeconds;

        updateTimerDisplay();

    }

});

// ===============================
// تشغيل أولي
// ===============================

updateStatsDisplay();

updateTimerDisplay();