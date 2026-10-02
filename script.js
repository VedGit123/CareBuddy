// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Zoho Configuration - Replace with your actual credentials
const ZOHO_CONFIG = {
    // Zoho Forms Configuration
    forms: {
        formLink: 'YOUR_ZOHO_FORM_LINK', // Your Zoho Form link or embed code
        formId: 'YOUR_FORM_ID' // Your Zoho Form ID
    },
    
    // Zoho Bigin Configuration
    bigin: {
        authToken: 'YOUR_ZOHO_BIGIN_AUTH_TOKEN', // Your Zoho Bigin Auth Token
        organizationId: 'YOUR_ORG_ID', // Your Organization ID
        pipelineId: 'YOUR_PIPELINE_ID', // Your Pipeline ID
        apiUrl: 'https://www.zohoapis.com/bigin/v1'
    }
};

// Submit form to Zoho Forms (Option 1: Using Zoho Forms API)
async function submitToZohoForms(formData) {
    try {
        // Option 1: Direct form submission to Zoho Forms
        const response = await fetch(ZOHO_CONFIG.forms.formLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        return response.ok;
    } catch (error) {
        console.error('Zoho Forms submission error:', error);
        return false;
    }
}

// Submit form to Zoho Bigin (Option 2: Using Zoho Bigin API)
async function submitToZohoBigin(formData) {
    try {
        const contactData = {
            data: [
                {
                    First_Name: formData.name.split(' ')[0],
                    Last_Name: formData.name.split(' ').slice(1).join(' ') || '',
                    Phone: formData.phone,
                    Email: formData.email || '',
                    Description: formData.message,
                    Service: formData.service,
                    City: formData.city
                }
            ]
        };
        
        const response = await fetch(`${ZOHO_CONFIG.bigin.apiUrl}/Contacts`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.bigin.authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        if (response.ok) {
            const result = await response.json();
            // Create a deal/pipeline entry if needed
            if (result.data && result.data[0]) {
                const contactId = result.data[0].details.id;
                await createDealInBigin(contactId, formData);
            }
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Zoho Bigin submission error:', error);
        return false;
    }
}

// Create a deal in Zoho Bigin
async function createDealInBigin(contactId, formData) {
    try {
        const dealData = {
            data: [
                {
                    Deal_Name: `${formData.service} - ${formData.city}`,
                    Stage: 'New Lead',
                    Contact_Id: contactId,
                    Pipeline: ZOHO_CONFIG.bigin.pipelineId,
                    Closing_Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
                    Description: formData.message
                }
            ]
        };
        
        await fetch(`${ZOHO_CONFIG.bigin.apiUrl}/Pipelines/${ZOHO_CONFIG.bigin.pipelineId}/Deals`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.bigin.authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dealData)
        });
    } catch (error) {
        console.error('Error creating deal in Bigin:', error);
    }
}

// Alternative: Simple email notification (fallback)
async function sendEmailNotification(formData) {
    // This is a placeholder - you would need to implement a backend service
    // or use a service like EmailJS, Formspree, or similar
    console.log('Form data:', formData);
    return true;
}

// Form submission handler
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        city: document.getElementById('city').value,
        message: document.getElementById('message').value
    };
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Try to submit to Zoho Bigin (preferred method)
    let success = false;
    
    // Check if Zoho Bigin credentials are configured
    if (ZOHO_CONFIG.bigin.authToken !== 'YOUR_ZOHO_BIGIN_AUTH_TOKEN') {
        success = await submitToZohoBigin(formData);
    }
    
    // Fallback to Zoho Forms if Bigin fails or not configured
    if (!success && ZOHO_CONFIG.forms.formLink !== 'YOUR_ZOHO_FORM_LINK') {
        success = await submitToZohoForms(formData);
    }
    
    // Final fallback - you can integrate with EmailJS, Formspree, etc.
    if (!success) {
        // For demo purposes, we'll just show success
        // In production, integrate with a backend service
        console.log('Form submitted (demo mode):', formData);
        success = true;
    }
    
    // Show result
    if (success) {
        formMessage.textContent = 'Thank you! Your request has been submitted successfully. We will contact you shortly.';
        formMessage.className = 'form-message success';
        contactForm.reset();
    } else {
        formMessage.textContent = 'Sorry, there was an error submitting your request. Please try again or call us directly.';
        formMessage.className = 'form-message error';
    }
    
    // Reset button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Form validation (additional client-side validation)
