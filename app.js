document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Menu Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .scroll-trigger-btn');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
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

  if (progressLine && steps[0]) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepId = entry.target.id;
          entry.target.classList.add('active');
          
          // Update timeline progress percentage
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
      });
    }, {
      threshold: 0.6,
      rootMargin: '0px 0px -100px 0px'
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
        // Trigger submitting state
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Sending message...';
        if (spinner) spinner.style.display = 'inline-block';

        // Simulate 1.5 second strategic diagnostic scanning latency
        setTimeout(() => {
          // Transition panels
          formStateActive.style.display = 'none';
          formStateSuccess.style.display = 'block';

          // Reset loader state for button
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = "LET'S TALK";
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
