// ===============================
// Forest Focus Dashboard
// ===============================

// عناصر الصفحة
const taskInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const clearAllBtn = document.getElementById("clearAllBtn");
const progressBar = document.getElementById("progressBarFill");
const progressPercent = document.getElementById("progressPercent");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");
const pointsText = document.getElementById("pointsText");
const welcomeText = document.getElementById("welcomeText");

// ===============================
// المستخدم الحالي
// ===============================
const currentUser = localStorage.getItem("currentUser") || "Guest";
function userKey(name) {
    return currentUser + "_" + name;
}

// ===============================
// تحميل البيانات
// ===============================
let tasks = JSON.parse(localStorage.getItem(userKey("tasks"))) || [];
let points = parseInt(localStorage.getItem(userKey("points"))) || 0;

// ===============================
// الاقتباسات والترحيب
// ===============================
const quotesEn = [
    "Stay focused and never give up.",
    "Small progress is still progress.",
    "Every study session grows your future.",
    "Success comes from consistency.",
    "One task at a time."
];
const quotesAr = [
    "ركّز على هدفك ولا تستسلم أبدًا.",
    "التقدم الصغير لا يزال تقدمًا.",
    "كل جلسة دراسة تنمي مستقبلك.",
    "النجاح يأتي من الاستمرارية.",
    "مهمة واحدة في كل مرة."
];

function updateWelcomeText() {
    const isAr = (document.documentElement.lang || "ar") === 'ar';
    if (welcomeText) {
        welcomeText.textContent = isAr ? `👋 مرحبًا بك، ${currentUser}` : `👋 Welcome, ${currentUser}`;
    }
}

function updateQuote() {
    const quoteText = document.getElementById("quoteText");
    if (quoteText) {
        const isAr = (document.documentElement.lang || "ar") === 'ar';
        const currentQuotes = isAr ? quotesAr : quotesEn;
        quoteText.textContent = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
    }
}

// ===============================
// حفظ البيانات
// ===============================
function saveData() {
    localStorage.setItem(userKey("tasks"), JSON.stringify(tasks));
    localStorage.setItem(userKey("points"), points);
}

// ===============================
// تحديث الإحصائيات
// ===============================
function updateStats() {
    const completed = tasks.filter(task => task.completed).length;
    if (totalTasks) totalTasks.textContent = tasks.length;
    if (completedTasks) completedTasks.textContent = completed;
    if (remainingTasks) remainingTasks.textContent = tasks.length - completed;
    if (pointsText) pointsText.textContent = points;

    let percent = 0;
    if (tasks.length > 0) {
        percent = Math.round((completed / tasks.length) * 100);
    }
    if (progressPercent) progressPercent.textContent = percent + "%";
    if (progressBar) progressBar.style.width = percent + "%";
}

