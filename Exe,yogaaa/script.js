// script.js
(function() {
  // ---- SMOOTH SCROLL for any anchor (hash) ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // START NOW button smooth scroll to top? just demo alert + gentle scroll? Keep consistent: no hash but user experience.
  const startBtn = document.getElementById("startNowBtn");
  if (startBtn) {
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // subtle animation + alert free? the mockup vibe: show 'let's go' message + slight pop
      startBtn.style.transform = "scale(0.98)";
      setTimeout(() => { startBtn.style.transform = ""; }, 150);
      // optional creative: scroll to section1 as start journey
      const firstSection = document.getElementById("section1");
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // playful console but no intrusive alert
    });
  }

  // ---- HIDE SCROLL INDICATOR after first scroll beyond 100px ----
  let scrolledFlag = false;
  const scrollIndicator = document.getElementById("scrollIndicator");
  function handleScrollIndicator() {
    if (!scrolledFlag && window.scrollY > 100 && scrollIndicator) {
      scrollIndicator.style.opacity = "0";
      scrolledFlag = true;
    }
    // parallax for blobs
    const scrollY = window.pageYOffset;
    const blobs = document.querySelectorAll(".blob");
    blobs.forEach((blob, idx) => {
      const speed = idx % 2 === 0 ? 0.2 : -0.2;
      const rect = blob.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
        const moveY = scrollY * speed * 0.08;
        blob.style.transform = `translate(-50%, -50%) translateY(${moveY}px)`;
      }
    });
  }

  window.addEventListener("scroll", handleScrollIndicator);
  
  // ---- INTERSECTION OBSERVER for section fade/up animation ----
  const observerOptions = {
    threshold: 0.25,
    rootMargin: "0px 0px -20px 0px",
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // optional: keep persistent visible class
      }
    });
  }, observerOptions);
  
  document.querySelectorAll(".hero-section").forEach((section) => {
    sectionObserver.observe(section);
    // initially set to be ready; the css default opacity 0 transitions well
  });
  
  // ensure first section becomes visible even if already in view
  setTimeout(() => {
    document.querySelectorAll(".hero-section").forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        sec.classList.add("visible");
      }
    });
  }, 100);
  
  // ---- MENU ICON interactive animation (dot morph) ----
  const menuIcon = document.getElementById("menuIcon");
  if (menuIcon) {
    menuIcon.addEventListener("click", () => {
      menuIcon.classList.toggle("active");
      // additional snack: you could add a hidden menu but the design is just stylish; do nothing intrusive.
      // we simulate mini feedback: console or just aesthetic.
    });
  }
  
  // ---- SECTION WORDS (overlapping letters with dynamic positioning) ----
  const sectionWordSets = {
    1: ["OOPS!!", "OMG", "YEAH", "oops!"],
    2: ["NOPE", "UHU", "OOHHH", "YUIK"],
    3: ["YUIK", "OMG", "YEAH", "oops!!"],
    4: ["NOPE", "UHU", "OOHHH", "YEAH"],
  };
  
  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  function doesOverlap(rectA, rectB) {
    return !(rectA.right < rectB.left ||
      rectA.left > rectB.right ||
      rectA.bottom < rectB.top ||
      rectA.top > rectB.bottom);
  }
  
  function createSectionWord(text, containerRect) {
    const wordDiv = document.createElement("div");
    wordDiv.className = "section-word";
    wordDiv.textContent = text;
    const fontSizeRem = randomBetween(3.2, 6.8);
    wordDiv.style.fontSize = `${fontSizeRem}rem`;
    wordDiv.style.fontWeight = "800";
    const rotateVal = randomBetween(-18, 18);
    wordDiv.style.setProperty("--rotate", `${rotateVal}deg`);
    wordDiv.style.animationDuration = `${randomBetween(10, 18)}s`;
    wordDiv.style.animationDelay = `${randomBetween(0, 4)}s`;
    wordDiv.style.opacity = "0.12";
    // random position within container (percentage)
    let topPct = randomBetween(8, 82);
    let leftPct = randomBetween(5, 85);
    wordDiv.style.top = `${topPct}%`;
    wordDiv.style.left = `${leftPct}%`;
    wordDiv.style.position = "absolute";
    wordDiv.style.whiteSpace = "nowrap";
    wordDiv.style.visibility = "hidden";
    return wordDiv;
  }
  
  function initSectionWords() {
    const containers = document.querySelectorAll(".section-words");
    containers.forEach((container) => {
      const sectionIdx = container.getAttribute("data-section");
      const wordsList = sectionWordSets[sectionIdx] || ["OOPS!!", "NOPE", "YIKES"];
      container.innerHTML = "";
      const placedRects = [];
      const numberOfWords = 5; // create 5 scattered words for richness
      
      for (let i = 0; i < numberOfWords; i++) {
        const textChoice = wordsList[i % wordsList.length];
        let wordElement = createSectionWord(textChoice);
        container.appendChild(wordElement);
        // get bounding rect after attach (temporary hidden but layout computed)
        wordElement.style.visibility = "hidden";
        let rect = wordElement.getBoundingClientRect();
        let overlapDetected = false;
        let attempts = 0;
        const maxAttempts = 15;
        
        while (attempts < maxAttempts) {
          overlapDetected = false;
          const newTop = randomBetween(5, 85);
          const newLeft = randomBetween(5, 88);
          wordElement.style.top = `${newTop}%`;
          wordElement.style.left = `${newLeft}%`;
          // force reflow
          rect = wordElement.getBoundingClientRect();
          for (let existing of placedRects) {
            if (doesOverlap(existing, rect)) {
              overlapDetected = true;
              break;
            }
          }
          if (!overlapDetected) break;
          attempts++;
        }
        // final position store rect
        rect = wordElement.getBoundingClientRect();
        placedRects.push(rect);
        wordElement.style.visibility = "visible";
      }
      
      // add extra 2 floating alternative for more dynamic density
      for (let j = 0; j < 2; j++) {
        const extraWord = document.createElement("div");
        extraWord.className = "section-word";
        extraWord.textContent = wordsList[j % wordsList.length] + (j === 0 ? "!" : "");
        extraWord.style.fontSize = `${randomBetween(2.8, 5.5)}rem`;
        extraWord.style.setProperty("--rotate", `${randomBetween(-22, 22)}deg`);
        extraWord.style.top = `${randomBetween(10, 88)}%`;
        extraWord.style.left = `${randomBetween(3, 92)}%`;
        extraWord.style.animationDuration = `${randomBetween(12, 20)}s`;
        extraWord.style.animationDelay = `${randomBetween(0, 6)}s`;
        extraWord.style.opacity = "0.1";
        container.appendChild(extraWord);
      }
    });
  }
  
  initSectionWords();
  
  // dynamic blob sizes & initial positions based on original inline style but ensure responsive values
  function setBlobDimensions() {
    const blobs = document.querySelectorAll(".blob");
    const viewportWidth = window.innerWidth;
    let baseSize = 450;
    if (viewportWidth <= 968) baseSize = 340;
    if (viewportWidth <= 560) baseSize = 260;
    
    const blobSizes = [baseSize, baseSize, baseSize + 30, baseSize - 10];
    blobs.forEach((blob, idx) => {
      let size = blobSizes[idx % blobSizes.length];
      if (idx === 2 && viewportWidth > 968) size = 500;
      if (idx === 3 && viewportWidth > 968) size = 480;
      if (viewportWidth <= 560) size = Math.min(size, 280);
      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      // center relative to parent hero-image but keep translate(-50%,-50%)
      if (!blob.style.top) {
        blob.style.top = "50%";
        blob.style.left = "50%";
        blob.style.transform = "translate(-50%, -50%)";
      }
    });
  }
  
  // ensure blob left and top positions are correctly set from existing inline or default
  function initBlobPositions() {
    const blobElements = document.querySelectorAll(".blob");
    const defaultPositions = [
      { top: "50%", left: "40%" },
      { top: "50%", left: "30%" },
      { top: "50%", left: "40%" },
      { top: "50%", left: "35%" }
    ];
    blobElements.forEach((blob, idx) => {
      if (!blob.style.top || blob.style.top === "") {
        const pos = defaultPositions[idx % defaultPositions.length];
        blob.style.top = pos.top;
        blob.style.left = pos.left;
        blob.style.transform = "translate(-50%, -50%)";
      }
    });
    setBlobDimensions();
  }
  
  initBlobPositions();
  
  // blob parallax refinement: keep origin translate after css float transform
  // we already have scroll event handling blobs - avoid overriding essential transform
  // update also on window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setBlobDimensions();
      // reposition words maybe need to recompute overlap but not critical for consistent performance
      // but re-init words for adaptive layout? not fully needed, but we can adjust word font sizes.
      const words = document.querySelectorAll(".section-word");
      words.forEach(word => {
        let currentSize = parseFloat(getComputedStyle(word).fontSize);
        if (window.innerWidth <= 560 && currentSize > 48) {
          word.style.fontSize = `clamp(2rem, 8vw, 3.5rem)`;
        } else if (window.innerWidth <= 968 && currentSize > 60) {
          word.style.fontSize = `clamp(2.2rem, 6vw, 4rem)`;
        }
      });
    }, 150);
  });
  
  // adjust watermarks visibility on small screens
  function adjustWatermarks() {
    const watermarks = document.querySelectorAll(".watermark");
    if (window.innerWidth <= 700) {
      watermarks.forEach(w => {
        if (w.innerText.length > 5) w.style.fontSize = "40px";
        else w.style.fontSize = "48px";
      });
    } else {
      watermarks.forEach(w => w.style.fontSize = "");
    }
  }
  adjustWatermarks();
  window.addEventListener("resize", adjustWatermarks);
  
  // pop initial load to make scroll indicator cute, and preload visible sections
  setTimeout(() => {
    window.dispatchEvent(new Event("scroll"));
    const firstVisible = document.querySelector(".hero-section");
    if (firstVisible && !firstVisible.classList.contains("visible")) firstVisible.classList.add("visible");
  }, 80);
  
  // set dynamic default values for images if not loaded (alt handled)
  console.log("SMARTgRiFi — ready | replace image sources: greeng.png, prupleg.png, pinkg.png, blueg.png");
})();
