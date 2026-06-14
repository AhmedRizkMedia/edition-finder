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
  // 4. How It Works Timeline Progress
  // ==========================================
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3')
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
            progressLine.style.width = '50%';
          } else if (stepId === 'step-3') {
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
  // 5. Packages Selection and Pre-select Form
  // ==========================================
  const packageSelect = document.getElementById('packageSelect');
  const packageButtons = document.querySelectorAll('[data-package]');

  packageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedPackageName = btn.getAttribute('data-package');
      if (packageSelect && selectedPackageName) {
        // Find matching option value
        let matchValue = "";
        if (selectedPackageName.includes("One")) {
          matchValue = "Edition One — $149";
        } else if (selectedPackageName.includes("Plus")) {
          matchValue = "Edition Plus — $299";
        } else if (selectedPackageName.includes("Elite")) {
          matchValue = "Edition Elite — $499";
        }

        if (matchValue) {
          packageSelect.value = matchValue;
          // Trigger style removal for invalid fields if they selected one
          const parentFormGroup = packageSelect.closest('.form-group');
          if (parentFormGroup) {
            parentFormGroup.classList.remove('invalid');
          }
        }
      }
    });
  });

  // ==========================================
  // 6. FAQ Accordion Panels
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    if (trigger && panel) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items first
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            const otherPanel = otherItem.querySelector('.faq-panel');
            if (otherTrigger && otherPanel) {
              otherTrigger.setAttribute('aria-expanded', 'false');
              otherPanel.style.maxHeight = null;
            }
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }
  });

  // ==========================================
  // 7. Form Validation and Submission (Success UI Transition)
  // ==========================================
  const form = document.getElementById('blueprint-form');
  const formCardWrapper = document.getElementById('form-card-wrapper');
  const formStateActive = document.getElementById('form-state-active');
  const formStateSuccess = document.getElementById('form-state-success');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const spinner = submitBtn ? submitBtn.querySelector('.loader-spinner') : null;
  const successUserEmail = document.getElementById('success-user-email');
  const successPackageCost = document.getElementById('success-package-cost');
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
        } else if (input.type === 'url' && !validateUrl(input.value)) {
          formGroup.classList.add('invalid');
          isFormValid = false;
        } else {
          formGroup.classList.remove('invalid');
        }
      });

      // Validate optional website URL if it has a value
      const websiteInput = document.getElementById('website');
      if (websiteInput) {
        const wGroup = websiteInput.closest('.form-group');
        const webVal = websiteInput.value.trim();
        if (webVal !== "" && !validateUrl(webVal)) {
          wGroup.classList.add('invalid');
          isFormValid = false;
        } else {
          wGroup.classList.remove('invalid');
        }
      }

      // Handle package select validation explicitly
      if (packageSelect) {
        const pGroup = packageSelect.closest('.form-group');
        if (packageSelect.value === "") {
          pGroup.classList.add('invalid');
          isFormValid = false;
        } else {
          pGroup.classList.remove('invalid');
        }
      }

      if (isFormValid) {
        // Trigger submitting state
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Analyzing Business Profile...';
        if (spinner) spinner.style.display = 'inline-block';

        // Read field values
        const emailVal = document.getElementById('email').value.trim();
        const packageVal = packageSelect ? packageSelect.value : 'Edition Plus — $299';

        // Simulate 1.5 second strategic diagnostic scanning latency
        setTimeout(() => {
          // Update Success UI fields
          if (successUserEmail) successUserEmail.textContent = emailVal;
          if (successPackageCost) successPackageCost.textContent = packageVal;

          // Transition panels
          formStateActive.style.display = 'none';
          formStateSuccess.style.display = 'block';

          // Reset loader state for button
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Request My Business Blueprint';
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
          if (element.id === 'website') {
            // Website is optional, clear error if empty or if it becomes valid
            if (element.value.trim() === '' || validateUrl(element.value.trim())) {
              group.classList.remove('invalid');
            }
          } else if (element.value.trim() !== '') {
            group.classList.remove('invalid');
          }
        }
      });
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

  // URL helper validator
  function validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      const re = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      return re.test(url);
    }
  }

  // ==========================================
  // 8. Copy Payment Details Utility
  // ==========================================
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const copyVal = btn.getAttribute('data-copy');
      if (copyVal) {
        navigator.clipboard.writeText(copyVal).then(() => {
          // Success Feedback
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.classList.add('copied');

          // Reset feedback after delay
          setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      }
    });
  });

});
