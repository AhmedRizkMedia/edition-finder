document.addEventListener('DOMContentLoaded', () => {

      // ==========================================
  // 1. Mobile Menu Toggle & Overlay Backdrop
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Create overlay backdrop if not present
  let navOverlay = document.querySelector('.nav-overlay');
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  function toggleMenu(open) {
    if (!mobileToggle || !navMenu) return;
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('active');
    if (shouldOpen) {
      mobileToggle.classList.add('active');
      navMenu.classList.add('active');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        toggleMenu(false);
      });
    }

    // Direct click handler for all links inside mobile drawer menu
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        toggleMenu(false);

        if (href && href.startsWith('#') && href !== '#') {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            setTimeout(() => {
              const headerOffset = 80;
              const elementPosition = target.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }, 120);
          }
        }
      });
    });
  }

  // ==========================================
  // 2. Smooth Scrolling for Navigation
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 3. Scroll Reveal & Section Focus Observer
  // ==========================================
  const revealElements = document.querySelectorAll('.fade-in-up');
  
  const revealOnScrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealOnScrollObserver.observe(el);
  });

  // ==========================================
  // 4. How It Works Timeline Progress (4 Steps)
  // ==========================================
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ];
  const progressLine = document.getElementById('timeline-progress');

  if (steps[0]) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepId = entry.target.id;
          
          // Add active class to badge or parent timeline item
          const stepElement = entry.target.closest('.timeline-step-item') || entry.target;
          stepElement.classList.add('active');
          
          // Update timeline progress percentage if progress line exists
          if (progressLine) {
            if (stepId === 'step-1') {
              progressLine.style.width = '15%';
            } else if (stepId === 'step-2') {
              progressLine.style.width = '45%';
            } else if (stepId === 'step-3') {
              progressLine.style.width = '75%';
            } else if (stepId === 'step-4') {
              progressLine.style.width = '100%';
            }
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    });

    steps.forEach(step => {
      if (step) stepObserver.observe(step);
    });
  }

  // ==========================================
  // 5. Form Validation and Submission (Success UI Transition)
  // ==========================================
  const form = document.getElementById('blueprint-form');
  const formCardWrapper = document.getElementById('form-card-wrapper');
  const formStateActive = document.getElementById('form-state-active');
  const formStateSuccess = document.getElementById('form-state-success');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const spinner = submitBtn ? submitBtn.querySelector('.loader-spinner') : null;
  const resetFormBtn = document.getElementById('btn-reset-form');

  if (form && formStateActive && formStateSuccess) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      const requiredInputs = form.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        
        // Input validation checks
        if (!input.value.trim()) {
          formGroup.classList.add('invalid');
          isFormValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          formGroup.classList.add('invalid');
          isFormValid = false;
        } else {
          formGroup.classList.remove('invalid');
        }
      });

      if (isFormValid) {
        const originalText = btnText ? btnText.textContent : "LET'S TALK";
        
        // Trigger submitting state
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) {
          const currentLang = document.documentElement.lang || 'en';
          if (currentLang === 'ar') {
            btnText.textContent = 'جاري الإرسال...';
          } else if (currentLang === 'fr') {
            btnText.textContent = 'Envoi en cours...';
          } else {
            btnText.textContent = 'Sending message...';
          }
        }
        if (spinner) spinner.style.display = 'inline-block';

        // Submit form data to Netlify Forms asynchronously
        try {
          const formData = new FormData(form);
          fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
          }).catch(err => console.log('Netlify form submit error:', err));
        } catch (e) {
          console.log('Form submission error:', e);
        }

        // Simulate 1.5 second strategic diagnostic scanning latency
        setTimeout(() => {
          // Transition panels
          formStateActive.style.display = 'none';
          formStateSuccess.style.display = 'block';

          // Reset loader state for button
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = originalText;
          if (spinner) spinner.style.display = 'none';

          // Scroll wrapper to top of the success card container smoothly
          const cardOffset = formCardWrapper.getBoundingClientRect().top;
          const targetScrollTop = cardOffset + window.pageYOffset - 90;
          window.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
        }, 1500);
      }
    });

    // Remove errors dynamically when user corrects inputs
    form.querySelectorAll('input, textarea, select').forEach(element => {
      element.addEventListener('input', () => {
        const group = element.closest('.form-group');
        if (group && group.classList.contains('invalid')) {
          if (element.value.trim() !== '') {
            group.classList.remove('invalid');
          }
        }
      });
      
      // Select fields change listener
      if (element.tagName === 'SELECT') {
        element.addEventListener('change', () => {
          const group = element.closest('.form-group');
          if (group && group.classList.contains('invalid') && element.value !== '') {
            group.classList.remove('invalid');
          }
        });
      }
    });

    // Success State Reset Button
    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        form.reset();
        formStateSuccess.style.display = 'none';
        formStateActive.style.display = 'block';
      });
    }
  }

  // Email helper validator
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

});
