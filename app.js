(() => {
  "use strict";
  const cfg = window.MSC_ALBUM || {};
  const $ = (id) => document.getElementById(id);
  const bookEl = $("book");
  const stage = $("bookStage");
  const loading = $("loading");
  const loadingText = $("loadingText");
  const intro = $("intro");
  const errorPanel = $("errorPanel");
  const audio = $("albumAudio");
  let pdf = null;
  let pageFlip = null;
  let zoomed = false;
  let opened = false;
  let musicOn = false;
  let renderedPages = 0;

  const pdfName = (cfg.PDF_FILE || "album.pdf").trim();
  const pdfPath = "assets/" + pdfName;
  const title = cfg.ALBUM_TITLE || "A Beautiful Beginning";
  $("albumTitle").textContent = title.toUpperCase();
  $("introTitle").textContent = cfg.COUPLE_NAMES || title;
  document.title = title + " | MSC E-Album Studio";
  document.body.style.setProperty("--render-scale", String(cfg.RENDER_SCALE || 1.35));

  if (cfg.MUSIC_FILE) audio.src = "assets/" + cfg.MUSIC_FILE;

  function fail(message) {
    loading.hidden = true;
    errorPanel.hidden = false;
    $("errorMessage").textContent = message;
    console.error("[MSC E-Album]", message);
  }

  function isMobile() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function updateCounter() {
    if (!pageFlip || !pdf) return;
    const current = pageFlip.getCurrentPageIndex() + 1;
    $("currentPage").textContent = String(current).padStart(2, "0");
    $("totalPages").textContent = String(pdf.numPages).padStart(2, "0");
  }

  function updateMode() {
    if (!pageFlip) return;
    // StPageFlip's portrait mode automatically presents one page on narrow screens.
    // On wide screens it presents a two-page spread.
    pageFlip.update();
  }

  async function buildPages() {
    try {
      if (!window.pdfjsLib) throw new Error("PDF.js library did not load. Check your internet connection.");
      if (!window.St || !window.St.PageFlip) throw new Error("Page-flip library did not load. Check your internet connection.");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      loadingText.textContent = "Loading your PDF…";
      pdf = await pdfjsLib.getDocument({ url: pdfPath }).promise;
      if (!pdf.numPages) throw new Error("The selected PDF has no pages.");

      const first = await pdf.getPage(1);
      const firstViewport = first.getViewport({ scale: 1 });
      const aspect = firstViewport.width / firstViewport.height;
      const pageHeight = Math.min(740, Math.max(390, Math.floor(window.innerHeight * 0.69)));
      const pageWidth = Math.round(pageHeight * aspect);
      const scale = Math.max(1, Math.min(2, Number(cfg.RENDER_SCALE) || 1.35));

      for (let n = 1; n <= pdf.numPages; n++) {
        loadingText.textContent = `Rendering page ${n} of ${pdf.numPages}…`;
        const page = n === 1 ? first : await pdf.getPage(n);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: ctx, viewport }).promise;

        const pageNode = document.createElement("div");
        pageNode.className = "page";
        const image = document.createElement("img");
        image.alt = `Album page ${n}`;
        image.src = canvas.toDataURL("image/jpeg", 0.94);
        image.draggable = false;
        pageNode.appendChild(image);
        bookEl.appendChild(pageNode);
        renderedPages++;
      }

      loading.hidden = true;
      stage.classList.add("ready");
      pageFlip = new St.PageFlip(bookEl, {
        width: pageWidth,
        height: pageHeight,
        size: "stretch",
        minWidth: 250,
        maxWidth: 1100,
        minHeight: 340,
        maxHeight: 1500,
        maxShadowOpacity: 0.55,
        showCover: !!cfg.HARD_COVER,
        usePortrait: true,
        startPage: 0,
        drawShadow: true,
        flippingTime: 1000,
        autoSize: true,
        mobileScrollSupport: false,
        clickEventForward: true,
        useMouseEvents: true,
        swipeDistance: 30,
        showPageCorners: true
      });
      pageFlip.loadFromHTML(bookEl.querySelectorAll(".page"));
      pageFlip.on("flip", updateCounter);
      pageFlip.on("changeState", updateCounter);
      updateCounter();
      $("openBtn").disabled = false;
      document.body.classList.add("loaded");
    } catch (err) {
      fail(err && err.message ? err.message : "Could not render the PDF.");
    }
  }

  function openAlbum() {
    if (!pageFlip || opened) return;
    opened = true;
    intro.classList.add("dismissed");
    stage.classList.add("opened");
    setTimeout(() => { intro.hidden = true; }, 650);
  }

  $("openBtn").addEventListener("click", openAlbum);
  $("prevBtn").addEventListener("click", () => { if (pageFlip) { openAlbum(); pageFlip.flipPrev(); } });
  $("nextBtn").addEventListener("click", () => { if (pageFlip) { openAlbum(); pageFlip.flipNext(); } });

  $("fullscreenBtn").addEventListener("click", async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (err) { console.warn("Fullscreen is unavailable in this browser.", err); }
  });

  function toggleZoom() {
    zoomed = !zoomed;
    stage.classList.toggle("zoomed", zoomed);
    $("zoomBtn").innerHTML = zoomed ? 'ZOOM <span>−</span>' : 'ZOOM <span>＋</span>';
  }
  $("zoomBtn").addEventListener("click", toggleZoom);

  async function toggleMusic() {
    if (!cfg.MUSIC_FILE) {
      $("soundState").textContent = "NO TRACK";
      return;
    }
    try {
      if (!musicOn) {
        await audio.play();
        musicOn = true;
      } else {
        audio.pause();
        musicOn = false;
      }
      $("soundState").textContent = musicOn ? "ON" : "OFF";
      $("musicBtn").classList.toggle("active", musicOn);
    } catch (err) {
      $("soundState").textContent = "TAP AGAIN";
    }
  }
  $("soundBtn").addEventListener("click", toggleMusic);
  $("musicBtn").addEventListener("click", toggleMusic);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateMode, 180);
  });

  buildPages();
})();
