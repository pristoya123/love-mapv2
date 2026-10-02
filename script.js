/*
  =========================================================
  НАСТРОЙКА САЙТА
  =========================================================

  ТЕБЕ В ОСНОВНОМ НУЖНО РЕДАКТИРОВАТЬ ТОЛЬКО ОБЪЕКТ SITE
  И МАССИВ EVENTS НИЖЕ.

  Для фотографии:
  1) положи файл в папку images
  2) укажи путь, например: "images/05-10-2020.jpg"

  Можно добавлять сколько угодно событий.
*/

const SITE = {
  title: "Наша история",
  subtitle: "Каждая точка — воспоминание, которое мы не хотим забыть."
};

/*
  Каждое событие:

  {
    date: "05.10.2020",
    title: "День, с которого всё началось",
    description: "Ваш текст...",
    image: "images/first.jpg"
  }

  image можно оставить пустым: image: ""
*/

const EVENTS = [
{
    date: "08.1.2026",
    title: "Начало нашей истории",
    description: "Всё началось с Дайвинчика",
    image: "images/1.png"
  },
  {
    date: "Дата",
    title: "Текст",
    description: "Текст",
    image: ""
  },
  {
    date: "Дата",
    title: "Текст",
    description: "Текст",
    image: ""
  },
 {
    date: "Дата",
    title: "Текст",
    description: "Текст",
    image: ""
  },
 {
    date: "Дата",
    title: "Текст",
    description: "Текст",
    image: ""
  },
  {
    date: "Дата",
    title: "Текст",
    description: "Текст",
    image: ""
  },
];

/* ================== ДАЛЬШЕ КОД НЕ НУЖНО МЕНЯТЬ ================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const intro = $("#intro");
const startButton = $("#startButton");
const mapScreen = $("#mapScreen");
const mapViewport = $("#mapViewport");
const mapWorld = $("#mapWorld");
const routePath = $("#routePath");
const routeGlow = $("#routeGlow");
const eventLayer = $("#eventLayer");
const eventPanel = $("#eventPanel");
const closePanel = $("#closePanel");
const panelDate = $("#panelDate");
const panelTitle = $("#panelTitle");
const panelDescription = $("#panelDescription");
const panelImage = $("#panelImage");
const photoFrame = $("#photoFrame");
const photoTapHint = $("#photoTapHint");
const panelCounter = $("#panelCounter");

const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");
const lightboxClose = $("#lightboxClose");
const lightboxBackdrop = $("#lightboxBackdrop");
const resetView = $("#resetView");
const playJourney = $("#playJourney");
const mapHint = $("#mapHint");
const progress = $("#journeyProgress");
const progressFill = $("#progressFill");
const progressCurrent = $("#progressCurrent");
const progressTotal = $("#progressTotal");

const timerYears = $("#timerYears");
const timerMonths = $("#timerMonths");
const timerDays = $("#timerDays");
const timerHours = $("#timerHours");
const timerMinutes = $("#timerMinutes");
const timerSeconds = $("#timerSeconds");

$("#siteTitle").textContent = SITE.title;
$("#siteSubtitle").textContent = SITE.subtitle;
$("#mapTitle").textContent = SITE.title;
progressTotal.textContent = EVENTS.length;

const svgNS = "http://www.w3.org/2000/svg";
const WORLD_W = 1600;
const WORLD_H = 1000;

/*
  ДАТА НАЧАЛА ОТНОШЕНИЙ
  Здесь можно поменять дату в будущем.
  Важно: месяц считается календарным месяцем, а дни — после последней
  годовщины/месячной даты.
*/
const RELATIONSHIP_START = new Date(2026, 7, 28, 0, 0, 0); // 28 августа 2026

