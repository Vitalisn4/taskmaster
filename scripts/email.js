// Email Service Module

const EmailService = (() => {
  // Send contact form email
  async function sendContactEmail(messageData) {
    try {
      console.log("Sending email with data:", messageData)

      // In a real application, you would use a server-side API or email service
      // For this demo, we'll use EmailJS or a similar service

      // Simulate API call for demo purposes
      // In a real application, you would use a service like EmailJS, FormSpree, or a custom backend

      // Example using EmailJS (you would need to include their script in index.html)
      /*
            if (window.emailjs) {
                return emailjs.send(
                    'service_id', // Replace with your EmailJS service ID
                    'template_id', // Replace with your EmailJS template ID
                    {
                        to_email: 'ngamvitalisyuh@gmail.com',
                        from_name: messageData.name,
                        from_email: messageData.email,
                        message: messageData.message,
                        phone: messageData.phone || 'Not provided'
                    }
                );
            }
            */

      // For demo purposes, we'll simulate a successful email send
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Email sent successfully to ngamvitalisyuh@gmail.com")
          // Store the message in localStorage as a backup
          const messages = JSON.parse(localStorage.getItem("contactMessages") || "[]")
          messages.push({
            ...messageData,
            sentAt: new Date().toISOString(),
            status: "sent",
          })
          localStorage.setItem("contactMessages", JSON.stringify(messages))

          resolve({ success: true })
        }, 1000)
      })
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  }

  // Send task notification email
  async function sendTaskNotificationEmail(taskData) {
    try {
      console.log("Sending task notification email for:", taskData)

      // For demo purposes, we'll simulate a successful email send
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Task notification email sent successfully to ngamvitalisyuh@gmail.com")
          resolve({ success: true })
        }, 1000)
      })
    } catch (error) {
      console.error("Error sending task notification:", error)
      throw error
    }
  }

  // Public API
  return {
    sendContactEmail,
    sendTaskNotificationEmail,
  }
})()

