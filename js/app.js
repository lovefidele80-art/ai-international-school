document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      const isOpen = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const languageSelect = document.getElementById("languageSelect");
  const mobileLanguageSelect = document.getElementById("mobileLanguageSelect");
  const supportedLanguages = ["en", "rw", "fr", "sw", "es", "pt", "de", "ar", "hi", "zh"];
  const languageNames = {
    en: "English", rw: "Kinyarwanda", fr: "Français", sw: "Kiswahili", es: "Español",
    pt: "Português", de: "Deutsch", ar: "العربية", hi: "हिन्दी", zh: "中文"
  };

  const saved = localStorage.getItem("aisc_language");
  const initialLanguage = supportedLanguages.includes(saved) ? saved : "en";

  function setKey(element, key) {
    if (element) element.setAttribute("data-i18n-key", key);
  }

  function prepareTranslations() {
    const bySelector = {
      ".brand-name": "brandName",
      ".main-nav a:nth-child(1)": "navHome",
      ".main-nav a:nth-child(2)": "navLearning",
      ".main-nav a:nth-child(3)": "navHow",
      ".main-nav a:nth-child(4)": "navAI",
      ".main-nav a:nth-child(5)": "navAbout",
      ".login-link": "navLogin",
      ".header-actions .btn-primary": "navGetStarted",
      ".mobile-menu > a:nth-of-type(1)": "navHome",
      ".mobile-menu > a:nth-of-type(2)": "navLearning",
      ".mobile-menu > a:nth-of-type(3)": "navHow",
      ".mobile-menu > a:nth-of-type(4)": "navAI",
      ".mobile-menu > a:nth-of-type(5)": "navAbout",
      ".mobile-menu > a:nth-of-type(6)": "navLogin",
      ".mobile-menu > a:nth-of-type(7)": "navGetStarted",
      ".hero-badge": "heroBadge",
      ".hero h1": "heroTitle",
      ".hero-text > p": "heroDescription",
      ".hero-actions .btn-primary": "startLearning",
      ".hero-actions .btn-secondary": "exploreLearning",
      ".hero-note span:nth-child(1)": "age",
      ".hero-note span:nth-child(3)": "readiness",
      ".card-label": "journeyLabel",
      ".card-status": "ready",
      ".learning-card h2": "journeyTitle",
      ".learning-card > p": "journeyDescription",
      ".progress-info span": "structure",
      ".progress-info strong": "connected",
      ".features .section-label": "featuresLabel",
      ".features .section-heading h2": "featuresTitle",
      ".features .section-heading p": "featuresDescription",
      ".feature-card:nth-child(1) h3": "curriculumTitle",
      ".feature-card:nth-child(1) p": "curriculumText",
      ".feature-card:nth-child(2) h3": "aiTitle",
      ".feature-card:nth-child(2) p": "aiText",
      ".feature-card:nth-child(3) h3": "stageTitle",
      ".feature-card:nth-child(3) p": "stageText",
      ".feature-card:nth-child(4) h3": "practiceTitle",
      ".feature-card:nth-child(4) p": "practiceText",
      ".feature-card:nth-child(5) h3": "labTitle",
      ".feature-card:nth-child(5) p": "labText",
      ".feature-card:nth-child(6) h3": "progressTitle",
      ".feature-card:nth-child(6) p": "progressText",
      ".levels .section-label": "levelsLabel",
      ".levels .section-heading h2": "levelsTitle",
      ".levels .section-heading p": "levelsDescription",
      ".level-card:nth-child(1) h3": "primary",
      ".level-card:nth-child(1) p": "p1p6",
      ".level-card:nth-child(1) a": "explorePrimary",
      ".level-card:nth-child(2) h3": "ordinary",
      ".level-card:nth-child(2) p": "s1s3",
      ".level-card:nth-child(2) a": "exploreOrdinary",
      ".level-card:nth-child(3) h3": "advanced",
      ".level-card:nth-child(3) p": "s4s6",
      ".level-card:nth-child(3) a": "exploreSecondary",
      ".level-card:nth-child(4) h3": "vocational",
      ".level-card:nth-child(4) p": "vocationalText",
      ".level-card:nth-child(4) a": "explorePrograms",
      ".how-it-works .section-label": "howLabel",
      ".how-it-works .section-heading h2": "howTitle",
      ".how-it-works .section-heading p": "howDescription",
      ".step:nth-child(1) h3": "step1Title",
      ".step:nth-child(1) p": "step1Text",
      ".step:nth-child(2) h3": "step2Title",
      ".step:nth-child(2) p": "step2Text",
      ".step:nth-child(3) h3": "step3Title",
      ".step:nth-child(3) p": "step3Text",
      ".step:nth-child(4) h3": "step4Title",
      ".step:nth-child(4) p": "step4Text",
      ".cta-card .section-label": "ctaLabel",
      ".cta-card h2": "ctaTitle",
      ".cta-card p": "ctaText",
      ".cta-card .btn": "navGetStarted",
      ".site-footer h3": "brandName",
      ".site-footer > .footer-content p": "footerText",
      ".footer-links a:nth-child(1)": "navHome",
      ".footer-links a:nth-child(2)": "navLearning",
      ".footer-links a:nth-child(3)": "navLogin",
      ".footer-links a:nth-child(4)": "footerSignup",
      ".footer-bottom p": "copyright"
    };

    Object.keys(bySelector).forEach(function (selector) {
      setKey(document.querySelector(selector), bySelector[selector]);
    });

    document.querySelectorAll(".main-nav a, .mobile-menu a, .footer-links a").forEach(function (el) {
      el.removeAttribute("data-i18n-source");
    });
  }

  function translate(language) {
    const dictionary = window.AISC_TRANSLATIONS && window.AISC_TRANSLATIONS[language]
      ? window.AISC_TRANSLATIONS[language]
      : window.AISC_TRANSLATIONS.en;

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("aisc_language", language);

    document.querySelectorAll("[data-i18n-key]").forEach(function (element) {
      const key = element.getAttribute("data-i18n-key");
      if (dictionary[key] !== undefined) {
        if (key === "heroTitle") {
          element.innerHTML = dictionary[key];
        } else {
          element.textContent = dictionary[key];
        }
      }
    });

    const currentName = languageNames[language] || languageNames.en;
    const currentLanguage = document.getElementById("currentLanguage");
    const mobileCurrentLanguage = document.getElementById("mobileCurrentLanguage");
    if (currentLanguage) currentLanguage.textContent = currentName;
    if (mobileCurrentLanguage) mobileCurrentLanguage.textContent = currentName;

    if (languageSelect) languageSelect.value = language;
    if (mobileLanguageSelect) mobileLanguageSelect.value = language;

    if (languageSelect) languageSelect.setAttribute("aria-label", dictionary.chooseLanguage);
    if (mobileLanguageSelect) mobileLanguageSelect.setAttribute("aria-label", dictionary.chooseLanguage);
    if (menuButton) menuButton.setAttribute("aria-label", language === "ar" ? "فتح القائمة" : language === "rw" ? "Fungura menu" : "Open menu");

    document.title = language === "en" ? "AI International School" : dictionary.brandName;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", dictionary.heroDescription);
  }

  prepareTranslations();

  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      translate(this.value);
    });
  }

  if (mobileLanguageSelect) {
    mobileLanguageSelect.addEventListener("change", function () {
      translate(this.value);
    });
  }

  translate(initialLanguage);
});
