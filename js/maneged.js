// دکمه‌ها و المنت‌های اصلی صفحه
const creatItemBtn = document.getElementById("creat-item-btn");
const backgroundBlur = document.querySelector(".back-blur");
const closeBtnIcon = document.querySelector(".modal-header__close-btn");
const modalMain = document.querySelector(".modal-main");
const modalFooter = document.querySelector(".modal-footer");
const url = "https://pazirik-22ee5-default-rtdb.firebaseio.com";

// متغیرهای ذخیره دسته‌بندی و آیتم‌ها
let category = [];
let items = [];


const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};


// ------------------ آپدیت آیتم در دیتابیس ------------------
// این فانکشن یک آیتم موجود را بر اساس id با داده‌های جدید جایگزین می‌کند
const putNewItem = async (name, price, about = "", cat, id) => {
  // پیدا کردن دسته‌بندی کامل بر اساس نام انگلیسی
  let fullNameCategory = category.find((event) => event.english == cat);

  // ساخت آبجکت آیتم جدید برای ارسال به دیتابیس
  let item = {
    nameItem: name,
    priceItem: price,
    aboutItem: about,
    categoryItem: { ...fullNameCategory },
  };

  try {
    // ارسال درخواست PUT برای آپدیت آیتم
    const response = await fetch(`${url}/items/${id}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    // بعد از آپدیت، لیست آیتم‌ها دوباره بارگذاری می‌شود
    getItems();

    // نمایش پیام موفقیت
    callToast(true, "ایتم شما با موفقیت اپدیت شد");
  } catch (error) {
    // نمایش پیام خطا در صورت ناموفق بودن
    callToast(false, "ناموفق بود");
  } finally {
    // بازگرداندن دکمه تایید به حالت اولیه و بستن مودال
    document.getElementById("update-item").innerHTML = `تایید`;
    closeModal();
  }
};

// ------------------ باز کردن مودال آپدیت آیتم ------------------
// این فانکشن یک مودال باز می‌کند تا کاربر بتواند آیتم انتخابی را ویرایش کند
const openUpdateModal = (item) => {
  // اسکرول به بالای صفحه برای نمایش مودال
  window.scrollTo(0, 0);

  // نمایش پس‌زمینه تار و فعال‌سازی مودال
  backgroundBlur.classList.remove("hidden");
  backgroundBlur.classList.add("active");

  // بستن مودال با کلیک روی دکمه ضربدر
  closeBtnIcon.addEventListener("click", closeModal);

  // محتوای مودال (فیلدهای ورودی برای ویرایش آیتم)
  modalMain.innerHTML = `
    <div class="modal-main__title">تغییر جدید ایتم </div>
    <input type="text" id="name-item" dir="rtl" placeholder="نام جدید ..." class="modal-main__input"/>
    <input type="text" id="price-item" dir="rtl" placeholder="قیمت جدید ..." class="modal-main__input"/>
    <textarea id="about-item" dir="rtl" placeholder="توضیحات جدید ..." class="modal-main__textarea"></textarea>
    <select dir="rtl" id="categiry-item" class="modal-main__select" name="category"></select>
  `;

  // گرفتن المنت‌های ورودی
  let nameItem = document.getElementById("name-item");
  let priceItem = document.getElementById("price-item");
  let aboutItem = document.getElementById("about-item");
  let categiryItem = document.getElementById("categiry-item");

  // مقداردهی اولیه فیلدها با داده‌های آیتم انتخابی
  nameItem.value = item["nameItem"];
  priceItem.value = item["priceItem"];
  aboutItem.value = item["aboutItem"];

  // دکمه‌های پایین مودال (تایید و انصراف)
  modalFooter.innerHTML = `
    <div id="update-item" class="modal-footer__ok-btn">تایید</div>
    <div  onclick='closeModal()' class="modal-footer__cancel-btn">انصراف</div>
  `;

  // رویداد کلیک روی دکمه تایید آپدیت
  document.getElementById("update-item").addEventListener("click", () => {
    const name = nameItem.value.trim();
    const price = priceItem.value.trim();
    const about = aboutItem.value.trim();
    const category = categiryItem.value;

    // فراخوانی فانکشن اعتبارسنجی و آپدیت آیتم
    validationAddItem(name, price, about, category, "PUT", item.id);
  });

  // بارگذاری دسته‌بندی‌ها در select
  const modalMainSelect = document.querySelector(".modal-main__select");
  modalMainSelect.innerHTML = "";

  if (category.length === 0) {
    modalMainSelect.innerHTML = `<option disabled selected>دسته‌بندی‌ها بارگذاری نشده‌اند</option>`;
    return;
  }

  category.forEach((cat) => {
    modalMainSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${cat.english}">${cat.farsi}</option>`
    );
  });

  // انتخاب دسته‌بندی فعلی آیتم
  categiryItem.value = item.categoryItem["english"];
};

