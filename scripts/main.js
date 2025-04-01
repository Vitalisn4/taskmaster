// Feature links on home page
const dragFeatureLink = document.querySelector(".feature-card .drag-icon").closest(".feature-card")
const progressFeatureLink = document.querySelector(".feature-card .progress-icon").closest(".feature-card")
const notificationFeatureLink = document.querySelector(".feature-card .notification-icon").closest(".feature-card")

if (dragFeatureLink) {
  dragFeatureLink.addEventListener("click", () => {
    navigateTo("tasks")
  })
}

if (progressFeatureLink) {
  progressFeatureLink.addEventListener("click", () => {
    navigateTo("progress")
  })
}

if (notificationFeatureLink) {
  notificationFeatureLink.addEventListener("click", () => {
    navigateTo("settings")
    // Scroll to notification settings
    const notificationSettings = document.querySelector(".settings-group:nth-child(2)")
    if (notificationSettings) {
      notificationSettings.scrollIntoView({ behavior: "smooth" })
    }
  })
}

// Declare variables
const navLinks = document.querySelectorAll(".nav-link")
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")
let currentPage = ""
const mobileMenu = document.querySelector(".mobile-menu")
const updateProgressStats = () => {} // Dummy function, replace with actual implementation

// Navigate to page
function navigateTo(page) {
  console.log(`Navigating to ${page} page`)

  // Hide all pages
  document.querySelectorAll(".page").forEach((p) => {
    p.classList.remove("active")
  })

  // Show selected page
  const targetPage = document.getElementById(`${page}-page`)
  if (targetPage) {
    targetPage.classList.add("active")

    // Scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  } else {
    console.error(`Page not found: ${page}-page`)
  }

  // Update navigation
  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.page === page) {
      link.classList.add("active")
    }
  })

  mobileNavLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.dataset.page === page) {
      link.classList.add("active")
    }
  })

  currentPage = page

  // Close mobile menu
  mobileMenu.classList.remove("active")

  // Update progress stats if on progress page
  if (page === "progress") {
    updateProgressStats()
  }
}

