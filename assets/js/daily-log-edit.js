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
  const form = document.getElementById("daily-form");
  const clearDayButton = document.getElementById("clear-day");
  const saveStatus = document.getElementById("save-status");
  const privateFields = document.getElementById("private-fields");
  const stockReflectionWrapper = document.getElementById("stock-reflection-wrapper");
  const publicStockWrapper = document.getElementById("public-stock-wrapper");
  const publicView = document.getElementById("public-view");
  const downloadBtn = document.getElementById("download-json");
  const importInput = document.getElementById("import-json");
  const loadBanner = document.getElementById("edit-load-banner");

  const fields = {
    systemDesign: document.getElementById("system-design"),
    systemDesignLink: document.getElementById("system-design-link"),
    project: document.getElementById("project-work"),
    projectGithubLink: document.getElementById("project-github-link"),
    sql: document.getElementById("sql-question"),
    pythonData: document.getElementById("python-data"),
    leetcode: document.getElementById("leetcode"),
    stockReflection: document.getElementById("stock-reflection"),
  };

  const publicElements = {
    systemDesign: document.getElementById("public-system-design"),
    systemDesignLink: document.getElementById("public-system-design-link"),
    project: document.getElementById("public-project"),
    projectGithubLink: document.getElementById("public-project-github-link"),
    stockReflection: document.getElementById("public-stock-reflection"),
  };

  const DATA_URL = "assets/data/daily-log.json";
  const PRIVATE_LOCAL_KEY = "daily-log-private-local-v1";
  const EMPTY_ENTRIES = {};

  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  /** @type {Record<string, Record<string, string>>} */
  let publicEntries = { ...EMPTY_ENTRIES };

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

  function loadPrivateEntries() {
    try {
      const raw = localStorage.getItem(PRIVATE_LOCAL_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function savePrivateEntries(entries) {
    localStorage.setItem(PRIVATE_LOCAL_KEY, JSON.stringify(entries));
  }

  async function loadPublishedFromRepo() {
    loadBanner.textContent = "";
    try {
      const res = await fetch(DATA_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      publicEntries = data && typeof data === "object" && !Array.isArray(data) ? data : {};
    } catch {
      publicEntries = {};
      loadBanner.textContent =
        "Couldn’t load assets/data/daily-log.json from the server. Use Import to load a copy, or start fresh.";
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
    const privateEntries = loadPrivateEntries();

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
      if (hasAnyContent(publicEntries[dateKey]) || hasAnyContent(privateEntries[dateKey]))
        button.classList.add("daily-log__day--saved");

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
    const publicEntry = publicEntries[dateKey] || {};
    const privateEntry = loadPrivateEntries()[dateKey] || {};

    selectedDateLabel.textContent = selectedDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    setPublicValue(publicElements.systemDesign, publicEntry.systemDesign, "No public content for this day yet.");
    setPublicLink(publicElements.systemDesignLink, publicEntry.systemDesignLink);
    setPublicValue(publicElements.project, publicEntry.project, "No public content for this day yet.");
    setPublicLink(publicElements.projectGithubLink, publicEntry.projectGithubLink, "GitHub");
    setPublicValue(publicElements.stockReflection, publicEntry.stockReflection, "No day trading line for this day.");

    fields.systemDesign.value = publicEntry.systemDesign || "";
    fields.systemDesignLink.value = publicEntry.systemDesignLink || "";
    fields.project.value = publicEntry.project || "";
    fields.projectGithubLink.value = publicEntry.projectGithubLink || "";
    fields.stockReflection.value = publicEntry.stockReflection || "";
    fields.sql.value = privateEntry.sql || "";
    fields.pythonData.value = privateEntry.pythonData || "";
    fields.leetcode.value = privateEntry.leetcode || "";

    /* Form: always show so weekday notes can be edited after viewing a weekend, etc. */
    setVisibleAsGrid(stockReflectionWrapper, true);
    /* Public preview only: hide day-trading block on weekends (matches daily-log.html) */
    setVisibleAsGrid(publicStockWrapper, !weekend);

    publicView.classList.add("hidden");
    form.classList.remove("hidden");
    privateFields.classList.remove("hidden");
    saveStatus.textContent = "";
  }

  prevMonthBtn.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
  });
  nextMonthBtn.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const dateKey = toDateKey(selectedDate);

    publicEntries[dateKey] = {
      systemDesign: fields.systemDesign.value.trim(),
      systemDesignLink: fields.systemDesignLink.value.trim(),
      project: fields.project.value.trim(),
      projectGithubLink: fields.projectGithubLink.value.trim(),
      stockReflection: fields.stockReflection.value.trim(),
    };

    const privateEntries = loadPrivateEntries();
    privateEntries[dateKey] = {
      sql: fields.sql.value.trim(),
      pythonData: fields.pythonData.value.trim(),
      leetcode: fields.leetcode.value.trim(),
    };
    savePrivateEntries(privateEntries);

    renderCalendar();
    renderEntryPanel();
    saveStatus.textContent = "Saved in this browser. Download JSON and commit to publish public entries.";
  });

  clearDayButton.addEventListener("click", () => {
    const dateKey = toDateKey(selectedDate);
    delete publicEntries[dateKey];
    const privateEntries = loadPrivateEntries();
    delete privateEntries[dateKey];
    savePrivateEntries(privateEntries);
    renderCalendar();
    renderEntryPanel();
    saveStatus.textContent = "Cleared this date (in browser). Download JSON if you changed public fields.";
  });

  downloadBtn.addEventListener("click", () => {
    const blob = new Blob([`${JSON.stringify(publicEntries, null, 2)}\n`], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "daily-log.json";
    a.click();
    URL.revokeObjectURL(a.href);
    saveStatus.textContent = "Replace assets/data/daily-log.json in your repo with this file, then push.";
  });

  importInput.addEventListener("change", () => {
    const file = importInput.files && importInput.files[0];
    importInput.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        publicEntries = data && typeof data === "object" && !Array.isArray(data) ? data : {};
        renderCalendar();
        renderEntryPanel();
        saveStatus.textContent = "Imported public entries from file.";
      } catch {
        saveStatus.textContent = "That file isn’t valid JSON.";
      }
    };
    reader.readAsText(file);
  });

  (async () => {
    await loadPublishedFromRepo();
    renderCalendar();
    renderEntryPanel();
  })();
})();
