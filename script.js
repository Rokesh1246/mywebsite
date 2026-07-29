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
    const guestName = urlParams.get('name') || urlParams.get('guest');
    
    if (guestName) {
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

    // 7. SECRET GUEST LINK GENERATOR ADMIN PANEL
    const madeWithLove = document.querySelector('.made-with-love');
    const adminPanel = document.getElementById('admin-panel');
    let clickCount = 0;
    
    if (madeWithLove && adminPanel) {
        madeWithLove.style.cursor = 'pointer';
        madeWithLove.addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                adminPanel.classList.remove('hidden');
                adminPanel.scrollIntoView({ behavior: 'smooth' });
                clickCount = 0; // reset
            }
        });
    }

    // Generator logic
    const generatorInput = document.getElementById('generator-guest-name');
    const generatorCopyBtn = document.getElementById('generator-copy-btn');
    const generatorWhatsappBtn = document.getElementById('generator-whatsapp-btn');
    const adminStatus = document.getElementById('admin-status');
    
    function getInviteMessage(nameVal) {
        const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
        const personalUrl = `${baseUrl}?name=${encodeURIComponent(nameVal)}`;
        
        return `*HOUSEWARMING CEREMONY INVITATION* 🏡✨\n\n` +
               `Dear *${nameVal}*,\n\n` +
               `With the blessings of the Almighty, we joyfully invite you and your family to celebrate the Housewarming Ceremony of our new home.\n\n` +
               `📅 *Date:* Thursday, September 17, 2026\n` +
               `🕟 *Time:* 4:30 AM – 6:30 AM\n` +
               `📍 *Venue:* Nallanna Puram, Pudukkudi, Thanjavur\n\n` +
               `Please click the link below to open your personalized digital invitation card, listen to the music, and get maps directions:\n` +
               `👉 ${personalUrl}\n\n` +
               `We look forward to your gracious presence and blessings!\n\n` +
               `Warm welcomes from,\n` +
               `*Govindharaj & Family*`;
    }
    
    if (generatorCopyBtn && generatorInput) {
        // Copy formatted message to clipboard
        generatorCopyBtn.addEventListener('click', () => {
            const nameVal = generatorInput.value.trim();
            if (!nameVal) {
                adminStatus.textContent = "Please enter a guest name first!";
                adminStatus.style.color = "red";
                return;
            }
            
            const message = getInviteMessage(nameVal);
            
            navigator.clipboard.writeText(message).then(() => {
                adminStatus.textContent = `Copied complete invitation message for ${nameVal}! You can paste it directly on WhatsApp.`;
                adminStatus.style.color = "#AA7C11";
                generatorInput.value = "";
            }).catch(err => {
                adminStatus.textContent = "Error copying. Try sharing directly using the WhatsApp button!";
                adminStatus.style.color = "red";
            });
        });
    }

    if (generatorWhatsappBtn && generatorInput) {
        // Open WhatsApp directly with prefilled message
        generatorWhatsappBtn.addEventListener('click', () => {
            const nameVal = generatorInput.value.trim();
            if (!nameVal) {
                adminStatus.textContent = "Please enter a guest name first!";
                adminStatus.style.color = "red";
                return;
            }
            
            const message = getInviteMessage(nameVal);
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            
            adminStatus.textContent = `Opening WhatsApp to share with ${nameVal}...`;
            adminStatus.style.color = "green";
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                generatorInput.value = "";
                adminStatus.textContent = "";
            }, 1000);
        });
    }
});
