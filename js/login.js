const loginUsernameInput = document.querySelector(".login__username-input");
const loginPasswordInput = document.querySelector(".login__password-input");
const loginBtn = document.querySelector(".login__Btn");
let users = [];

const validationInput = () => {
  let usernameValue = loginUsernameInput.value;
  let passwordValue = loginPasswordInput.value;

  if (usernameValue.trim() && passwordValue.trim()) {
    validationForDb(usernameValue, passwordValue);
  } else {
    Swal.fire({
      icon: "error",
      theme: "dark",
      title: "خطا!",
      text: "لطفاً یوزرنیم و پسورد را درست وارد کنید.",
      confirmButtonText: "باشه",
    });
  }
};

const validationForDb = (username, password) => {
  let findUser = users.find((user) => {
    if (user.username == username && user.password == password) {
      return user;
    }
  });

  if (findUser) {
    setLocalstorage(findUser);
    Swal.fire({
      toast: true,
      theme: "dark",
      position: "bottom",
      icon: "success",
      title: "عملیات با موفقیت انجام شد!",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    setTimeout(() => {
      
        location.href = "./maneged.html";
      
    }, 4000);
  } else {
    Swal.fire({
      icon: "error",
      theme: "dark",
      title: "خطا!",
      text: "یوزرنیم یا پسورد اشتباست .",
      confirmButtonText: "باشه",
    });
    loginUsernameInput.value = "";
    loginPasswordInput.value = "";
  }
};

const setLocalstorage = (user) => {
  localStorage.clear()
  localStorage.setItem('username',user.name)
  localStorage.setItem('id',user.id)
};

const getUsersFromDB = () => {
  let url = "https://pazirik-22ee5-default-rtdb.firebaseio.com";

  let resultDB;

  fetch(`${url}/users.json`)
    .then((response) => response.json())
    .then((event) => {
      resultDB = event;

      users = [];
      for (id in resultDB) {
        let value = resultDB[id];
        value.id = id;
        users.push(value);
      }
    });
};

loginBtn.addEventListener("click", validationInput);
window.addEventListener("load", getUsersFromDB);