// ------------------ حذف آیتم از دیتابیس ------------------
// این فانکشن یک آیتم را بر اساس id از دیتابیس حذف می‌کند
const deleteItemDb = async (id) => {
  try {
    const response = await fetch(`${url}/items/${id}.json`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    // اگر حذف موفقیت‌آمیز بود، لیست آیتم‌ها دوباره بارگذاری می‌شود
    if (response.ok) {
      getItems();
      callToast(true, "ایتم با موفقیت حذف شد .");
    }
  } catch (error) {
    // نمایش پیام خطا در صورت ناموفق بودن
    callToast(false, "ناموفق بود");
  } finally {
    // بازگرداندن دکمه تایید به حالت اولیه و بستن مودال
    document.getElementById("accepte-remove-item").innerHTML = "تایید";
    closeModal();
  }
};

// ------------------ نمایش هشدار حذف آیتم ------------------
// این فانکشن یک مودال هشدار باز می‌کند تا کاربر حذف آیتم را تایید کند
const showWarningDeleteItem = (id) => {
  // اسکرول به بالای صفحه برای نمایش مودال
  window.scrollTo(0, 0);

  // نمایش پس‌زمینه تار و فعال‌سازی مودال
  backgroundBlur.classList.remove("hidden");
  backgroundBlur.classList.add("active");

  // بستن مودال با کلیک روی دکمه ضربدر
  closeBtnIcon.addEventListener("click", closeModal);

  // محتوای مودال هشدار
  modalMain.innerHTML = `
    <div dir="rtl" class="modal-main__warning-massage">
      <div class="warning-icon"><i class="fas fa-warning"></i></div>
      <p>ایا از حذف این ایتم اطمینان دارید ؟</p>
    </div>`;

  // دکمه‌های پایین مودال (تایید و انصراف)
  modalFooter.innerHTML = `
    <div id="accepte-remove-item" class="modal-footer__ok-btn">تایید</div>
    <div id="cancel-add-item" onclick='closeModal()' class="modal-footer__cancel-btn">انصراف</div>
  `;

  // رویداد کلیک روی دکمه تایید حذف
  document
    .getElementById("accepte-remove-item")
    .addEventListener("click", (event) => {
      // نمایش لودر هنگام پردازش حذف
      event.target.innerHTML = '<span class="loader-Modal"></span>';
      deleteItemDb(id);
    });
};
/* ------------------ مدیریت مودال ------------------ */
// بستن مودال و پاک کردن محتوا
const closeModal = () => {
  backgroundBlur.classList.add("hidden");
  backgroundBlur.classList.remove("active");
  modalMain.innerHTML = "";
  modalFooter.innerHTML = "";
};

/* ------------------ مرتب‌سازی آیتم‌ها ------------------ */
// تغییر گزینه مرتب‌سازی و رندر مجدد آیتم‌ها
const newValueSortOption = () => {
  const sortSelect = document.getElementById("sort-select");
  renderItemsSection(items, sortSelect.value);
};

/* ------------------ نمایش Toast ------------------ */
// نمایش پیام موفقیت یا خطا با SweetAlert
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

/* ------------------ افزودن آیتم جدید ------------------ */
// ارسال آیتم جدید به دیتابیس
const postNewItem = async (name, price, about = "", cat) => {
  let fullNameCategory = category.find((event) => event.english == cat);

  let item = {
    nameItem: name,
    priceItem: price,
    aboutItem: about,
    categoryItem: { ...fullNameCategory },
  };

  try {
    const response = await fetch(`${url}/items.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    getItems();
    document.getElementById("add-new-item").innerHTML = `تایید`;
    closeModal();
    callToast(true, "ایتم شما با موفقیت اضافه شد");
  } catch (error) {
    callToast(false, "ناموفق بود");
  }
};

/* ------------------ اعتبارسنجی افزودن آیتم ------------------ */
const validationAddItem = (name, price, about, category, how, arg = 0) => {
  if (name && !isNaN(price)) {
    if (how == "POST") {
      document.getElementById(
        "add-new-item"
      ).innerHTML = `<span class="loader-Modal"></span>`;

      postNewItem(name, price, about, category);
    } else if (how == "PUT") {
      document.getElementById(
        "update-item"
      ).innerHTML = `<span class="loader-Modal"></span>`;
      putNewItem(name, price, about, category, arg);
    }
  } else {
    if (isNaN(price)) {
      Swal.fire({
        icon: "error",
        title: "مشکل در ثبت ایتم!",
        text: "لطفا قیمت را به درستی وارد کنید",
        timer: 4000,
        theme: "dark",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "مشکل در ثبت ایتم!",
        text: "لطفا مقادیر را کامل پر کنید .",
        timer: 4000,
        theme: "dark",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }
};

/* ------------------ باز کردن مودال افزودن آیتم ------------------ */
const openModalAddItem = () => {
  window.scrollTo(0, 0);
  backgroundBlur.classList.remove("hidden");
  backgroundBlur.classList.add("active");

  closeBtnIcon.addEventListener("click", closeModal);

  // محتوای مودال
  modalMain.innerHTML = `
    <div class="modal-main__title">افزودن آیتم جدید</div>
    <input type="text" dir="rtl" id="name-item" placeholder="نام آیتم جدید ..." class="modal-main__input" />
    <input type="text" dir="rtl" id="price-item" placeholder="قیمت آیتم جدید ..." class="modal-main__input"/>
    <textarea dir="rtl" id="about-item" placeholder="توضیحات ایتم جدید (اختیاری) ..." class="modal-main__textarea"></textarea>
    <select dir="rtl" id="categiry-item"  class="modal-main__select" name="category"></select>
  `;

  let nameItem = document.getElementById("name-item");
  let priceItem = document.getElementById("price-item");
  let aboutItem = document.getElementById("about-item");
  let categiryItem = document.getElementById("categiry-item");

  // دکمه‌های پایین مودال
  modalFooter.innerHTML = `
    <div id="add-new-item"  class="modal-footer__ok-btn">تایید</div>
    <div id="cancel-add-item" onclick='closeModal()'  class="modal-footer__cancel-btn">انصراف</div>
  `;

  // رویداد ثبت آیتم
  document.getElementById("add-new-item").addEventListener("click", () => {
    const name = nameItem.value.trim();
    const price = priceItem.value.trim();
    const about = aboutItem.value.trim();
    const category = categiryItem.value;

    validationAddItem(name, price, about, category, "POST");
  });

  // بارگذاری دسته‌بندی‌ها در select
  const modalMainSelect = document.querySelector(".modal-main__select");
  modalMainSelect.innerHTML = "";

  if (category.length === 0) {
    modalMainSelect.innerHTML = `<option disabled selected>دسته‌بندی‌ها بارگذاری نشده‌اند</option>`;
    return;
  }

  category.forEach((cat) => {
    modalMainSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${cat.english}">${cat.farsi}</option>`
    );
  });
};

