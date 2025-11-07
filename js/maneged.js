const url = "https://pazirik-22ee5-default-rtdb.firebaseio.com";
let category = [];

const validationUser = () => {
  if (localStorage.getItem("username") && localStorage.getItem("id")) {
    let userNameElem = document.querySelector(".welcome-user-name");

    userNameElem.innerHTML = localStorage.getItem("username");

    return true;
  } else {
    Swal.fire({
      icon: "error",
      title: "دسترسی غیرمجاز!",
      text: "شما لاگین نیستید.",
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      didClose: () => {
        window.location.href = "./login.html";
      },
    });

    return false;
  }
};

const getCategory = () => {
  fetch(`${url}/category.json`)
    .then((response) => response.json())
    .then((event) => {
      resultDB = event;

      category = [];
      for (id in resultDB) {
        let value = resultDB[id];
        value.id = id;
        category.push(value);
      }
      mergSortElem();
    });
};

const mergSortElem = () => {
  const sortSelect = document.getElementById("sort-select");

  sortSelect.innerHTML = "";
   sortSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="all">همه</option>`
    );
  category.forEach((cat) => {
    sortSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${cat.english}">${cat.farsi}</option>`
    );
  });
};
window.addEventListener("load", () => {
  let isLogin = validationUser();

  if (isLogin) {
    getCategory();
  }
});
