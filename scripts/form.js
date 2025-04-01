// Form Handling Module

// Import necessary modules (or declare if not using modules)
// Assuming Utils and EmailService are defined elsewhere or should be mocked
const Utils = {
    generateId: () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
};

const EmailService = {
    sendContactEmail: (message) => {
        return new Promise((resolve, reject) => {
            // Simulate email sending
            console.log('Simulating sending email:', message);
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }
};

const FormHandler = (() => {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const sendAnotherBtn = document.getElementById('send-another-btn');
    
    // Initialize form handlers
    function init() {
        if (taskForm) {
            taskForm.addEventListener('submit', handleTaskFormSubmit);
        }
        
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactFormSubmit);
        }
        
        if (sendAnotherBtn) {
            sendAnotherBtn.addEventListener('click', resetContactForm);
        }
        
        // Add input validation events
        setupFormValidation();
    }
    
    // Setup real-time form validation
    function setupFormValidation() {
        if (contactForm) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            nameInput.addEventListener('blur', () => validateField(nameInput, 'name-error', 'Name is required'));
            emailInput.addEventListener('blur', () => validateEmailField(emailInput));
            messageInput.addEventListener('blur', () => validateField(messageInput, 'message-error', 'Message is required'));
        }
    }
    
    // Validate a single field
    function validateField(input, errorId, errorMessage) {
        const errorElement = document.getElementById(errorId);
        if (!input.value.trim()) {
            errorElement.textContent = errorMessage;
            input.classList.add('invalid');
            return false;
        } else {
            errorElement.textContent = '';
            input.classList.remove('invalid');
            return true;
        }
    }
    
    // Validate email field
    function validateEmailField(input) {
        const errorElement = document.getElementById('email-error');
        if (!input.value.trim()) {
            errorElement.textContent = 'Email is required';
            input.classList.add('invalid');
            return false;
        } else if (!/\S+@\S+\.\S+/.test(input.value)) {
            errorElement.textContent = 'Email is invalid';
            input.classList.add('invalid');
            return false;
        } else {
            errorElement.textContent = '';
            input.classList.remove('invalid');
            return true;
        }
    }
    
    // Handle task form submit
    function handleTaskFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(taskForm);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('dueDate'),
            priority: formData.get('priority'),
            status: formData.get('status'),
            progress: parseInt(formData.get('progress')) || 0
        };
        
        const taskId = formData.get('id');
        
        // Dispatch custom event with task data
        const eventName = taskId ? 'task:update' : 'task:create';
        const detail = taskId ? { taskId, taskData } : { taskData };
        
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
        
        // Close modal
        document.getElementById('task-modal').classList.remove('active');
    }
    
    // Handle contact form submit
    function handleContactFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        const isNameValid = validateField(nameInput, 'name-error', 'Name is required');
        const isEmailValid = validateEmailField(emailInput);
        const isMessageValid = validateField(messageInput, 'message-error', 'Message is required');
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // Create message object
            const message = {
                id: Utils.generateId(),
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                phone: document.getElementById('phone')?.value?.trim() || '',
                date: new Date().toISOString()
            };
            
            // Save to localStorage
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(message);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            // Send email
            EmailService.sendContactEmail(message)
                .then(() => {
                    // Show success message
                    contactForm.classList.add('hidden');
                    formSuccess.classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Error sending email:', error);
                    // Still show success and save to localStorage even if email fails
                    contactForm.classList.add('hidden');
                    formSuccess.classList.remove('hidden');
                });
        }
    }
    
    // Reset contact form
    function resetContactForm() {
        contactForm.reset();
        contactForm.classList.remove('hidden');
        formSuccess.classList.add('hidden');
        
        // Clear any validation errors
        document.getElementById('name-error').textContent = '';
        document.getElementById('email-error').textContent = '';
        document.getElementById('message-error').textContent = '';
        
        // Remove invalid class from inputs
        document.getElementById('name').classList.remove('invalid');
        document.getElementById('email').classList.remove('invalid');
        document.getElementById('message').classList.remove('invalid');
    }
    
    // Public API
    return {
        init,
        validateField,
        validateEmailField,
        resetContactForm
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', FormHandler.init);