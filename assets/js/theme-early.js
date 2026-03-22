/**
 * First <body> child: sync light-theme onto <body> (inline <head> already set <html>)
 * and restore the theme-toggle icon. External file can lag on slow networks; head script
 * prevents the wrong palette on first paint.
 */
(function () {
  try {
    var FIX_KEY = "theme-label-fix";
    var THEME_KEY = "selected-theme";
    var ICON_KEY = "selected-icon";
    var LIGHT_CLASS = "light-theme";
    var ICON_TOGGLE = "bx-sun";

    if (!localStorage.getItem(FIX_KEY)) {
      var legacy = localStorage.getItem(THEME_KEY);
      if (legacy === "dark") localStorage.setItem(THEME_KEY, "light");
      else if (legacy === "light") localStorage.setItem(THEME_KEY, "dark");
      localStorage.setItem(FIX_KEY, "1");
    }

    if (localStorage.getItem(THEME_KEY) === "light") {
      document.documentElement.classList.add(LIGHT_CLASS);
      document.body.classList.add(LIGHT_CLASS);
    }

    function applySavedIcon() {
      var btn = document.getElementById("theme-button");
      if (!btn) return;
      var selectedIcon = localStorage.getItem(ICON_KEY);
      if (selectedIcon === "bx bx-moon") btn.classList.add(ICON_TOGGLE);
      else if (selectedIcon === "bx bx-sun") btn.classList.remove(ICON_TOGGLE);
    }

    if (document.getElementById("theme-button")) {
      applySavedIcon();
    } else {
      document.addEventListener("DOMContentLoaded", applySavedIcon);
    }
  } catch (e) {
    /* ignore private mode / blocked storage */
  }
})();