function updateRelationshipTimer() {
  const now = new Date();

  if (now < RELATIONSHIP_START) {
    timerYears.textContent = "0";
    timerMonths.textContent = "0";
    timerDays.textContent = "0";
    timerHours.textContent = "0";
    timerMinutes.textContent = "0";
    timerSeconds.textContent = "0";
    return;
  }

  // Полные годы и месяцы.
  let years = now.getFullYear() - RELATIONSHIP_START.getFullYear();
  let months = now.getMonth() - RELATIONSHIP_START.getMonth();
  let days;

  if (months < 0) {
    years--;
    months += 12;
  }

  // Дата после добавления полных лет и месяцев.
  const calendarBase = new Date(
    RELATIONSHIP_START.getFullYear() + years,
    RELATIONSHIP_START.getMonth() + months,
    RELATIONSHIP_START.getDate(),
    RELATIONSHIP_START.getHours(),
    RELATIONSHIP_START.getMinutes(),
    RELATIONSHIP_START.getSeconds()
  );

  // Если текущий день ещё не дошёл до соответствующей даты месяца,
  // отнимаем один месяц и пересчитываем.
  if (calendarBase > now) {
    months--;
    if (months < 0) {
      years--;
      months = 11;
    }

    const adjustedBase = new Date(
      RELATIONSHIP_START.getFullYear() + years,
      RELATIONSHIP_START.getMonth() + months,
      RELATIONSHIP_START.getDate(),
      RELATIONSHIP_START.getHours(),
      RELATIONSHIP_START.getMinutes(),
      RELATIONSHIP_START.getSeconds()
    );

    days = Math.floor((now - adjustedBase) / 86400000);
  } else {
    days = Math.floor((now - calendarBase) / 86400000);
  }

  const remainderBase = new Date(calendarBase);
  // Rebuild base to account for the possible month adjustment above.
  const finalBase = new Date(
    RELATIONSHIP_START.getFullYear() + years,
    RELATIONSHIP_START.getMonth() + months,
    RELATIONSHIP_START.getDate(),
    RELATIONSHIP_START.getHours(),
    RELATIONSHIP_START.getMinutes(),
    RELATIONSHIP_START.getSeconds()
  );

  const elapsed = Math.max(0, now - finalBase);
  const totalSeconds = Math.floor(elapsed / 1000);

  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const seconds = totalSeconds % 60;

  timerYears.textContent = years;
  timerMonths.textContent = months;
  timerDays.textContent = days;
  timerHours.textContent = String(hours).padStart(2, "0");
  timerMinutes.textContent = String(minutes).padStart(2, "0");
  timerSeconds.textContent = String(seconds).padStart(2, "0");
}

updateRelationshipTimer();
setInterval(updateRelationshipTimer, 1000);

/*
  Координаты точек рассчитываются автоматически по количеству событий.
  Если захочешь вручную менять форму линии, смотри функцию buildRoute().
*/
let eventPositions = [];

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildRoute() {
  const count = Math.max(EVENTS.length, 1);
  const left = 150;
  const right = WORLD_W - 150;
  const usable = right - left;

  // Размещаем точки по плавной волне.
  eventPositions = EVENTS.map((_, index) => {
    const t = count === 1 ? .5 : index / (count - 1);
    const x = left + usable * t;
    const waveA = Math.sin(t * Math.PI * 2.5) * 180;
    const waveB = Math.sin(t * Math.PI * 6) * 35;
    const y = WORLD_H / 2 + waveA + waveB;

    return {
      x,
      y: clamp(y, 180, WORLD_H - 180)
    };
  });

  let d = "";

  if (eventPositions.length === 1) {
    const p = eventPositions[0];
    d = `M ${p.x - 180} ${p.y} C ${p.x - 80} ${p.y - 100}, ${p.x - 40} ${p.y + 100}, ${p.x} ${p.y}`;
  } else {
    d = `M ${eventPositions[0].x} ${eventPositions[0].y}`;

    for (let i = 0; i < eventPositions.length - 1; i++) {
      const a = eventPositions[i];
      const b = eventPositions[i + 1];

      const dx = (b.x - a.x) * 0.45;
      const c1x = a.x + dx;
      const c1y = a.y;
      const c2x = b.x - dx;
      const c2y = b.y;

      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
    }
  }

  routePath.setAttribute("d", d);
  routeGlow.setAttribute("d", d);
  return d;
}

