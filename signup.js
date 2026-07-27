const newUsernameInput = document.getElementById("newUsername");
const newPasswordInput = document.getElementById("newPassword");
const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", function () {

    const username = newUsernameInput.value.trim();
    const password = newPasswordInput.value.trim();

    if (username === "" || password === "") {
        alert("من فضلك اكتب اسم المستخدم وكلمة المرور.");
        return;
    }

    if (username.length < 3) {
        alert("اسم المستخدم يجب أن يكون 3 أحرف على الأقل.");
        return;
    }

    if (password.length < 6) {
        alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
        return;
    }

    signupBtn.disabled = true;
    signupBtn.innerText = "Creating...";

    localStorage.setItem("registeredUser", username);
    localStorage.setItem("registeredPass", password);

    setTimeout(() => {

        alert("تم إنشاء الحساب بنجاح 🎉");

        window.location.href = "index.html";

    },1000);

});

const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-theme");
    themeToggle.textContent = "☀️ Light";

}

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {

        localStorage.setItem("theme","dark");
        themeToggle.textContent="☀️ Light";

    } else {

        localStorage.setItem("theme","light");
        themeToggle.textContent="🌙 Dark";

    }

});

newPasswordInput.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        signupBtn.click();

    }

});