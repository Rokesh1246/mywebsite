document.addEventListener('DOMContentLoaded', () => {
    
    // ELEMENTS
    const openBtn = document.getElementById('open-btn');
    const doorScreen = document.getElementById('door-screen');
    const mainContent = document.getElementById('main-content');
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');

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
            // Even if autoplay fails, still show control button so user can click it manually
            musicBtn.classList.remove('hidden');
        });

        // Hide door screen after transition completes
        setTimeout(() => {
            doorScreen.classList.add('hidden');
            mainContent.classList.remove('hidden');
            // Trigger canvas animation resize
            resizeCanvas();
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
        // Prevent floating hearts when clicking inputs, buttons, or links
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.closest('a')) {
            return;
        }
        const heart = document.createElement('div');
        heart.className = 'click-heart';
        heart.innerHTML = '❤️';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        document.body.appendChild(heart);
        setTimeout(() => {
            heart.remove();
        }, 1200);
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
            
            // Visual click feedback
            likeBtn.style.transform = 'scale(0.85)';
            setTimeout(() => {
                likeBtn.style.transform = '';
            }, 150);
            
            // Explode floaty hearts from the button center
            const rect = likeBtn.getBoundingClientRect();
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;
            
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.className = 'click-heart';
                    heart.innerHTML = '❤️';
                    const offset = (Math.random() - 0.5) * 30;
                    heart.style.left = `${btnX + offset}px`;
                    heart.style.top = `${btnY}px`;
                    document.body.appendChild(heart);
                    setTimeout(() => {
                        heart.remove();
                    }, 1200);
                }, i * 80);
            }
        });
    }
});