/* ------------------ اعتبارسنجی کاربر ------------------ */
const validationUser = () => {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("id");

  if (username && userId) {
    const userNameElem = document.querySelector(".welcome-user-name");
    userNameElem.innerHTML = username;
    return true;
  }

  Swal.fire({
    icon: "error",
    title: "دسترسی غیرمجاز!",
    theme: "dark",
    text: "شما لاگین نیستید.",
    timer: 4000,
    timerProgressBar: true,
    showConfirmButton: false,
    didClose: () => {
      window.location.href = "./login.html";
    },
  });

  return false;
};

/* ------------------ دریافت آیتم‌ها ------------------ */
const getItems = async () => {
  try {
    const loaderContiner = document.querySelector(".loader-continer");

    const response = await fetch(`${url}/items.json`);
    const resultDB = await response.json();
    if (!resultDB) {
      items = [];
      renderItemsSection(items, "all");
      loaderContiner.classList.add("hidden");
      return;
    }

    // تبدیل داده‌ها به آرایه آیتم‌ها
    items = Object.entries(resultDB).map(([id, value]) => ({
      ...value,
      id,
    }));

    loaderContiner.classList.add("hidden");
    renderItemsSection(items, "all");
  } catch (error) {
    callToast(false, "ناموفق در دریافت ایتم ها");
  }
};

