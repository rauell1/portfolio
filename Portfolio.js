  // Hide loader after 1.5 seconds (1500 milliseconds)
  window.addEventListener("load", () => {
    setTimeout(() => {
      const loader = document.getElementById("loader");
      const mainContent = document.getElementById("main-content");

      loader.style.opacity = "0";
      loader.style.transition = "opacity 0.5s ease"; // fade out effect

      setTimeout(() => {
        loader.style.display = "none";
        mainContent.style.display = "block";
      }, 500); // wait for fade-out animation
    }, 1000); // duration before hiding loader
  });


    // Custom cursor
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor interactions
    document.querySelectorAll('a, button, .card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
      });
    });

    // Progress bar
    window.addEventListener('scroll', () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      document.getElementById('progressBar').style.width = scrolled + '%';
    });

    // Create floating particles
    function createParticles() {
      const particles = document.getElementById('particles');
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particles.appendChild(particle);
      }
    }
    createParticles();

    // Enhanced reveal on scroll with stagger
    const revealEls = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));

    // Enhanced and enlarged chart with better styling
    const ctx = document.getElementById('skillsChart').getContext('2d');
    const skillsChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Solar PV Design', 'EV Charging Systems', 'Sales Strategy', 'Policy Advocacy', 'Project Management', 'Community Engagement'],
        datasets: [{
          label: "Roy's Skills",
          data: [9, 8, 7, 7, 8, 10],
          backgroundColor: 'rgba(0,121,107,0.2)',
          borderColor: '#00796b',
          borderWidth: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#00796b',
          pointBorderWidth: 4,
          pointRadius: 8,
          pointHoverRadius: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        elements: { 
          line: { tension: 0.3 }
        },
        scales: {
          r: {
            angleLines: { 
              display: true,
              color: 'rgba(0,121,107,0.3)',
              lineWidth: 2
            },
            grid: {
              color: 'rgba(0,121,107,0.2)',
              lineWidth: 2
            },
            pointLabels: {
              font: {
                size: 14,
                weight: 'bold'
              },
              color: '#102027'
            },
            ticks: {
              display: false,
              stepSize: 2,
              max: 10
            },
            suggestedMin: 0,
            suggestedMax: 10
          }
        },
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,121,107,0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#00796b',
            borderWidth: 2
          }
        },
        animation: {
          duration: 2500,
          easing: 'easeInOutQuart'
        }
      }
    });

    // Contact form with enhanced feedback
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const msg = document.getElementById('message').value.trim();
      
      if (!name || !email || !msg) {
        alert('Please complete all fields.');
        return;
      }
      
      const button = this.querySelector('button');
      const originalText = button.textContent;
      button.textContent = 'Sending...';
      button.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
      
      setTimeout(() => {
        alert(`Thanks ${name}! I'll get back to you soon.`);
        this.reset();
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, var(--accent), var(--accent-2))';
      }, 1500);
    });

    // CV download with animation
    document.getElementById('downloadBtn').addEventListener('click', function(e) {
      e.preventDefault();
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
        // Replace with actual CV URL
        const cvUrl = 'mailto:roy@example.com?subject=CV Request';
        window.open(cvUrl, '_blank');
      }, 150);
    });

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.hero');
      const overlay = document.querySelector('.overlay');
      
      if (hero && overlay) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        overlay.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    });

    // Enhanced mobile optimization
    function handleMobileOptimizations() {
      if (window.matchMedia('(max-width: 768px)').matches) {
        const bgVideo = document.querySelector('.bg-video');
        if (bgVideo) {
          bgVideo.pause();
          bgVideo.style.display = 'none';
        }
        
        // Reduce particles on mobile
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
          if (index > 5) particle.remove();
        });
      }
    }
    
    handleMobileOptimizations();
    window.addEventListener('resize', handleMobileOptimizations);

    // Smooth scroll for navigation
    document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
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

    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
      if (e.key.toLowerCase() === 'c' && !e.ctrlKey) {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Add dynamic background color change based on scroll
    window.addEventListener('scroll', () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const hue = Math.floor(scrollPercent * 60 + 180); // Blue to green range
      document.body.style.background = `linear-gradient(180deg, hsl(${hue}, 30%, 95%) 0%, hsl(${hue}, 20%, 98%) 100%)`;
    });
   

    
  (function () {
    if (!('querySelectorAll' in document)) return;
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
      // Create a pointer-friendly hover: add/remove class for pointerenter/pointerleave
      card.addEventListener('pointerenter', () => {
        card.classList.add('hovered');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('hovered');
      });

      // Handle taps on touch devices: toggle .is-active
      card.addEventListener('click', (e) => {
        // Ignore clicks on links/buttons inside the card
        const target = e.target;
        if (target.tagName === 'A' || target.tagName === 'BUTTON') return;

        // Toggle active class (tap to open, tap again to close)
        card.classList.toggle('is-active');

        // Close other cards (optional): uncomment to only allow one open card at a time
        // cards.forEach(c => { if (c !== card) c.classList.remove('is-active'); });
      });

      // Optional: close active card when clicking outside
      document.addEventListener('click', (evt) => {
        if (!card.contains(evt.target)) card.classList.remove('is-active');
      });
    });
  })();

const reveals = document.querySelectorAll('.reveal');

window.addEventListener('scroll', () => {
  for (let i = 0; i < reveals.length; i++) {
    const windowHeight = window.innerHeight;
    const revealTop = reveals[i].getBoundingClientRect().top;
    const revealPoint = 150;

    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add('active');
    } else {
      reveals[i].classList.remove('active');
    }
  }
});
