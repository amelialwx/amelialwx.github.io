(() => {
  const themeButton = document.getElementById("theme-button");
  const lightTheme = "light-theme";
  const iconTheme = "bx-sun";
  const getCurrentTheme = () =>
    (document.documentElement.classList.contains(lightTheme) ? "light" : "dark");
  const getCurrentIcon = () => (themeButton.classList.contains(iconTheme) ? "bx bx-moon" : "bx bx-sun");

  themeButton.addEventListener("click", () => {
    document.documentElement.classList.toggle(lightTheme);
    document.body.classList.toggle(lightTheme);
    themeButton.classList.toggle(iconTheme);
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
  });

  const monthLabel = document.getElementById("month-label");
  const calendarGrid = document.getElementById("calendar-grid");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");
  const selectedDateLabel = document.getElementById("selected-date-label");
  const loadError = document.getElementById("daily-log-load-error");
  const publicElements = {
    systemDesign: document.getElementById("public-system-design"),
    systemDesignLink: document.getElementById("public-system-design-link"),
    project: document.getElementById("public-project"),
    projectGithubLink: document.getElementById("public-project-github-link"),
    stockReflection: document.getElementById("public-stock-reflection"),
  };
  const publicStockWrapper = document.getElementById("public-stock-wrapper");

  const DATA_URL = "assets/data/daily-log.json";
  const EMPTY_ENTRIES = {};

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  /** @type {Record<string, Record<string, string>>} */
  let publishedEntries = { ...EMPTY_ENTRIES };

  function toDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function isWeekend(dateObj) {
    const day = dateObj.getDay();
    return day === 0 || day === 6;
  }
  function hasAnyContent(entry) {
    return Object.values(entry || {}).some((value) => typeof value === "string" && value.trim().length > 0);
  }

  async function loadPublishedEntries() {
    loadError.textContent = "";
    try {
      const res = await fetch(DATA_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      publishedEntries = data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch {
      publishedEntries = {};
      loadError.textContent = "Couldn’t load published log (JSON missing or invalid).";
    }
  }

  function setPublicValue(element, value, emptyFallback) {
    const text = (value || "").trim();
    if (text) {
      element.textContent = text;
      element.classList.remove("daily-log__public-value--empty");
      return;
    }
    element.textContent = emptyFallback;
    element.classList.add("daily-log__public-value--empty");
  }

  function setPublicLink(element, hrefValue, linkLabel = "Link") {
    const href = (hrefValue || "").trim();
    if (href) {
      element.textContent = linkLabel;
      element.href = href;
      element.target = "_blank";
      element.rel = "noopener noreferrer";
      element.classList.remove("daily-log__link-chip--empty");
      return;
    }
    element.textContent = "—";
    element.removeAttribute("href");
    element.removeAttribute("target");
    element.removeAttribute("rel");
    element.classList.add("daily-log__link-chip--empty");
  }

  function setVisibleAsGrid(element, visible) {
    element.style.display = visible ? "grid" : "none";
  }

  function renderCalendar() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    monthLabel.textContent = viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i += 1) {
      const blank = document.createElement("div");
      blank.className = "daily-log__day daily-log__day--muted";
      blank.setAttribute("aria-hidden", "true");
      calendarGrid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateObj = new Date(year, month, day);
      const dateKey = toDateKey(dateObj);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "daily-log__day";
      button.textContent = String(day);
      if (dateKey === toDateKey(selectedDate)) button.classList.add("daily-log__day--selected");
      if (hasAnyContent(publishedEntries[dateKey])) button.classList.add("daily-log__day--saved");

      button.addEventListener("click", () => {
        selectedDate = dateObj;
        renderCalendar();
        renderEntryPanel();
      });
      calendarGrid.appendChild(button);
    }
  }

  function renderEntryPanel() {
    const dateKey = toDateKey(selectedDate);
    const weekend = isWeekend(selectedDate);
    const entry = publishedEntries[dateKey] || {};

    selectedDateLabel.textContent = selectedDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    setPublicValue(publicElements.systemDesign, entry.systemDesign, "No update shared for this day yet.");
    setPublicLink(publicElements.systemDesignLink, entry.systemDesignLink);
    setPublicValue(publicElements.project, entry.project, "No update shared for this day yet.");
    setPublicLink(publicElements.projectGithubLink, entry.projectGithubLink, "GitHub");
    setPublicValue(publicElements.stockReflection, entry.stockReflection, "No day trading reflection shared for this day.");

    if (weekend) {
      setVisibleAsGrid(publicStockWrapper, false);
    } else {
      setVisibleAsGrid(publicStockWrapper, true);
    }
  }

  prevMonthBtn.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
  });

  let dailyLogRevealDone = false;
  function initDailyLogScrollReveal() {
    if (dailyLogRevealDone) return;
    dailyLogRevealDone = true;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      if (!prefersReducedMotion && typeof ScrollReveal !== "undefined") {
        const sr = ScrollReveal({
          origin: "top",
          distance: "32px",
          duration: 900,
          delay: 120,
          reset: true,
          viewFactor: 0.15,
          viewOffset: { top: 48, right: 0, bottom: 72, left: 0 },
        });

        sr.reveal(".daily-log__heading .section__subtitle", {
          delay: 50,
          origin: "top",
          distance: "18px",
        });
        sr.reveal(".daily-log__heading .section__title", {
          delay: 70,
          origin: "top",
          distance: "18px",
        });

        sr.reveal(".daily-log__intro", {
          delay: 90,
          scale: 0.96,
          origin: "top",
          distance: "22px",
        });
        sr.reveal(".daily-log__intro", {
          delay: 110,
          scale: 0.99,
          origin: "top",
          distance: "12px",
        });

        sr.reveal(".daily-log__calendar-card", {
          delay: 130,
          scale: 0.96,
          origin: "left",
          distance: "26px",
        });
        sr.reveal(".daily-log__calendar-card", {
          delay: 150,
          scale: 0.99,
          origin: "left",
          distance: "14px",
        });

        sr.reveal("#entry-panel", {
          delay: 150,
          scale: 0.96,
          origin: "right",
          distance: "26px",
        });
        sr.reveal("#entry-panel", {
          delay: 170,
          scale: 0.99,
          origin: "right",
          distance: "14px",
        });
      }
    } finally {
      const done = () => document.documentElement.classList.remove("sr-pending");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(done);
        });
      });
    }
  }

  (async () => {
    await loadPublishedEntries();
    renderCalendar();
    renderEntryPanel();
    initDailyLogScrollReveal();
  })();
})();