// ===============================
// إنشاء عنصر المهمة
// ===============================
function createTaskElement(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    if (task.completed) {
        li.style.opacity = ".6";
    }

    let dateDisplay = "";
    if (task.date) {
        const dateObj = new Date(task.date);
        const formattedDate = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - " + dateObj.toLocaleDateString([], { day: 'numeric', month: 'short' });
        dateDisplay = `<span style="font-size: 11px; color: var(--muted); block-size: auto; display: block; margin-top: 2px;">📅 ${formattedDate}</span>`;
    }

    li.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; flex: 1;">
            <input type="checkbox" class="checkTask" ${task.completed ? "checked" : ""}>
            <div style="display: flex; flex-direction: column;">
                <span class="task-text-span" style="${task.completed ? "text-decoration:line-through;" : ""}">
                    ${task.priority} ${task.text}
                </span>
                ${dateDisplay}
            </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
            <button class="action-icon-btn editBtn" type="button" style="padding: 6px 10px !important; border-radius: 8px !important;">✏️</button>
            <button class="btn-danger deleteBtn" type="button">🗑️</button>
        </div>
    `;
    if (taskList) taskList.appendChild(li);
}

// ===============================
// عرض المهام
// ===============================
function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = "";
    tasks.forEach(task => {
        createTaskElement(task);
    });
    updateStats();
}

// ===============================
// إضافة مهمة جديدة
// ===============================
if (addBtn) addBtn.addEventListener("click", addTask);
if (taskInput) {
    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === "") {
        const isAr = (document.documentElement.lang || "ar") === 'ar';
        alert(isAr ? "من فضلك أدخل المهمة أولاً." : "Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        priority: taskPriority ? taskPriority.value : "🟢",
        date: taskDate ? taskDate.value : "",
        completed: false,
        pointsAwarded: false
    };

    tasks.push(task);
    saveData();
    renderTasks();
    if (taskInput) taskInput.value = "";
    if (taskDate) taskDate.value = "";
}

// التحكم بالمهام (حذف وتعديل)
if (taskList) {
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("deleteBtn") || e.target.parentElement.classList.contains("deleteBtn")) {
            const button = e.target.classList.contains("deleteBtn") ? e.target : e.target.parentElement;
            const id = Number(button.closest("li").dataset.id);
            tasks = tasks.filter(task => task.id !== id);
            saveData();
            renderTasks();
        }

        if (e.target.classList.contains("editBtn") || e.target.parentElement.classList.contains("editBtn")) {
            const button = e.target.classList.contains("editBtn") ? e.target : e.target.parentElement;
            const li = button.closest("li");
            const id = Number(li.dataset.id);

            const taskToEdit = tasks.find(task => task.id === id);

            if (taskToEdit) {
                const isAr = (document.documentElement.lang || "ar") === 'ar';
                const newText = prompt(isAr ? "✏️ تعديل اسم المهمة:" : "✏️ Edit task name:", taskToEdit.text);
                if (newText && newText.trim() !== "") {
                    taskToEdit.text = newText.trim();
                    saveData();
                    renderTasks();
                }
            }
        }
    });

    taskList.addEventListener("change", function (e) {
        if (e.target.classList.contains("checkTask")) {
            const id = Number(e.target.parentElement.parentElement.dataset.id);
            let showEffect = false;

            tasks.forEach(task => {
                if (task.id === id) {
                    if (e.target.checked) {
                        task.completed = true;
                        if (!task.pointsAwarded) {
                            if (task.priority === "🔴") points += 30;
                            else if (task.priority === "🟡") points += 20;
                            else points += 10;
                            task.pointsAwarded = true;
                            showEffect = true;
                        }
                    } else {
                        task.completed = false;
                    }
                }
            });

            saveData();
            renderTasks();
            checkBadges();
            if (showEffect) triggerLeavesEffect();
        }
    });
}

// مسح الكل
if (clearAllBtn) {
    clearAllBtn.addEventListener("click", function () {
        const isAr = (document.documentElement.lang || "ar") === 'ar';
        if (confirm(isAr ? "هل أنت تأكد من مسح جميع المهام؟" : "Delete all tasks?")) {
            tasks = [];
            points = 0;
            saveData();
            renderTasks();
            checkBadges();
        }
    });
}

// البحث
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll("#taskList li").forEach(li => {
            li.style.display = li.textContent.toLowerCase().includes(value) ? "flex" : "none";
        });
    });
}

// ===============================
// الغابة الرقمية المنظمة بالتتابع
// ===============================
const forestModal = document.getElementById("forestModal");
const openForestBtn = document.getElementById("openForestBtn");
const closeForestBtn = document.getElementById("closeForestBtn");
const forestGrid = document.getElementById("forestGrid");

if (openForestBtn) {
    openForestBtn.addEventListener("click", () => {
        renderForest();
        if (forestModal) forestModal.style.display = "flex";
    });
}

if (closeForestBtn) {
    closeForestBtn.addEventListener("click", () => {
        if (forestModal) forestModal.style.display = "none";
    });
}

// نظام الغابات المتعددة
let currentForestPage = 0;

function renderForest() {
    if (!forestGrid) return;
    forestGrid.innerHTML = "";

    const allTrees = JSON.parse(localStorage.getItem(userKey("forest"))) || [];
    const totalForestsNeeded = Math.max(1, Math.ceil(allTrees.length / 15));

    if (allTrees.length > 0 && allTrees.length % 15 === 0 && localStorage.getItem(userKey("last_checked_length")) != allTrees.length) {
        localStorage.setItem(userKey("last_checked_length"), allTrees.length);
        currentForestPage = totalForestsNeeded;
    }

    const forestTitle = document.getElementById("forestTitle");
    if (forestTitle) {
        const isAr = (document.documentElement.lang || "ar") === 'ar';
        forestTitle.textContent = isAr ? `🌲 الغابة الرقمية (رقم ${currentForestPage + 1})` : `🌲 Digital Forest (#${currentForestPage + 1})`;
    }

    const startIndex = currentForestPage * 15;
    const pageTrees = allTrees.slice(startIndex, startIndex + 15);

    for (let i = 0; i < 15; i++) {
        const box = document.createElement("div");
        box.className = "tree-svg-box";

        if (pageTrees[i]) {
            box.textContent = pageTrees[i];
            box.classList.add("planted");
        } else {
            box.textContent = "";
        }
        forestGrid.appendChild(box);
    }

    renderForestNavigation(totalForestsNeeded);
}

