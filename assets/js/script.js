'use strict';



/**
 * navbar toggle
 */

const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const overlay = document.querySelector("[data-overlay]");

const elemArr = [navCloseBtn, overlay, navOpenBtn];

for (let i = 0; i < elemArr.length; i++) {
  elemArr[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}

/**
 * toggle navbar & overlay when click any navbar-link
 */

const navbarLinks = document.querySelectorAll("[data-navbar-link]");

for (let i = 0; i < navbarLinks.length; i++) {
  navbarLinks[i].addEventListener("click", function (e) {
    // Don't close navbar if clicking on dropdown toggle
    if (this.hasAttribute("data-dropdown-toggle")) {
      e.preventDefault();
      const dropdown = this.closest(".dropdown");
      dropdown.classList.toggle("active");
      return;
    }
    
    // Close dropdown if open
    document.querySelectorAll(".dropdown").forEach(drop => {
      drop.classList.remove("active");
    });
    
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}





/**
 * header & go-top-btn active
 * when window scroll down to 400px
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 400) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});



/**
 * FAQ accordion
 */

const faqBtns = document.querySelectorAll("[data-faq-btn]");

for (let i = 0; i < faqBtns.length; i++) {
  faqBtns[i].addEventListener("click", function () {
    const faqCard = this.parentElement;
    const isActive = faqCard.classList.contains("active");

    // Close all FAQ cards
    document.querySelectorAll(".faq-card").forEach(card => {
      card.classList.remove("active");
    });

    // Open clicked card if it wasn't active
    if (!isActive) {
      faqCard.classList.add("active");
    }
  });
}



/**
 * Service Detail Modal
 */

const serviceBtns = document.querySelectorAll("[data-service-btn]");
const serviceDetails = document.querySelectorAll("[data-service-detail]");
const serviceCloseBtns = document.querySelectorAll("[data-service-close]");

// Open service detail modal
for (let i = 0; i < serviceBtns.length; i++) {
  serviceBtns[i].addEventListener("click", function () {
    const serviceCard = this.closest("[data-service-card]").parentElement;
    const serviceDetail = serviceCard.querySelector("[data-service-detail]");
    
    if (serviceDetail) {
      serviceDetail.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
  });
}

// Close service detail modal
for (let i = 0; i < serviceCloseBtns.length; i++) {
  serviceCloseBtns[i].addEventListener("click", function () {
    const serviceDetail = this.closest("[data-service-detail]");
    if (serviceDetail) {
      serviceDetail.classList.remove("active");
      document.body.style.overflow = ""; // Restore scrolling
    }
  });
}

// Close modal when clicking outside
for (let i = 0; i < serviceDetails.length; i++) {
  serviceDetails[i].addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("active");
      document.body.style.overflow = ""; // Restore scrolling
    }
  });
}

// Close modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    serviceDetails.forEach(detail => {
      if (detail.classList.contains("active")) {
        detail.classList.remove("active");
        document.body.style.overflow = ""; // Restore scrolling
      }
    });
  }
});



/**
 * Dropdown Menu
 */

const dropdownToggles = document.querySelectorAll("[data-dropdown-toggle]");

// Close dropdown when clicking outside
document.addEventListener("click", function (e) {
  if (!e.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown").forEach(dropdown => {
      dropdown.classList.remove("active");
    });
  }
});

// Handle dropdown link clicks
document.querySelectorAll(".dropdown-link").forEach(link => {
  link.addEventListener("click", function () {
    // Close mobile menu when clicking a dropdown link
    if (navbar.classList.contains("active")) {
      navbar.classList.remove("active");
      overlay.classList.remove("active");
    }
    // Close dropdown
    document.querySelectorAll(".dropdown").forEach(dropdown => {
      dropdown.classList.remove("active");
    });
  });
});



/**
 * Contact Form Submission
 */

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      service: document.getElementById("service").value,
      message: document.getElementById("message").value.trim()
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      showMessage("Please fill in all required fields.", "error");
      return;
    }
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    
    try {
      // Determine API URL
      let apiUrl;
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      
      // If opened via file:// protocol or no hostname, use localhost
      if (protocol === 'file:' || !hostname || hostname === '') {
        apiUrl = 'http://localhost:3000/api/contact';
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        apiUrl = `http://${hostname}:3000/api/contact`;
      } else {
        // Production - use relative path or full URL
        apiUrl = '/api/contact';
      }
      
      console.log('Submitting to:', apiUrl);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message || "Thank you for your inquiry! We will get back to you soon.", "success");
        contactForm.reset();
      } else {
        showMessage(result.message || "Something went wrong. Please try again later.", "error");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // If server is not available or timeout, offer mailto fallback
      if (error.name === 'AbortError' || error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Server not available')) {
        // Create mailto link as fallback
        const subject = encodeURIComponent('Contact Inquiry - UNIRATH INFOTECH');
        const body = encodeURIComponent(
          `Name: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          `Phone: ${formData.phone || 'Not provided'}\n` +
          `Service: ${formData.service || 'Not specified'}\n\n` +
          `Message:\n${formData.message}`
        );
        const mailtoLink = `mailto:support@unirathinfo.com?subject=${subject}&body=${body}`;
        
        // Show message with mailto option
        const fallbackMessage = `
          <p><strong>Server is not running.</strong></p>
          <p>To enable form submission, please start the backend server:</p>
          <ol style="text-align: left; margin: 10px 0;">
            <li>Install Node.js from <a href="https://nodejs.org" target="_blank">nodejs.org</a></li>
            <li>Run: <code>npm install</code> in terminal</li>
            <li>Run: <code>npm start</code></li>
          </ol>
          <p>Or click below to send via email:</p>
          <a href="${mailtoLink}" class="btn" style="margin-top: 10px; display: inline-block;">Send via Email</a>
        `;
        
        formMessage.innerHTML = fallbackMessage;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        // Other errors
        let errorMessage = "Unable to send message. ";
        if (error.message.includes('status:')) {
          errorMessage += `Server error: ${error.message}. `;
        } else {
          errorMessage += `Error: ${error.message}. `;
        }
        errorMessage += "You can also contact us directly at support@unirathinfo.com";
        showMessage(errorMessage, "error");
      }
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

function showMessage(message, type) {
  if (!formMessage) return;
  
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";
  
  // Scroll to message
  formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
  
  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 5000);
  }
}