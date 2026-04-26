const popoverData = {
  skod_skov: {
    title: "Skodskov",
    content: `
      <h2>NPC'er</h2>
      <p></p>
      <h2>Materialer</h2>
      <p></p>
      <h2>Andre detaljer</h2>
      <p></p>
    `,
  },
  krukke_by: {
    title: "Krukkeby",
    content: `
      <h2>NPC'er</h2>
      <p>Krukken Dhavi</p>
      <h2>Materialer</h2>
      <p>Sten (skåret)</p>
      <h2>Andre detaljer</h2>
      <p></p>
    `,
  },
  marken: {
    title: "Marken",
    content: `

      <h2>NPC'er</h2> 
      <p></p>
      <h2>Materialer</h2>
     
      <h2>Andre detaljer</h2>
      <p></p>
    `,
  },
  orkaløb: {
    title: "Orkaløb",
    content: `

      <h2>NPC'er</h2>
      <p>Tom Fløjtemand</p>
      <h2>Materialer</h2>
      <p>Siv</p>
      <p>Vand</p>
      <h2>Andre detaljer</h2>
      <p>Floden er næsten fuldstændigt stoppet af en bæverdæmning.</p>
    `,
  },
  stenbruddet: {
    title: "Stenbruddet",
    content: `

      <h2>NPC'er</h2>
      <p></p>
      <h2>Materialer</h2>
      <p></p>
      <h2>Andre detaljer</h2>
      <p></p>
    `,
  },
  den_gamle_molle: {
    title: "Den gamle mølle",
    content: `

      <h2>NPC'er</h2>
      <p></p>
      <h2>Materialer</h2>
      <p>Mursten</p>
      <p>Træ (behandlet)</p>
      <p>Trætønder</p>
      <h2>Andre detaljer</h2>
      <p></p>
    `,
  },
};

// --- Popover element (injected into the page) ---
const popover = document.createElement("div");
popover.id = "map-popover";
popover.innerHTML = `
  <button id="map-popover-close" aria-label="Luk">&times;</button>
  <h2 id="map-popover-title"></h2>
  <div id="map-popover-body"></div>
`;
document.body.appendChild(popover);

const popTitle = document.getElementById("map-popover-title");
const popBody = document.getElementById("map-popover-body");
const popClose = document.getElementById("map-popover-close");

function showPopover(id, triggerEl) {
  const data = popoverData[id];
  if (!data) return;

  popTitle.textContent = data.title;
  popBody.innerHTML = data.content;

  // Position near the group's bounding box
  const svgEl = document.getElementById("Layer_1");
  const bbox = triggerEl.getBoundingClientRect();
  const svgBox = svgEl.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  let top = bbox.top + scrollY - popover.offsetHeight - 12;
  let left = bbox.left + scrollX + bbox.width / 2 - 160; // 160 = half of 320px width

  // Flip below if too close to top of viewport
  if (top < scrollY + 8) {
    top = bbox.bottom + scrollY + 12;
  }

  // Clamp to viewport edges
  const maxLeft = scrollX + window.innerWidth - 340;
  if (left < scrollX + 8) left = scrollX + 8;
  if (left > maxLeft) left = maxLeft;

  popover.style.top = top + "px";
  popover.style.left = left + "px";
  popover.classList.add("visible");
}

function hidePopover() {
  popover.classList.remove("visible");
}

// Wire up each SVG group
Object.keys(popoverData).forEach((id) => {
  // The SVG uses data-name, so find by that
  const el = document.querySelector(`[data-name="${id.replace(/_/g, " ")}"]`) || document.getElementById(id);
  if (!el) return;

  el.style.cursor = "pointer";

  el.addEventListener("click", (e) => {
    e.stopPropagation();
    // Toggle: close if already open for this group
    if (popover.classList.contains("visible") && popover.dataset.activeId === id) {
      hidePopover();
    } else {
      popover.dataset.activeId = id;
      showPopover(id, el);
    }
  });
});

popClose.addEventListener("click", hidePopover);

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!popover.contains(e.target)) hidePopover();
});