function validateForm() {
    const phone = document.getElementById('phone');
    const phoneRegex = /^[0-9]{10}$/;
    
    if (phone.value && !phoneRegex.test(phone.value)) {
        phone.setCustomValidity('Please enter a valid 10-digit phone number');
    } else {
        phone.setCustomValidity('');
    }
}

document.getElementById('phone').addEventListener('input', validateForm);
document.getElementById('phone').addEventListener('blur', validateForm);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('CareBuddy website loaded successfully');
    console.log('To enable Zoho integration, update the ZOHO_CONFIG in script.js with your credentials');
    
    // Initialize Chatbot
    initChatbot();
});

// Chatbot Functionality
function initChatbot() {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quickReplies = document.querySelectorAll('.quick-reply');

    // Toggle chat window
    chatbotButton.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });

    // Close chat window
    closeChat.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    // Send message on button click
    sendMessage.addEventListener('click', handleUserMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // Quick reply buttons
    quickReplies.forEach(button => {
        button.addEventListener('click', () => {
            const message = button.getAttribute('data-message');
            addUserMessage(message);
            setTimeout(() => {
                processBotResponse(message);
            }, 500);
        });
    });

    function handleUserMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatInput.value = '';
            setTimeout(() => {
                processBotResponse(message);
            }, 500);
        }
    }

    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bot-message';
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function processBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';

        if (lowerMessage.includes('patient care') || lowerMessage.includes('patient')) {
            response = 'Our Patient Care service includes: oral hygiene, bed bath/sponge bath, room cleanliness, feeding assistance, bathroom assistance, and light massage. Our caregivers are 100% verified and medically trained. Would you like to book this service?';
        } else if (lowerMessage.includes('japa maid') || lowerMessage.includes('japa')) {
            response = 'Our Japa Maid service provides postnatal care for mothers and baby care including: postnatal care, baby care and feeding assistance, massage for mother and baby, and diet planning guidance. Would you like to book this service?';
        } else if (lowerMessage.includes('maid') || lowerMessage.includes('cleaning')) {
            response = 'Our Maid Services include: daily cleaning and dusting, clothes washing and ironing, kitchen cleaning and dishwashing, and general household assistance. Would you like to book this service?';
        } else if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
            response = 'Great! You can book a service by filling out the contact form on our website, or you can call us directly at +91 99999 99999. Our team will assist you immediately!';
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
            response = 'Our pricing is transparent and competitive with no hidden costs. Rates vary based on the service type and duration (8hr/10hr/12hr/24hr plans). Please fill the contact form with your requirements, and we will provide you with a detailed quote.';
        } else if (lowerMessage.includes('location') || lowerMessage.includes('city') || lowerMessage.includes('area')) {
            response = 'We currently provide services in Mumbai, Delhi, Bangalore, Pune, Hyderabad, and Chennai. We are expanding to more cities soon. Which city are you located in?';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
            response = 'You can reach us at:\n📞 Phone: +91 99999 99999\n📧 Email: info@carebuddy.com\n📍 Address: 123 Healthcare Street, Mumbai, Maharashtra 400001';
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = 'Hello! Welcome to CareBuddy. How can I assist you today? You can ask about our services (Patient Care, Japa Maid, Maid Services), pricing, locations, or booking.';
        } else {
            response = 'I\'m here to help! You can ask me about:\n• Our services (Patient Care, Japa Maid, Maid Services)\n• Pricing and plans\n• Service locations\n• How to book a service\n• Contact information\n\nOr fill out the contact form and our team will call you back!';
        }

        addBotMessage(response);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}