function makeSvgElement(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function renderEvents() {
  eventLayer.innerHTML = "";

  EVENTS.forEach((event, index) => {
    const p = eventPositions[index];
    const group = makeSvgElement("g", {
      class: "event-node",
      "data-index": index,
      tabindex: "0",
      role: "button",
      "aria-label": `${event.date}: ${event.title}`
    });

    const pulse = makeSvgElement("circle", {
      class: "node-pulse",
      cx: p.x,
      cy: p.y,
      r: 38
    });

    const square = makeSvgElement("rect", {
      class: "node-square",
      x: p.x - 10,
      y: p.y - 10,
      width: 20,
      height: 20
    });

    // Чередование подписей вверх/вниз, чтобы карта не выглядела перегруженной.
    const side = index % 2 === 0 ? -1 : 1;
    const labelY = p.y + side * 52;
    const anchor = index === 0 ? "start" : (index === EVENTS.length - 1 ? "end" : "middle");

    const dateText = makeSvgElement("text", {
      class: "node-date",
      x: p.x,
      y: labelY,
      "text-anchor": anchor
    });
    dateText.textContent = event.date;

    const titleText = makeSvgElement("text", {
      class: "node-title",
      x: p.x,
      y: labelY + (side === -1 ? -18 : 22),
      "text-anchor": anchor
    });
    titleText.textContent = event.title;

    group.append(pulse, square, dateText, titleText);
    eventLayer.appendChild(group);

    group.addEventListener("click", (e) => {
      e.stopPropagation();
      openEvent(index);
    });

    group.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openEvent(index);
      }
    });
  });
}

function openEvent(index) {
  const event = EVENTS[index];
  if (!event) return;

  $$(".event-node").forEach(n => n.classList.remove("selected"));
  const node = document.querySelector(`.event-node[data-index="${index}"]`);
  if (node) node.classList.add("selected");

  panelDate.textContent = event.date;
  panelTitle.textContent = event.title;
  panelDescription.textContent = event.description || "";

  if (event.image) {
    panelImage.src = event.image;
    panelImage.alt = event.title;
    photoFrame.classList.add("has-image");
    photoTapHint.classList.add("visible");
  } else {
    panelImage.removeAttribute("src");
    photoFrame.classList.remove("has-image");
    photoTapHint.classList.remove("visible");
  }

  panelCounter.textContent = `${index + 1} / ${EVENTS.length}`;
  eventPanel.classList.add("open");
  eventPanel.setAttribute("aria-hidden", "false");

  focusEvent(index, 1.28);
}

function openLightbox() {
  if (!photoFrame.classList.contains("has-image") || !panelImage.src) return;

  lightboxImage.src = panelImage.src;
  lightboxImage.alt = panelImage.alt || "";
  lightboxCaption.textContent = `${panelDate.textContent}  ·  ${panelTitle.textContent}`;

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");

  setTimeout(() => {
    if (!lightbox.classList.contains("open")) {
      lightboxImage.removeAttribute("src");
    }
  }, 420);
}

photoFrame.addEventListener("click", (e) => {
  if (!photoFrame.classList.contains("has-image")) return;
  e.stopPropagation();
  openLightbox();
});

photoFrame.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && photoFrame.classList.contains("has-image")) {
    e.preventDefault();
    openLightbox();
  }
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

function closeEvent() {
  eventPanel.classList.remove("open");
  eventPanel.setAttribute("aria-hidden", "true");
  $$(".event-node").forEach(n => n.classList.remove("selected"));
}

closePanel.addEventListener("click", closeEvent);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeEvent();
});

function getViewportSize() {
  return {
    width: mapViewport.clientWidth,
    height: mapViewport.clientHeight
  };
}

