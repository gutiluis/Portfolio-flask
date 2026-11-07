const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

menuButton.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.toggle("hidden");

    menuButton.textContent = isHidden ? "☰" : "✕";
    menuButton.setAttribute("aria-expanded", String(!isHidden));
});
