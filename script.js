function changeSection() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const allSections = document.querySelectorAll(".tab");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      const activeSection = document.getElementById(target);

      if (activeSection) {
        allSections.forEach((section) => section.classList.add("disabled"));
        activeSection.classList.remove("disabled");
        window.scrollTo(0, 0);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  changeSection();
});
