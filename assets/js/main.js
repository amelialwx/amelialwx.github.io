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
  slidesPerView: 1,
  spaceBetween: 24,
  loop: true,
  grabCursor: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll("section[id]");
const NAV_HEADER_OFFSET = 58;

function scrollActive() {
  const scrollY = window.pageYOffset;

  /* Last section whose top we’ve scrolled past (fixes home never active at top:
     old code used scrollY > sectionTop, which fails when sectionTop > 0). */
  let currentSectionId = sections[0]?.getAttribute("id") || "home";

  sections.forEach((current) => {
    const sectionTop = current.offsetTop - NAV_HEADER_OFFSET;
    if (scrollY >= sectionTop - 1) {
      currentSectionId = current.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav__menu .nav__link").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.remove("active-link");
    if (href === `#${currentSectionId}`) {
      link.classList.add("active-link");
    }
  });
}

window.addEventListener("scroll", scrollActive);
scrollActive();

/* #home: native hash does nothing when already at top; always scroll to top + refresh spy */
document.querySelectorAll('.nav__menu .nav__link[href="#home"]').forEach((homeLink) => {
  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    const path = window.location.pathname + window.location.search + "#home";
    if (history.replaceState) {
      history.replaceState(null, "", path);
    } else {
      window.location.hash = "home";
    }
    /* scroll listener updates active link; instant scroll still fires scroll in most browsers */
    requestAnimationFrame(() => scrollActive());
  });
});

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById("theme-button");
const lightTheme = "light-theme";
const iconTheme = "bx-sun";

// Theme: inline <head> + theme-early.js set html/body; icon finalized in theme-early.
const getCurrentTheme = () =>
  document.documentElement.classList.contains(lightTheme) ? "light" : "dark";
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "bx bx-moon" : "bx bx-sun";

// Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  document.documentElement.classList.toggle(lightTheme);
  document.body.classList.toggle(lightTheme);
  themeButton.classList.toggle(iconTheme);
  // We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute(
      "content",
      getCurrentTheme() === "light" ? "#fcfcfd" : "#0b121e"
    );
  }
});

/*=============== SCROLL REVEAL ANIMATION ===============*/
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobileViewport = window.matchMedia("(max-width: 768px), (hover: none)").matches;

try {
  if (!prefersReducedMotion && typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      origin: "bottom",
      distance: isMobileViewport ? "40px" : "32px",
      duration: isMobileViewport ? 1100 : 800,
      delay: isMobileViewport ? 120 : 80,
      reset: false,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      opacity: 0,
      scale: 1,
      viewFactor: isMobileViewport ? 0.2 : 0.05,
      viewOffset: {
        top: 0,
        right: 0,
        bottom: isMobileViewport ? 40 : -100,
        left: 0,
      },
    });

    sr.reveal(`.section__subtitle, .section__title`, {
      origin: "top",
      distance: isMobileViewport ? "28px" : "24px",
      interval: isMobileViewport ? 80 : 50,
    });

    sr.reveal(`.about__img`, {
      origin: "left",
      distance: isMobileViewport ? "48px" : "60px",
    });

    sr.reveal(`.about__data, .about__description, .about__button-contact`, {
      origin: "right",
      distance: isMobileViewport ? "48px" : "60px",
    });

    sr.reveal(`.skills__content`, {
      origin: "bottom",
      distance: isMobileViewport ? "40px" : "48px",
      interval: isMobileViewport ? 120 : 100,
    });

    sr.reveal(`.experience__container`, {
      origin: "bottom",
      distance: isMobileViewport ? "40px" : "48px",
    });

    sr.reveal(`.experience__title, .experience__button`, {
      origin: "top",
      distance: isMobileViewport ? "28px" : "32px",
      interval: isMobileViewport ? 90 : 70,
    });

    sr.reveal(`.work__filters`, {
      origin: "top",
      distance: isMobileViewport ? "24px" : "28px",
    });

    sr.reveal(`.work__card`, {
      origin: "bottom",
      distance: isMobileViewport ? "40px" : "48px",
      interval: isMobileViewport ? 110 : 90,
    });

    sr.reveal(`.education__container`, {
      origin: "bottom",
      distance: isMobileViewport ? "40px" : "48px",
    });

    sr.reveal(`.contact__info, .contact__title-info`, {
      origin: "left",
      distance: isMobileViewport ? "48px" : "60px",
    });

    sr.reveal(`.contact__form, .contact__title-form`, {
      origin: "right",
      distance: isMobileViewport ? "48px" : "60px",
    });

    sr.reveal(`.footer__container`, {
      origin: "bottom",
      distance: isMobileViewport ? "32px" : "40px",
    });
  }
} finally {
  /* SR often applies initial styles on the next frame; wait so we don’t lift the
     veil one frame too early (visible “full page” flash). */
  const done = () => document.documentElement.classList.remove("sr-pending");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(done);
    });
  });
}

/*=============== FOOTER YEAR ===============*/
const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
