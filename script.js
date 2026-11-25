const avatar = document.querySelector(".avatar");

if (avatar) {
  const hoverSupported = window.matchMedia("(hover: hover) and (pointer: fine)");

  const setRevealed = (revealed) => {
    avatar.classList.toggle("is-revealed", revealed);
    avatar.setAttribute("aria-pressed", String(revealed));
    avatar.setAttribute(
      "aria-label",
      revealed ? "Show Doomsday portrait" : "Reveal your identity",
    );
  };

  avatar.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") {
      setRevealed(true);
    }
  });

  avatar.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "touch") {
      setRevealed(false);
    }
  });

  avatar.addEventListener("click", (event) => {
    if (event.detail === 0 || event.pointerType === "touch" || !hoverSupported.matches) {
      setRevealed(!avatar.classList.contains("is-revealed"));
    }
  });
}

const projectSlideshow = document.querySelector(".project-slideshow");

if (projectSlideshow) {
  const slides = Array.from(projectSlideshow.querySelectorAll(".project-slide"));
  const dots = Array.from(projectSlideshow.querySelectorAll(".project-slide-dot"));
  const controls = Array.from(projectSlideshow.querySelectorAll("[data-slide-step]"));
  const status = projectSlideshow.querySelector(".project-slide-status");
  const summary = projectSlideshow.querySelector(".project-slide-summary");
  const stage = projectSlideshow.querySelector(".project-slide-stage");
  let activeIndex = 0;
  let touchStartX = null;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });

    dots.forEach((dot, dotIndex) => {
      if (dotIndex === activeIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    status.textContent = `${activeIndex + 1} of ${slides.length} — ${slides[activeIndex].dataset.caption}`;
    summary.textContent = slides[activeIndex].dataset.summary;
  };

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      showSlide(activeIndex + Number(control.dataset.slideStep));
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  projectSlideshow.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1);
    }
  });

  stage.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true },
  );

  stage.addEventListener(
    "touchend",
    (event) => {
      if (touchStartX === null) {
        return;
      }

      const distance = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;

      if (Math.abs(distance) >= 40) {
        showSlide(activeIndex + (distance < 0 ? 1 : -1));
      }
    },
    { passive: true },
  );
}
