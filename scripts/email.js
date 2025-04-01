// Email Service Module

const EmailService = (() => {
    // Send contact form email
    async function sendContactEmail(messageData) {
        try {
            // In a real application, you would use a server-side API or email service
            // For this demo, we'll simulate sending an email
            console.log('Sending email with data:', messageData);
            
            // Simulate API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Email sent successfully to ngamvitalisyuh@gmail.com');
                    resolve({ success: true });
                }, 1000);
            });
            
            // In a real application, you would use fetch or axios to send the data to your backend
            /*
            const response = await fetch('https://your-api-endpoint.com/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'ngamvitalisyuh@gmail.com',
                    subject: `Contact Form Submission from ${messageData.name}`,
                    name: messageData.name,
                    email: messageData.email,
                    message: messageData.message,
                    phone: messageData.phone || 'Not provided'
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            
            return await response.json();
            */
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
    
    // Send task notification email
    async function sendTaskNotificationEmail(taskData) {
        try {
            console.log('Sending task notification email for:', taskData);
            
            // Simulate API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Task notification email sent successfully');
                    resolve({ success: true });
                }, 1000);
            });
        } catch (error) {
            console.error('Error sending task notification:', error);
            throw error;
        }
    }
    
    // Public API
    return {
        sendContactEmail,
        sendTaskNotificationEmail
    };
})();
