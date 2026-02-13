/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
  const header = document.getElementById("header");
  // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 50) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*=============== EXPERIENCE MODAL ===============*/
// Get the modal
const expModalViews = document.querySelectorAll(".experience__modal"),
  expModalBtns = document.querySelectorAll(".experience__button"),
  expModalClose = document.querySelectorAll(".experience__modal-close");

// Function to open the modal
let expModal = function (modalClick) {
  expModalViews[modalClick].classList.add("active-exp-modal");
};

// Function to close the modal
let expCloseModal = function () {
  expModalViews.forEach((mv) => {
    mv.classList.remove("active-exp-modal");
  });
};

// Event listener for each modal button to open the modal
expModalBtns.forEach((mb, i) => {
  mb.addEventListener("click", () => {
    expModal(i);
    console.log(i)
  });
});

// Event listener for each close button to close the modal
expModalClose.forEach((mc) => {
  mc.addEventListener("click", expCloseModal);
});

// Event listener for clicking outside the modal content
expModalViews.forEach((mv) => {
  mv.addEventListener("click", function(event) {
    // Checking if the clicked area is the modal content or its children
    if (event.target === this) {
      expCloseModal();
    }
  });
});

// Prevent modal content click from closing the modal
document.querySelectorAll(".experience__modal-content").forEach((content) => {
  content.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevents the modal from closing when clicking inside
  });
});

/*=============== WORK MODAL ===============*/
// Get the modal
const workModalViews = document.querySelectorAll(".work__modal"),
  workModalBtns = document.querySelectorAll(".work__button"),
  workModalClose = document.querySelectorAll(".work__modal-close");

// Function to open the modal
let workModal = function (modalClick) {
  workModalViews[modalClick].classList.add("active-work-modal");
};

// Function to close the modal
let workCloseModal = function () {
  workModalViews.forEach((mv) => {
    mv.classList.remove("active-work-modal");
  });
};

// Event listener for each modal button to open the modal
workModalBtns.forEach((mb, i) => {
  mb.addEventListener("click", () => {
    workModal(i);
    console.log(i)
  });
});

// Event listener for each close button to close the modal
workModalClose.forEach((mc) => {
  mc.addEventListener("click", workCloseModal);
});

// Event listener for clicking outside the modal content
workModalViews.forEach((mv) => {
  mv.addEventListener("click", function(event) {
    // Checking if the clicked area is the modal content or its children
    if (event.target === this) {
      workCloseModal();
    }
  });
});

// Prevent modal content click from closing the modal
document.querySelectorAll(".experience__modal-content").forEach((content) => {
  content.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevents the modal from closing when clicking inside
  });
});

/*=============== MIXITUP FILTER PORTFOLIO ===============*/

let mixer = mixitup(".work__container", {
  selectors: {
    target: ".work__card",
  },
  animation: {
    duration: 300,
  },
});

/* Link active work */
const workLinks = document.querySelectorAll(".work__item");

function activeWork(workLink) {
  workLinks.forEach((wl) => {
    wl.classList.remove("active-work");
  });
  workLink.classList.add("active-work");
}

workLinks.forEach((wl) => {
  wl.addEventListener("click", () => {
    activeWork(wl);
  });
});

/*=============== SWIPER EDUCATION ===============*/

let swiperEducation = new Swiper(".education__container", {
  spaceBetween: 24,
  loop: true,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 48,
    },
  },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById("theme-button");
const lightTheme = "light-theme";
const iconTheme = "bx-sun";

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// We obtain the current theme that the interface has by validating the light-theme class
const getCurrentTheme = () =>
  document.body.classList.contains(lightTheme) ? "dark" : "light";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "bx bx-moon" : "bx bx-sun";

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the light
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
    lightTheme
  );
  themeButton.classList[selectedIcon === "bx bx-moon" ? "add" : "remove"](
    iconTheme
  );
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  // Add or remove the light / icon theme
  document.body.classList.toggle(lightTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 400,
  reset: true,
});
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const sr = ScrollReveal({
    origin: "top",
    distance: "32px",
    duration: 900,
    delay: 120,
    reset: true,
    viewFactor: 0.2,
    viewOffset: { top: 50, right: 0, bottom: 80, left: 0 },
  });

sr.reveal(`.nav__menu`, {
  delay: 100,
  scale: 0.1,
  origin: "bottom",
  distance: "300px",
});
  sr.reveal(`.nav__menu`, {
    delay: 80,
    scale: 0.98,
    origin: "bottom",
    distance: "20px",
  });

sr.reveal(`.home__data`);
sr.reveal(`.home__handle`, {
  delay: 100,
});
  sr.reveal(`.home__data`, { delay: 140 });
  sr.reveal(`.home__handle`, {
    delay: 180,
  });

sr.reveal(`.home__social, .home__scroll`, {
  delay: 100,
  origin: "bottom",
});
  sr.reveal(`.home__social, .home__scroll`, {
    delay: 180,
    origin: "bottom",
  });

sr.reveal(`.about__img`, {
  delay: 100,
  origin: "left",
  scale: 0.9,
  distance: "30px",
});
  sr.reveal(`.about__img`, {
    delay: 120,
    origin: "left",
    scale: 0.97,
  });

sr.reveal(`.about__data, .about__description, .about__button-contact`, {
  delay: 100,
  scale: 0.9,
  origin: "right",
  distance: "30px",
});
  sr.reveal(`.about__data, .about__description, .about__button-contact`, {
    delay: 120,
    scale: 0.97,
    origin: "right",
  });

sr.reveal(`.skills__content`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});
  sr.reveal(`.skills__content`, {
    delay: 120,
    scale: 0.97,
    origin: "bottom",
    interval: 100,
  });

sr.reveal(`.experience__title, experience__button`, {
  delay: 100,
  scale: 0.9,
  origin: "top",
  distance: "30px",
});
  sr.reveal(`.experience__title, .experience__button`, {
    delay: 120,
    scale: 0.97,
    origin: "top",
    interval: 80,
  });

sr.reveal(`.work__card`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});
  sr.reveal(`.work__card`, {
    delay: 120,
    scale: 0.97,
    origin: "bottom",
    interval: 100,
  });

sr.reveal(`.education__container`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});
  sr.reveal(`.education__container`, {
    delay: 120,
    scale: 0.97,
    origin: "bottom",
  });

sr.reveal(`.contact__info, .contact__title-info`, {
  delay: 100,
  scale: 0.9,
  origin: "left",
  distance: "30px",
});
  sr.reveal(`.contact__info, .contact__title-info`, {
    delay: 120,
    scale: 0.97,
    origin: "left",
  });

sr.reveal(`.contact__form, .contact__title-form`, {
  delay: 100,
  scale: 0.9,
  origin: "right",
  distance: "30px",
});
  sr.reveal(`.contact__form, .contact__title-form`, {
    delay: 120,
    scale: 0.97,
    origin: "right",
  });

sr.reveal(`.footer, footer__container`, {
  delay: 100,
  scale: 0.9,
  origin: "bottom",
  distance: "30px",
});
  sr.reveal(`.footer, .footer__container`, {
    delay: 120,
    scale: 0.97,
    origin: "bottom",
  });
}

/*=============== FOOTER YEAR ===============*/
const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
