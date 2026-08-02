const navLinks = [...document.querySelectorAll('.site-nav .navlinks[href^="#"]')];

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const visibleSections = new Set();

function setActiveSection(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleSections.add(entry.target);
      } else {
        visibleSections.delete(entry.target);
      }
    });

    const activeSection = [...sections]
      .reverse()
      .find((section) => visibleSections.has(section));

    if (activeSection) {
      setActiveSection(activeSection.id);
    }
  },
  {
    // The active zone starts below the 64px header and ends
    // roughly one-third of the way down the viewport.
    rootMargin: "-65px 0px -65% 0px",
  },
);

sections.forEach((section) => observer.observe(section));