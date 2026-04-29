const section = document.querySelector("section:has(#siap-heading)");
const cover = document.getElementById("gray-cover");
const heading = document.getElementById("siap-heading-wrapper");
// Navbar thingy
const btn = document.getElementById("open-menu");
const menuBg = document.getElementById("menu-bg");
const menuContent = document.getElementById("menu-content");
const menu = document.getElementById("mega-menu");
const burgerLines = document.querySelectorAll(".burger-line");
let open = false;

if (section && cover && heading) {
  window.addEventListener("scroll", () => {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const progress = Math.min(
      Math.max(-rect.top / (sectionHeight * 0.5), 0),
      1,
    );

    const translateY = (1 - progress) * 150;
    cover.style.transform = `translateY(${translateY}%)`;
    const opacity = 0.5 + progress * 50;
    const scale = 0.85 + progress * 0.15;
    heading.style.opacity = opacity;
    heading.style.transform = `scale(${scale})`;
  });
}

// Leaflet thingy
if (document.getElementById("map")) {
  let map = L.map("map").setView([51.505, -0.09], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([44.399696, -73.205353])
    .addTo(map)
    .bindPopup("The Libooks Library, Shelburne")
    .openPopup();
}

// Navbar toggle
btn.addEventListener("click", () => {
  open = !open;
  if (open) {
    menu.style.pointerEvents = "all";
    menuBg.style.transform = "scaleY(1)";
    menuContent.style.opacity = "1";
    burgerLines[0].style.transform = "translateY(3.5px) rotate(45deg)";
    burgerLines[1].style.transform = "translateY(-3.5px) rotate(-45deg)";
  } else {
    menu.style.pointerEvents = "none";
    menuBg.style.transform = "scaleY(0)";
    menuContent.style.opacity = "0";
    burgerLines[0].style.transform = "";
    burgerLines[1].style.transform = "";
  }
});

// Borrow scroll
(function () {
  function initBorrowScroll() {
    if (window.innerWidth < 1024) return;

    const borrowSection = document.getElementById("borrow-scroll-section");
    const cards = [
      document.getElementById("borrow-card-0"),
      document.getElementById("borrow-card-1"),
      document.getElementById("borrow-card-2"),
    ];
    if (!borrowSection || cards.some((c) => !c)) return;

    const finalRotations = [-4, 3, -1];

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function onScroll() {
      const rect = borrowSection.getBoundingClientRect();
      const sectionHeight = borrowSection.offsetHeight;
      const viewH = window.innerHeight;
      const scrolled = -rect.top;
      const maxScroll = sectionHeight - viewH;
      const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1);

      cards.forEach((card, i) => {
        const cardStart = i * 0.28;
        const cardEnd = cardStart + 0.38;
        const t = Math.min(
          Math.max((progress - cardStart) / (cardEnd - cardStart), 0),
          1,
        );
        const ease = easeOutCubic(t);
        const translateY = (1 - ease) * 120;
        const opacity = ease;
        const rotate = finalRotations[i];
        card.style.transform = `translateY(${translateY}%) rotate(${rotate}deg)`;
        card.style.opacity = opacity;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBorrowScroll);
  } else {
    initBorrowScroll();
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initBorrowScroll, 150);
  });
})();

// Cursor
const cursor = document.getElementById("cursor");
const follower = document.getElementById("follower");

if (cursor && follower) {
  let mouseX = 0,
    mouseY = 0;
  let posX = 0,
    posY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function loop() {
    posX += (mouseX - posX) * 0.1;
    posY += (mouseY - posY) * 0.1;
    follower.style.left = `${posX}px`;
    follower.style.top = `${posY}px`;
    requestAnimationFrame(loop);
  }
  loop();
}
