const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function() {
    const enteredUser = usernameInput.value.trim();
    const enteredPass = passwordInput.value.trim();

    const savedUser = localStorage.getItem("registeredUser");
    const savedPass = localStorage.getItem("registeredPass");

    if (!savedUser || !savedPass) {
        alert("مفيش حساب مسجل على هذا الجهاز يا بطل! قم بإنشاء حساب أولاً ⚠️");
        return;
    }
loginBtn.disabled = true;
loginBtn.innerText = "Logging in...";
    if (enteredUser === savedUser && enteredPass === savedPass) {

    localStorage.setItem("currentUser", enteredUser);

    setTimeout(() => {
    if(remember.checked){

localStorage.setItem("rememberUser",enteredUser);

}else{

localStorage.removeItem("rememberUser");

}
        window.location.href = "dashboard.html";

    },1000);
}else{

    loginBtn.disabled = false;
    loginBtn.innerText = "Login";

    alert("اسم المستخدم أو كلمة المرور غير صحيحة ❌");

}
});
const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.textContent = "☀️ Light";
}
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-theme");
    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️ Light";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙 Dark";
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openSection = urlParams.get('open');
    
    if (openSection === 'forest') {
        const forestModal = document.getElementById('forestModal');
        if (forestModal) forestModal.style.display = 'flex';
    }
    
    if (openSection === 'wheel') {
        const wheelModal = document.getElementById('wheelModal');
        if (wheelModal) wheelModal.style.display = 'flex';
    }
});

function canSpinWheel() {
    const lastSpin = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpin === today) {
        return false;
    }
    return true;
}

const spinBtn = document.getElementById('spinBtn');
if (spinBtn) {
    spinBtn.addEventListener('click', (e) => {
        if (!canSpinWheel()) {
            alert('لك لفة واحدة بس في اليوم! ارجع بكرة وجرب حظك تاني');
            e.stopImmediatePropagation();
            return;
        }
        localStorage.setItem('lastSpinDate', new Date().toDateString());
    });
}
passwordInput.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        loginBtn.click();

    }

});
const forgotPassword=document.getElementById("forgotPassword");

forgotPassword.addEventListener("click",function(e){

e.preventDefault();

alert("سيتم إضافة استعادة كلمة المرور قريبًا.");

});
const remember=document.getElementById("rememberMe");

if(localStorage.getItem("rememberUser")){

usernameInput.value=localStorage.getItem("rememberUser");

remember.checked=true;

}
