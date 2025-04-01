import { validateField, validateEmailField } from "./validation.js"
import { Utils } from "./utils.js"
import { EmailService } from "./email-service.js"

const contactForm = document.getElementById("contactForm")
const formSuccess = document.getElementById("formSuccess")

// Handle contact form submit
function handleContactFormSubmit(e) {
  e.preventDefault()

  // Validate form
  const nameInput = document.getElementById("name")
  const emailInput = document.getElementById("email")
  const messageInput = document.getElementById("message")

  const isNameValid = validateField(nameInput, "name-error", "Name is required")
  const isEmailValid = validateEmailField(emailInput)
  const isMessageValid = validateField(messageInput, "message-error", "Message is required")

  if (isNameValid && isEmailValid && isMessageValid) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]')
    const originalBtnText = submitBtn.innerHTML
    submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...'
    submitBtn.disabled = true

    // Create message object
    const message = {
      id: Utils.generateId(),
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      phone: document.getElementById("phone")?.value?.trim() || "",
      date: new Date().toISOString(),
    }

    // Save to localStorage
    const messages = JSON.parse(localStorage.getItem("contactMessages") || "[]")
    messages.push(message)
    localStorage.setItem("contactMessages", JSON.stringify(messages))

    // Send email
    EmailService.sendContactEmail(message)
      .then(() => {
        // Show success message
        contactForm.classList.add("hidden")
        formSuccess.classList.remove("hidden")

        // Reset button state
        submitBtn.innerHTML = originalBtnText
        submitBtn.disabled = false
      })
      .catch((error) => {
        console.error("Error sending email:", error)
        // Still show success and save to localStorage even if email fails
        contactForm.classList.add("hidden")
        formSuccess.classList.remove("hidden")

        // Reset button state
        submitBtn.innerHTML = originalBtnText
        submitBtn.disabled = false
      })
  }
}

