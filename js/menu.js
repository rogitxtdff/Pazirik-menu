const url = "https://pazirik-22ee5-default-rtdb.firebaseio.com";
let category = [];
let items = [];

const formatNumber = (number) => {

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const insertCreatItemCategory = (items) => {
  

  items.forEach((item) => {
    const { nameItem, priceItem, aboutItem, categoryItem } = item;


    const categoryId = categoryItem.english.split(" ").join("-");
    let cartCategory = document.getElementById(categoryId);
    let itemsContiner = cartCategory.querySelector(".cat__list-items");

    itemsContiner.insertAdjacentHTML(
      "beforeend",
      `<div class="cat__item">
            <div class="cat__item--name-price">
              <div class="cat__item--price">${formatNumber(priceItem)}</div>
              <div class="cat__item--name">${nameItem}</div>
            </div>
            <div class="cat__item--about">${aboutItem}</div>
          </div>
        `
    );
  });
};

const addSelectClassCategory = (event, id) => {
  const menuContiner = document.querySelector(".main");
  const currentSelect = document.querySelector(".select");
  
  if (currentSelect) {
    currentSelect.classList.remove("select");
  }
  

  event.target.classList.add("select");

  const targetElement = document.getElementById(id);
  const offsetTop = targetElement.offsetTop;

  menuContiner.scrollTo({
    top: offsetTop - 30,
    behavior: "smooth",
  });
};


const insertCreatCategoryElem = (categorys) => {
  const categorysContiner = document.querySelector(".categorys");
  const menuContiner = document.querySelector(".main");

  categorysContiner.innerHTML = "";
  menuContiner.innerHTML = "";
  
  categorys.forEach((cat) => {
  

    const categoryId = cat.english.split(" ").join("-");
    
    categorysContiner.insertAdjacentHTML(
      "beforeend",
      `<a onclick="addSelectClassCategory(event,'${categoryId}')" class="categorys__item">${cat.farsi}</a>`
    );
    
    menuContiner.insertAdjacentHTML(
      "beforeend",
      `
      <div id="${categoryId}" class="cat__continer">
        <div class="cat__title"><p>${cat.farsi}</p></div>
        <div class="cat__list-items"></div>
      </div>`
    );
  });

  const firstCategoryItem = categorysContiner.querySelector(".categorys__item");
  if (firstCategoryItem) {
    firstCategoryItem.classList.add("select");
  }
};

const getItems = async () => {
  try {
    const loaderContiner = document.querySelector(".loader-continer");
    const response = await fetch(`${url}/items.json`);
    const resultDB = await response.json();
    
    if (!resultDB) {
      items = [];
      loaderContiner.classList.add("hidden");
      return;
    }

    items = Object.entries(resultDB).map(([id, value]) => ({
      ...value,
      id,
    }));

    insertCreatItemCategory(items);
    loaderContiner.classList.add("hidden");

  } catch (error) {
    console.error("Error in getItems:", error);
    callToast(false, "ناموفق در دریافت ایتم ها");
    
    const loaderContiner = document.querySelector(".loader-continer");
    if (loaderContiner) {
      loaderContiner.classList.add("hidden");
    }
  }
};

const getCategoryItem = async () => {
  try {
    const response = await fetch(`${url}/category.json`);
    const resultDB = await response.json();
    
    if (!resultDB) {
      category = [];
      callToast(false, "دسته‌بندی‌ای یافت نشد");
      return;
    }

    category = Object.entries(resultDB).map(([id, value]) => ({
      ...value,
      id,
    }));

    insertCreatCategoryElem(category);
    getItems();
    
  } catch (error) {
    console.error("Error in getCategoryItem:", error);
    callToast(false, "ناموفق در لود صفحه لطفا رفرش کنید.");
  }
};

/* ------------------ نمایش Toast ------------------ */
const callToast = (status, massage) => {
  Swal.fire({
    toast: true,
    theme: "dark",
    position: "bottom",
    icon: status ? "success" : "error",
    title: massage,
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};

window.addEventListener("load", () => {
  getCategoryItem();
});