/* ------------------ دریافت دسته‌بندی‌ها ------------------ */
const getCategoryItem = async () => {
  try {
    const response = await fetch(`${url}/category.json`);
    const resultDB = await response.json();
// اگر دیتابیس دسته‌بندی‌ها خالی بود
    if (!resultDB) {
      category = [];
      renderSortOptions(); // همچنان گزینه "همه" رو نشون بده
      creatItemBtn.addEventListener("click", openModalAddItem);
      return;
    }

    // تبدیل داده‌ها به آرایه دسته‌بندی‌ها
    category = Object.entries(resultDB).map(([id, value]) => ({
      ...value,
      id,
    }));

    getItems();
    renderSortOptions();
    creatItemBtn.addEventListener("click", openModalAddItem);

  } catch (error) {
    callToast(false, "ناموفق در لود صفحه لطفا رفرش کنید .");
  }
};
/* ------------------ درج آیتم‌ها در DOM ------------------ */
// این فانکشن لیست آیتم‌ها رو گرفته و به صورت کارت در بخش items-continer نمایش می‌دهد
const insertItemInDom = (items) => {
  const itemsContiner = document.querySelector(".items-continer");
  itemsContiner.innerHTML = ""; // پاک کردن محتوای قبلی

  items.forEach((item) => {
    let { nameItem, priceItem, aboutItem, categoryItem, id } = item;

    itemsContiner.insertAdjacentHTML(
      "beforeend",
      `<div id="${id}" dir="ltr" class="item-cart">
          <div class="item-cart__name-price">
            <div class="item-cart__price">
              <p>تومان</p>
              <b>${formatNumber(priceItem)}</b>
            </div>
            <div class="item-cart__name">${nameItem}</div>
          </div>
          <div class="item-cart__about">${aboutItem}</div>
          <div class="item-cart__cat">
            <h1>${categoryItem.farsi}</h1>
            <p>: دسته بندی</p>
          </div>
          <div class="item-cart__btn-section">
            <div onclick='openUpdateModal(${JSON.stringify(
              item
            )})' class="item-cart__update-btn">
              <i class="fas fa-pen"></i>
            </div>
            <div onclick="showWarningDeleteItem('${id}')" class="item-cart__remove-btn">
              <i  class="fas fa-trash"></i>
            </div>
          </div>
        </div>`
    );
  });
};

/* ------------------ رندر آیتم‌ها ------------------ */
// این فانکشن آیتم‌ها را بر اساس نوع مرتب‌سازی (همه یا دسته‌بندی خاص) نمایش می‌دهد
const renderItemsSection = (items, sort) => {
  if (sort == "all") {
    // نمایش همه آیتم‌ها
    insertItemInDom(items);
  } else {
    // نمایش آیتم‌ها بر اساس دسته‌بندی انتخابی
    let itemFillter = items.filter(
      (item) => item["categoryItem"]["english"] === sort
    );
    insertItemInDom(itemFillter);
  }
};
/* ------------------ رندر گزینه‌های مرتب‌سازی ------------------ */
const renderSortOptions = () => {
  const sortSelect = document.getElementById("sort-select");
  sortSelect.innerHTML = `<option value="all">همه</option>`;

  category.forEach((cat) => {
    sortSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${cat.english}">${cat.farsi}</option>`
    );
  });

  sortSelect.addEventListener("change", newValueSortOption);
};

/* ------------------ شروع برنامه ------------------ */
window.addEventListener("load", () => {
  if (validationUser()) {
    getCategoryItem();
  }
});
