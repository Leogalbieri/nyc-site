// BOTÃO HAMBURGUER E MENU MOBILE

const btn = document.getElementById("menuBtn");
  const drawer = document.getElementById("drawer");

  btn.addEventListener("click", () => {
    const open = drawer.classList.toggle("is-open");
    drawer.setAttribute("aria-hidden", String(!open));
    btn.setAttribute("aria-expanded", String(open));
  });