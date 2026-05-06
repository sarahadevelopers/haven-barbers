 // ========== MOBILE MENU (with close X) ==========
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const closeNav = document.getElementById('nav-close');
  if (toggle) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('active'));
  }
  if (closeNav) {
    closeNav.addEventListener('click', () => navLinks.classList.remove('active'));
  }
  document.querySelectorAll('.nav-links a').forEach(link => 
    link.addEventListener('click', () => navLinks.classList.remove('active'))
  );

  // ========== BEFORE/AFTER SLIDER ==========
  const slider = document.getElementById('baSlider');
  const afterImg = document.getElementById('afterImg');
  if (slider && afterImg) {
    slider.addEventListener('input', (e) => {
      afterImg.style.clipPath = `inset(0 0 0 ${100 - e.target.value}%)`;
    });
  }

  // ========== SCROLL REVEAL (Intersection Observer) ==========
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.2 });
  reveals.forEach(el => revealObserver.observe(el));

  // ========== STAGGERED PACKAGE CARDS REVEAL ==========
  const packageCards = document.querySelectorAll('.package-card');
  const observerPack = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('active'), idx * 150);
      }
    });
  }, { threshold: 0.5 });
  packageCards.forEach(card => observerPack.observe(card));

  // ========== NAVBAR SCROLL EFFECT ==========
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (nav) {
      if (window.scrollY > 50) nav.style.background = "rgba(11,11,12,0.95)";
      else nav.style.background = "rgba(11,11,12,0.85)";
    }
  });

  // ========== DUAL-WING SCROLL-DRIVEN CINEMATIC EXPANSION ==========
  const dualWing = document.getElementById('dualWing');
  if (dualWing) {
    let ticking = false;

    function updateDualWingState() {
      const rect = dualWing.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight * 0.85) {
        dualWing.classList.add('active');
      } else {
        dualWing.classList.remove('active');
      }

      if (rect.top < windowHeight * 0.6) {
        dualWing.classList.add('state-1');
      } else {
        dualWing.classList.remove('state-1');
      }

      if (rect.top < windowHeight * 0.3) {
        dualWing.classList.remove('state-1');
        dualWing.classList.add('state-2');
      } else {
        dualWing.classList.remove('state-2');
      }
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDualWingState();
          ticking = false;
        });
        ticking = true;
      }
    });
    window.addEventListener('resize', updateDualWingState);
    updateDualWingState();
  }

  // ========== ENHANCED MULTI-STEP BOOKING MODAL (with Back & Auto‑advance) ==========
  const modal = document.getElementById('bookingModal');
  if (modal) {
    const steps = document.querySelectorAll('.step');
    const progress = document.querySelector('.progress');
    let currentStep = 0;
    let bookingData = { package: "", datetime: "", name: "", phone: "" };

    function updateProgress() {
      if (progress) {
        const percent = ((currentStep + 1) / steps.length) * 100;
        progress.style.width = percent + '%';
      }
    }

    function showStep(n) {
      steps.forEach((step, i) => {
        step.classList.toggle('active', i === n);
      });
      updateProgress();

      // Auto-focus first input in the visible step (better mobile UX)
      const activeInput = steps[n]?.querySelector('input');
      if (activeInput) setTimeout(() => activeInput.focus(), 100);

      // If we reach step 4, refresh the summary
      if (n === 3) {
        const summaryDiv = document.getElementById('summary');
        if (summaryDiv && bookingData.datetime) {
          const formattedDate = new Date(bookingData.datetime).toLocaleString('en-KE', {
            dateStyle: 'full',
            timeStyle: 'short'
          });
          summaryDiv.innerHTML = `
            <div style="background:rgba(255,255,255,0.05); border-radius:16px; padding:16px; border-left:3px solid #D4AF37;">
              <p><strong>Package</strong><br>${bookingData.package}</p>
              <p><strong>Date & Time</strong><br>${formattedDate}</p>
              <p><strong>Name</strong><br>${bookingData.name}</p>
              <p><strong>Phone</strong><br>${bookingData.phone}</p>
            </div>
          `;
        }
      }
    }

    // Open modal from any package button
    document.querySelectorAll('.view-package').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.package-card');
        if (card) {
          bookingData.package = card.querySelector('h3')?.innerText || "Executive Package";
        } else {
          bookingData.package = "Executive Package";
        }
        const stepPackageName = document.getElementById('stepPackageName');
        if (stepPackageName) stepPackageName.innerText = `✨ ${bookingData.package}`;

        // Reset to step 1
        currentStep = 0;
        showStep(0);
        modal.classList.add('active');

        // AUTO-ADVANCE: after 1 second, go to step 2 (datetime)
        setTimeout(() => {
          if (currentStep === 0 && modal.classList.contains('active')) {
            currentStep = 1;
            showStep(1);
            // Preset datetime to next hour
            const dtInput = document.getElementById('stepDateTime');
            if (dtInput) {
              const now = new Date();
              now.setHours(now.getHours() + 1);
              now.setMinutes(0, 0, 0);
              const tzOffset = now.getTimezoneOffset() * 60000;
              const localISOTime = new Date(now - tzOffset).toISOString().slice(0, 16);
              dtInput.value = localISOTime;
              dtInput.min = new Date().toISOString().slice(0, 16);
            }
          }
        }, 1000);
      });
    });

    // NEXT button logic (works on all steps where .next-btn exists)
    document.querySelectorAll('.next-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Step 2 validation (datetime)
        if (currentStep === 1) {
          const datetime = document.getElementById('stepDateTime')?.value;
          if (!datetime) {
            alert("Please select a date & time.");
            return;
          }
          bookingData.datetime = datetime;
        }
        // Step 3 validation (name + phone)
        else if (currentStep === 2) {
          const name = document.getElementById('stepName')?.value.trim();
          const phone = document.getElementById('stepPhone')?.value.trim();
          if (!name || !phone) {
            alert("Please fill in your name and phone number.");
            return;
          }
          bookingData.name = name;
          bookingData.phone = phone;
        }

        // Advance to next step if not last
        if (currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      });
    });

    // BACK button logic
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          showStep(currentStep);
        }
      });
    });

    // FINAL confirmation – send WhatsApp
    const confirmBtn = document.getElementById('confirmBooking');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (!bookingData.datetime || !bookingData.name || !bookingData.phone) {
          alert("Please complete all steps before confirming.");
          return;
        }
        const formattedDate = new Date(bookingData.datetime).toLocaleString('en-KE', {
          dateStyle: 'full',
          timeStyle: 'short'
        });
        const message = `*HAVEN EXECUTIVE BOOKING*\n\n👤 Name: ${bookingData.name}\n📞 Phone: ${bookingData.phone}\n💼 Package: ${bookingData.package}\n📅 Date: ${formattedDate}\n\nPlease confirm my appointment.`;
        const phone = "254724899936";
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        modal.classList.remove('active');
      });
    }

    // Close modal on X or outside click
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) closeModal.addEventListener('click', () => modal.classList.remove('active'));
    window.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
  }

  // ========== CONTACT FORM (WHATSAPP) ==========
  const contactBtn = document.getElementById('contactWhatsAppBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const name = document.getElementById('contactName')?.value.trim();
      const service = document.getElementById('contactService')?.value;
      const datetime = document.getElementById('contactDateTime')?.value;
      if (!name || !service || !datetime) { alert("Please fill all fields."); return; }
      const formatted = new Date(datetime).toLocaleString('en-KE', { dateStyle: 'full', timeStyle: 'short' });
      const msg = `*HAVEN BOOKING*\n\n👤 Name: ${name}\n💼 Service: ${service}\n📅 Date: ${formatted}\n\nPlease call me to confirm.`;
      window.open(`https://wa.me/254724899936?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
  // Mobile action bar – open modal when "Book Slot" is tapped
const bookingTrigger = document.querySelector('.booking-trigger');
if (bookingTrigger) {
  bookingTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    // Scroll to packages section first, then open modal
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
      // Wait for scroll to finish before opening modal (optional)
      setTimeout(() => {
        // Simulate click on the first "VIEW EXPERIENCE" button to open modal
        const firstPackageBtn = document.querySelector('.view-package');
        if (firstPackageBtn) firstPackageBtn.click();
      }, 500);
    }
  });
}

  // ========== DYNAMIC FOOTER YEAR ==========
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.innerText = new Date().getFullYear();