function renderForestNavigation(totalForests) {
    let navDiv = document.getElementById("forestNavButtons");
    if (!navDiv) {
        navDiv = document.createElement("div");
        navDiv.id = "forestNavButtons";
        navDiv.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-top:15px; gap:10px;";
        forestGrid.after(navDiv);
    }

    const isAr = (document.documentElement.lang || "ar") === 'ar';
    navDiv.innerHTML = `
        <button id="prevForestBtn" class="action-icon-btn" style="width:auto !important; padding:8px 15px;" ${currentForestPage === 0 ? "disabled style='opacity:0.4;'" : ""}>
            ${isAr ? "⬅️ الغابة السابقة" : "⬅️ Prev Forest"}
        </button>
        <span style="font-size:13px; font-weight:bold; color:var(--text);"> ${currentForestPage + 1} / ${Math.max(1, Math.ceil((JSON.parse(localStorage.getItem(userKey("forest"))) || []).length / 15) + 1)} </span>
        <button id="nextForestBtn" class="action-icon-btn" style="width:auto !important; padding:8px 15px;" ${currentForestPage >= Math.ceil((JSON.parse(localStorage.getItem(userKey("forest"))) || []).length / 15) ? "disabled style='opacity:0.4;'" : ""}>
            ${isAr ? "الغابة التالية ➡️" : "Next Forest ➡️"}
        </button>
    `;

    const prevBtn = document.getElementById("prevForestBtn");
    const nextBtn = document.getElementById("nextForestBtn");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentForestPage > 0) { currentForestPage--; renderForest(); }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentForestPage++; renderForest();
        });
    }
}

// شراء الأشجار
document.querySelectorAll(".buy-tree-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        const cost = Number(this.dataset.cost);
        const isAr = (document.documentElement.lang || "ar") === 'ar';

        if (points < cost) {
            alert(isAr ? "⚠️ لا توجد نقاط كافية لشراء هذه الشجرة!" : "⚠️ Not enough points!");
            return;
        }

        points -= cost;
        const forest = JSON.parse(localStorage.getItem(userKey("forest"))) || [];
        let tree = "🌳";

        switch (this.dataset.type) {
            case "pine": tree = "🌲"; break;
            case "sakura": tree = "🌸"; break;
            case "palm": tree = "🌴"; break;
        }

        forest.push(tree);
        localStorage.setItem(userKey("forest"), JSON.stringify(forest));

        currentForestPage = Math.floor((forest.length - 1) / 15);

        saveData();
        renderForest();
        updateStats();

        if (forest.length % 15 === 0) {
            alert(isAr ? `🎉 مبروك! لقد قمتِ بملء الغابة الحالية بالكامل وفتحتِ غابة جديدة تماماً! 🚀` : `🎉 Forest completed! A new forest is unlocked! 🚀`);
        } else {
            alert(isAr ? `🎉 تم زراعة الشجرة ${tree} بنجاح في الغابة رقم ${currentForestPage + 1}! ` : `🎉 Tree planted successfully!`);
        }

        triggerLeavesEffect();
    });
});

// ===============================
// صندوق الجوائز
// ===============================
const rewardModal = document.getElementById("rewardBoxModal");
const openBoxBtn = document.getElementById("openBoxBtn");
const closeBoxBtn = document.getElementById("closeBoxBtn");
const claimBoxBtn = document.getElementById("claimBoxBtn");

if (openBoxBtn) {
    openBoxBtn.addEventListener("click", () => {
        if (rewardModal) rewardModal.style.display = "flex";
    });
}
if (closeBoxBtn) {
    closeBoxBtn.addEventListener("click", () => {
        if (rewardModal) rewardModal.style.display = "none";
    });
}

