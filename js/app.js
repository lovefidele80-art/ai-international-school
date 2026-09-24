document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const languageSelect = document.getElementById("languageSelect");
  const mobileLanguageSelect = document.getElementById("mobileLanguageSelect");

  const savedLanguage = localStorage.getItem("aisc_language") || "en";

  function applyLanguage(language) {
    localStorage.setItem("aisc_language", language);

    document.documentElement.lang = language;

    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    if (languageSelect) languageSelect.value = language;
    if (mobileLanguageSelect) mobileLanguageSelect.value = language;
  }

  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      applyLanguage(this.value);
      if (mobileLanguageSelect) mobileLanguageSelect.value = this.value;
    });
  }

  if (mobileLanguageSelect) {
    mobileLanguageSelect.addEventListener("change", function () {
      applyLanguage(this.value);
      if (languageSelect) languageSelect.value = this.value;
    });
  }

  applyLanguage(savedLanguage);
});
