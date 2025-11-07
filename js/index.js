
const headerLogin = document.querySelector('.header__login')


headerLogin.addEventListener('click',() =>{
    Swal.fire({
  icon: 'warning',
  theme: 'dark',
  title: 'دسترسی محدود!',
  text: 'فقط مدیران اجازه تأیید دارند. اگر مدیر هستید، روی تأیید کلیک کنید.',
  showCancelButton: true,
  confirmButtonText: 'تأیید',
  cancelButtonText: 'لغو',
  customClass: {
    popup: 'swal2-popup'
  }
}).then((result) => {
  if (result.isConfirmed) {
    window.location.href = './login.html'
  }
})
})