/*
  Трансформация карты.
  tx/ty — смещение.
  scale — масштаб.
*/
const view = {
  tx: 0,
  ty: 0,
  scale: 0.65,
  targetTx: 0,
  targetTy: 0,
  targetScale: 0.65,
  raf: null
};

function applyView(immediate = false) {
  if (immediate) {
    view.tx = view.targetTx;
    view.ty = view.targetTy;
    view.scale = view.targetScale;
  } else {
    view.tx += (view.targetTx - view.tx) * .13;
    view.ty += (view.targetTy - view.ty) * .13;
    view.scale += (view.targetScale - view.scale) * .13;
  }

  mapWorld.style.transform =
    `translate3d(calc(-50% + ${view.tx}px), calc(-50% + ${view.ty}px), 0) scale(${view.scale})`;

  const moving =
    Math.abs(view.targetTx - view.tx) > .2 ||
    Math.abs(view.targetTy - view.ty) > .2 ||
    Math.abs(view.targetScale - view.scale) > .002;

  if (moving || !immediate) requestAnimationFrame(() => applyView(false));
}

function centerWholeMap() {
  const { width, height } = getViewportSize();
  const padding = Math.min(width, height) * .07;

  const fitX = (width - padding * 2) / WORLD_W;
  const fitY = (height - padding * 2) / WORLD_H;

  view.targetScale = clamp(Math.min(fitX, fitY), .36, .78);
  view.targetTx = 0;
  view.targetTy = 0;

  applyView();
}

function focusEvent(index, desiredScale = 1.25) {
  const p = eventPositions[index];
  if (!p) return;

  const { width, height } = getViewportSize();

  view.targetScale = clamp(desiredScale, .55, 1.75);

  // Мир центрируется по экрану, поэтому смещаем его так,
  // чтобы выбранная точка оказалась примерно в центре/чуть левее.
  const worldCenterX = WORLD_W / 2;
  const worldCenterY = WORLD_H / 2;

  view.targetTx = (worldCenterX - p.x) * view.targetScale;
  view.targetTy = (worldCenterY - p.y) * view.targetScale;

  // На больших экранах оставляем панель справа.
  if (width > 760) {
    view.targetTx -= Math.min(150, width * .08);
  } else {
    view.targetTy -= Math.min(70, height * .06);
  }

  applyView();
}

function zoomAt(clientX, clientY, nextScale) {
  const rect = mapViewport.getBoundingClientRect();
  const cx = clientX - rect.left - rect.width / 2;
  const cy = clientY - rect.top - rect.height / 2;

  const oldScale = view.targetScale;
  const newScale = clamp(nextScale, .42, 1.9);
  const ratio = newScale / oldScale;

  view.targetTx = cx - (cx - view.targetTx) * ratio;
  view.targetTy = cy - (cy - view.targetTy) * ratio;
  view.targetScale = newScale;

  applyView();
}

/* ================= POINTER / TOUCH GESTURES ================= */

let drag = null;
let pinch = null;

mapViewport.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".event-node")) return;

  mapViewport.setPointerCapture?.(e.pointerId);
  drag = {
    id: e.pointerId,
    x: e.clientX,
    y: e.clientY,
    startTx: view.targetTx,
    startTy: view.targetTy
  };
  mapViewport.classList.add("dragging");
});

mapViewport.addEventListener("pointermove", (e) => {
  if (!drag || drag.id !== e.pointerId) return;

  view.targetTx = drag.startTx + (e.clientX - drag.x);
  view.targetTy = drag.startTy + (e.clientY - drag.y);
  applyView();
});

function endDrag(e) {
  if (drag && drag.id === e.pointerId) {
    drag = null;
    mapViewport.classList.remove("dragging");
  }
}

mapViewport.addEventListener("pointerup", endDrag);
mapViewport.addEventListener("pointercancel", endDrag);
mapViewport.addEventListener("pointerleave", endDrag);

mapViewport.addEventListener("wheel", (e) => {
  e.preventDefault();
  const multiplier = e.deltaY > 0 ? .9 : 1.1;
  zoomAt(e.clientX, e.clientY, view.targetScale * multiplier);
}, { passive: false });