if (claimBoxBtn) {
    claimBoxBtn.addEventListener("click", () => {
        const isAr = (document.documentElement.lang || "ar") === 'ar';
        if (points < 50) {
            alert(isAr ? "تحتاج إلى 50 نقطة لفتح الصندوق!" : "You need 50 points to open the box!");
            return;
        }

        points -= 50;
        updateStats();
        saveData();

        const rewards = ["🌳", "🌲", "🌸", "🌴", "🌵", "🍁"];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];

        const forest = JSON.parse(localStorage.getItem(userKey("forest"))) || [];
        forest.push(reward);
        localStorage.setItem(userKey("forest"), JSON.stringify(forest));

        alert(isAr ? `🎉 مبروك! حصلت على شجرة ${reward}` : `🎉 Congrats! You got a tree ${reward}`);

        renderForest();
        triggerLeavesEffect();
    });
}

// ===============================
// Dark Mode
// ===============================
const themeToggle = document.getElementById("themeToggle");
function applyThemeText() {
    if (!themeToggle) return;
    const isAr = (document.documentElement.lang || "ar") === 'ar';
    const isDark = document.body.classList.contains("dark-theme");
    if (isDark) {
        themeToggle.textContent = isAr ? "☀️ الضوء" : "☀️ Light";
    } else {
        themeToggle.textContent = isAr ? "🌙 الداكن" : "🌙 Dark";
    }
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        applyThemeText();
    });
}

// ===============================
// Language الشامل لجميع النصوص
// ===============================
let currentLang = localStorage.getItem("app_lang") || "ar";

