document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menuButton");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuButton || !mobileMenu) {
    return;
  }

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
});