function distance(a, b) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function midpoint(a, b) {
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2
  };
}

// Поддержка pinch-to-zoom через два touch/pointer события.
const activePointers = new Map();

mapViewport.addEventListener("pointerdown", (e) => {
  activePointers.set(e.pointerId, e);

  if (activePointers.size === 2) {
    const pts = [...activePointers.values()];
    pinch = {
      startDistance: distance(pts[0], pts[1]),
      startScale: view.targetScale,
      center: midpoint(pts[0], pts[1]),
      startTx: view.targetTx,
      startTy: view.targetTy
    };
    drag = null;
    mapViewport.classList.remove("dragging");
  }
});

mapViewport.addEventListener("pointermove", (e) => {
  if (!activePointers.has(e.pointerId)) return;
  activePointers.set(e.pointerId, e);

  if (activePointers.size === 2 && pinch) {
    const pts = [...activePointers.values()];
    const d = distance(pts[0], pts[1]);
    const m = midpoint(pts[0], pts[1]);
    const scale = clamp(pinch.startScale * (d / pinch.startDistance), .42, 1.9);

    const rect = mapViewport.getBoundingClientRect();
    const startCx = pinch.center.x - rect.left - rect.width / 2;
    const startCy = pinch.center.y - rect.top - rect.height / 2;
    const currentCx = m.x - rect.left - rect.width / 2;
    const currentCy = m.y - rect.top - rect.height / 2;

    const ratio = scale / pinch.startScale;

    view.targetScale = scale;
    view.targetTx = currentCx - (startCx - pinch.startTx) * ratio;
    view.targetTy = currentCy - (startCy - pinch.startTy) * ratio;
    applyView();
  }
});

function pointerEnd(e) {
  activePointers.delete(e.pointerId);
  if (activePointers.size < 2) pinch = null;
}

mapViewport.addEventListener("pointerup", pointerEnd);
mapViewport.addEventListener("pointercancel", pointerEnd);

/* ================= JOURNEY MODE ================= */

let journeyTimer = null;
let journeyRunning = false;

function stopJourney() {
  if (journeyTimer) clearTimeout(journeyTimer);
  journeyTimer = null;
  journeyRunning = false;
  progress.classList.remove("active");
}

function startJourney() {
  stopJourney();
  if (!EVENTS.length) return;

  journeyRunning = true;
  progress.classList.add("active");

  let index = 0;

  const step = () => {
    if (!journeyRunning || index >= EVENTS.length) {
      stopJourney();
      return;
    }

    progressCurrent.textContent = index + 1;
    progressFill.style.width = `${((index + 1) / EVENTS.length) * 100}%`;

    openEvent(index);

    journeyTimer = setTimeout(() => {
      closeEvent();
      index++;
      journeyTimer = setTimeout(step, 900);
    }, 3600);
  };

  step();
}

playJourney.addEventListener("click", startJourney);
resetView.addEventListener("click", () => {
  stopJourney();
  closeEvent();
  centerWholeMap();
});

mapViewport.addEventListener("click", (e) => {
  if (e.target === mapViewport || e.target === mapWorld || e.target === document.querySelector("#loveMap")) {
    closeEvent();
  }
});

startButton.addEventListener("click", () => {
  intro.classList.add("hidden");
  mapScreen.classList.add("visible");

  // Сначала небольшое приближение к центру,
  // затем мягкий zoom-out до обзора всей карты.
  view.targetScale = .92;
  view.targetTx = 0;
  view.targetTy = 0;
  applyView();

  setTimeout(() => {
    centerWholeMap();
  }, 950);

  setTimeout(() => {
    mapHint.classList.add("hidden");
  }, 5200);
});

/* ================= INIT ================= */

buildRoute();
renderEvents();

// Небольшая задержка перед стартовым расположением,
// чтобы CSS успел отрисовать viewport.
requestAnimationFrame(() => {
  centerWholeMap();
});