function applyLanguage(lang) {
    const isAr = lang === 'ar';
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.body.dir = isAr ? "rtl" : "ltr";

    const langBtn = document.getElementById("langToggle");
    if (langBtn) langBtn.innerText = isAr ? "🌐 AR | EN" : "🌐 EN | AR";

    const mainTitle = document.getElementById('mainTitle');
    if (mainTitle) mainTitle.innerText = isAr ? "تركيز الغابة" : "Forest Focus";

    const mainSubtitle = document.getElementById('mainSubtitle');
    if (mainSubtitle) mainSubtitle.innerText = isAr ? "منظم الدراسة الذكي" : "Smart Study Planner";

    const addBtnEl = document.getElementById('addBtn');
    if (addBtnEl) addBtnEl.innerText = isAr ? "إضافة مهمة" : "Add Task";

    const taskInputEl = document.getElementById('taskInput');
    if (taskInputEl) taskInputEl.placeholder = isAr ? "أدخل مهمة جديدة..." : "Enter a new task...";

    const searchInputEl = document.getElementById('searchInput');
    if (searchInputEl) searchInputEl.placeholder = isAr ? "بحث عن مهمة..." : "Search task...";

    const clearAllBtnEl = document.getElementById('clearAllBtn');
    if (clearAllBtnEl) clearAllBtnEl.innerText = isAr ? "🧹 مسح الكل" : "🧹 Clear All";

    const tasksHeading = document.getElementById('tasksHeading');
    if (tasksHeading) tasksHeading.innerText = isAr ? "قائمة مهامي" : "My Tasks List";

    const pointsLabel = document.getElementById('pointsLabel');
    if (pointsLabel) pointsLabel.innerText = isAr ? "النقاط :" : "Points :";

    const statTotal = document.getElementById('statTotal');
    if (statTotal) statTotal.innerText = isAr ? "الإجمالي :" : "Total :";

    const statDone = document.getElementById('statDone');
    if (statDone) statDone.innerText = isAr ? "المكتملة :" : "Completed :";

    const statLeft = document.getElementById('statLeft');
    if (statLeft) statLeft.innerText = isAr ? "المتبقية :" : "Remaining :";

    const focusModeLink = document.getElementById('focusModeLink');
    if (focusModeLink) focusModeLink.innerText = isAr ? "🎯 وضع التركيز" : "🎯 Focus Mode";

    const btnForestText = document.getElementById('btnForestText');
    if (btnForestText) btnForestText.innerText = isAr ? "غابتي الرقمية" : "My Digital Forest";

    const btnBoxText = document.getElementById('btnBoxText');
    if (btnBoxText) btnBoxText.innerText = isAr ? "صندوق المكافآت" : "Reward Box";

    const badge1 = document.getElementById('badge1');
    if (badge1) badge1.innerText = isAr ? "🏅 المهمة الأولى" : "🏅 First Task";
    const badge2 = document.getElementById('badge2');
    if (badge2) badge2.innerText = isAr ? "🏅 المكتشف" : "🏅 Explorer";
    const badge3 = document.getElementById('badge3');
    if (badge3) badge3.innerText = isAr ? "🏅 النخبة" : "🏅 Elite";

    // المتجر والمودال 1
    const forestSubText = document.querySelector("#forestModal .tagline");
    if (forestSubText) forestSubText.innerText = isAr ? "شاهد إنجازاتك تتجسد في أشجار" : "Watch your achievements grow into trees";
    
    const shopTitle = document.getElementById("shopTitle");
    if (shopTitle) shopTitle.innerText = isAr ? "🛒 متجر الأشجار" : "🛒 Tree Shop";

    const buyBtns = document.querySelectorAll(".buy-tree-btn");
    if (buyBtns.length >= 4) {
        buyBtns[0].innerText = isAr ? "🌳 شجرة (20)" : "🌳 Tree (20)";
        buyBtns[1].innerText = isAr ? "🌲 صنوبر (40)" : "🌲 Pine (40)";
        buyBtns[2].innerText = isAr ? "🌸 ساكورا (60)" : "🌸 Sakura (60)";
        buyBtns[3].innerText = isAr ? "🌴 نخيل (80)" : "🌴 Palm (80)";
    }

    // صندوق المكافآت والمودال 2
    const boxModalTitle = document.getElementById("boxModalTitle");
    if (boxModalTitle) boxModalTitle.innerText = isAr ? "🎁 صندوق المكافآت" : "🎁 Reward Box";

    const boxSubText = document.getElementById("boxSubText");
    if (boxSubText) boxSubText.innerText = isAr ? "افتح الصندوق للحصول على شجرة عشوائية!" : "Open the box to get a random tree!";

    if (claimBoxBtn) claimBoxBtn.innerText = isAr ? "فتح الصندوق (50 🌟)" : "Open Box (50 🌟)";

    // الخيارات والقواعد
    const taskPriority = document.getElementById("taskPriority");
    if (taskPriority && taskPriority.options.length >= 3) {
        taskPriority.options[0].text = isAr ? "عادي 🟢" : "Normal 🟢";
        taskPriority.options[1].text = isAr ? "متوسط 🟡" : "Medium 🟡";
        taskPriority.options[2].text = isAr ? "عاجل 🔴" : "Urgent 🔴";
    }

    const footerCredit = document.querySelector(".footer-credit");
    if (footerCredit) footerCredit.innerText = isAr ? "© 2026 تم التطوير بواسطة عهد" : "© 2026 Developed by Ahd";

    localStorage.setItem("app_lang", lang);
    applyThemeText();
    updateWelcomeText();
    updateQuote();
    renderForest();
}

applyLanguage(currentLang);

const langToggle = document.getElementById("langToggle");
if (langToggle) {
    langToggle.addEventListener("click", () => {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        applyLanguage(currentLang);
    });
}

// ===============================
// Badges
// ===============================
function checkBadges() {
    const done = tasks.filter(t => t.completed).length;
    const badge1 = document.getElementById("badge1");
    const badge2 = document.getElementById("badge2");
    const badge3 = document.getElementById("badge3");

    if (done >= 1 && badge1) badge1.classList.add("unlocked");
    if (done >= 5 && badge2) badge2.classList.add("unlocked");
    if (points >= 100 && badge3) badge3.classList.add("unlocked");
}

// ===============================
// Leaves Animation
// ===============================
function triggerLeavesEffect() {
    const leaves = ["🍃", "🌿", "✨"];
    for (let i = 0; i < 20; i++) {
        const leaf = document.createElement("div");
        leaf.className = "leaf-particle";
        leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
        leaf.style.left = Math.random() * 100 + "vw";
        leaf.style.animationDuration = (2 + Math.random() * 3) + "s";
        document.body.appendChild(leaf);
        setTimeout(() => { leaf.remove(); }, 5000);
    }
}

// ===============================
// تشغيل تلقائي
// ===============================
renderTasks();
checkBadges();
if (forestGrid) renderForest();
