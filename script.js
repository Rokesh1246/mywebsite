document.addEventListener('DOMContentLoaded', () => {
    
    // ELEMENTS
    const openBtn = document.getElementById('open-btn');
    const doorScreen = document.getElementById('door-screen');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');

    // HELPER: EXPLODE HEARTS PARTICLE EFFECT
    function explodeHearts(x, y, count = 25) {
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'click-heart';
            heart.innerHTML = '❤️';
            
            // Random angle and wider distance to scatter fully across the screen
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 220 + 60; // Wide splash radius
            const velocityX = Math.cos(angle) * distance;
            const velocityY = Math.sin(angle) * distance;
            
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.transform = 'translate(-50%, -50%) scale(0.6)';
            heart.style.transition = 'transform 1.5s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 1.5s ease-out';
            
            document.body.appendChild(heart);
            
            // Trigger transition
            requestAnimationFrame(() => {
                heart.style.transform = `translate(calc(-50% + ${velocityX}px), calc(-50% + ${velocityY - 180}px)) scale(1.6) rotate(${(Math.random() - 0.5) * 80}deg)`;
                heart.style.opacity = '0';
            });
            
            setTimeout(() => {
                heart.remove();
            }, 1500);
        }
    }

    // 1. OPEN DOOR CLICK EVENT
    openBtn.addEventListener('click', () => {
        // Add opened class to start animations
        doorScreen.classList.add('opened');
        
        // Play background music (requires user interaction first, which this click satisfies)
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            musicBtn.classList.remove('hidden');
            musicBtn.classList.add('playing');
        }).catch(err => {
            console.log("Audio autoplay prevented: ", err);
            musicBtn.classList.remove('hidden');
        });

        // Hide door screen after transition completes and explode hearts!
        setTimeout(() => {
            doorScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            // Trigger canvas animation resize
            resizeCanvas();
            // Splendid heart burst from the center of the screen
            explodeHearts(window.innerWidth / 2, window.innerHeight / 2, 32);
        }, 1200);
    });

    // 2. MUSIC PLAY/PAUSE TOGGLE
    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.classList.add('playing');
        } else {
            bgMusic.pause();
            musicBtn.classList.remove('playing');
        }
    });

    // 3. CANVAS ANIMATION (FALLING MARIGOLD PETALS)
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const maxParticles = 35;
    const colors = [
        '#FF8C00', // Deep Orange
        '#FFA500', // Orange
        '#FFD700', // Gold Yellow
        '#FFE4B5'  // Soft peach/cream
    ];

    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 1.5 + 0.8;
            this.speedX = Math.random() * 1 - 0.5;
            this.opacity = Math.random() * 0.5 + 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.angle = Math.random() * 360;
            this.spinSpeed = Math.random() * 2 - 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 30) * 0.5; // sway effect
            this.angle += this.spinSpeed;

            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
                this.speedY = Math.random() * 1.5 + 0.8;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size / 1.7, 0, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Petal());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationFrameId = requestAnimationFrame(animate);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    // 4. FLOATING SPARKLING CLICK HEARTS
    document.addEventListener('click', (e) => {
        // Prevent floating elements when clicking interactive components
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.closest('a')) {
            return;
        }
        // Spawn 4 mini-exploding hearts at tap location
        explodeHearts(e.clientX, e.clientY, 4);
    });

    // 5. LIKE BUTTON BLESSING COUNTER AND ANIMATION
    const likeBtn = document.getElementById('like-btn');
    const likeCountSpan = document.getElementById('like-count');
    
    // Seed initial count in localStorage or use default
    let blessingCount = parseInt(localStorage.getItem('housewarming_likes') || '128');
    if (likeCountSpan) {
        likeCountSpan.textContent = blessingCount;
    }
    
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            blessingCount++;
            localStorage.setItem('housewarming_likes', blessingCount.toString());
            if (likeCountSpan) {
                likeCountSpan.textContent = blessingCount;
            }
            
            // Visual click bounce
            likeBtn.style.transform = 'scale(0.85)';
            setTimeout(() => {
                likeBtn.style.transform = '';
            }, 150);
            
            // Hide the tap hint indicator
            const tapHint = likeBtn.querySelector('.tap-hint');
            if (tapHint) {
                tapHint.style.display = 'none';
            }
            
            // Explode a massive shower of hearts scattering across the screen!
            const rect = likeBtn.getBoundingClientRect();
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;
            
            explodeHearts(btnX, btnY, 35);
        });
    }

    // 6. PERSONALIZATION QUERY PARAMETER HANDLER
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('name') || urlParams.get('guest');
    
    if (guestName) {
        guestName = guestName.trim();
        // Capitalize first letter of every word (Title Case)
        guestName = guestName.replace(/\b\w/g, char => char.toUpperCase());
        // Automatically append " & Family" if the user only entered a name without 'family'
        if (guestName && !guestName.toLowerCase().includes('family')) {
            guestName = guestName + ' & Family';
        }

        const welcomeGreeting = document.getElementById('personalized-greeting');
        const welcomeNameSpan = document.getElementById('guest-name-welcome');
        const mainGreeting = document.getElementById('main-personalized-greeting');
        const mainNameSpan = document.getElementById('guest-name-main');
        
        if (welcomeGreeting && welcomeNameSpan) {
            welcomeNameSpan.textContent = guestName;
            welcomeGreeting.classList.remove('hidden');
        }
        if (mainGreeting && mainNameSpan) {
            mainNameSpan.textContent = guestName;
            mainGreeting.classList.remove('hidden');
        }
    }

    // 8. COUNTDOWN TIMER
    const targetDate = new Date('2026-09-17T04:30:00+05:30').getTime(); // 4:30 AM IST on Sep 17, 2026
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;
        
        const daysSpan = document.getElementById('countdown-days');
        const hoursSpan = document.getElementById('countdown-hours');
        const minutesSpan = document.getElementById('countdown-minutes');
        const secondsSpan = document.getElementById('countdown-seconds');
        
        if (difference < 0) {
            // Event has started/passed
            if (daysSpan) daysSpan.textContent = '00';
            if (hoursSpan) hoursSpan.textContent = '00';
            if (minutesSpan) minutesSpan.textContent = '00';
            if (secondsSpan) secondsSpan.textContent = '00';
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        if (daysSpan) daysSpan.textContent = String(days).padStart(2, '0');
        if (hoursSpan) hoursSpan.textContent = String(hours).padStart(2, '0');
        if (minutesSpan) minutesSpan.textContent = String(minutes).padStart(2, '0');
        if (secondsSpan) secondsSpan.textContent = String(seconds).padStart(2, '0');
    }
    
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // initial call
});
