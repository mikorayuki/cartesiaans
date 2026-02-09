/* ===================================
   FILE: script.js
   Fungsi Animasi Canggih (v2)
=================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ===== 1. ANIMASI HEADER SAAT SCROLL (Mengecil) =====
    
    const header = document.getElementById('main-header');
    if (header) {
        // Cek saat load
        if (window.scrollY > 50) header.classList.add('scrolled');
        
        // Cek saat scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===== 2. ANIMASI KETIK (TYPING) =====

    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const texts = [
            "Pendidikan Matematika",
            "UIN Sunan Ampel Surabaya",
            "Mathematic Education",
            "Angkatan 2025"
        ];
        
        let textIndex = 0, charIndex = 0, isDeleting = false;
        let typingSpeed = 100, erasingSpeed = 50, delayBetweenTexts = 2000;

        function type() {
            const currentText = texts[textIndex];
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 500);
                } else {
                    setTimeout(type, erasingSpeed);
                }
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentText.length) {
                    isDeleting = true;
                    setTimeout(type, delayBetweenTexts);
                } else {
                    setTimeout(type, typingSpeed);
                }
            }
        }
        setTimeout(type, 500); 
    }

    // ===== 3. ANIMASI FADE-IN SAAT SCROLL (Intersection Observer) =====
    
    const elementsToFade = document.querySelectorAll('.fade-on-scroll');
    if (elementsToFade.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elementsToFade.forEach(element => observer.observe(element));
    }

    // ===== 4. KARTU 3D INTERAKTIF (BARU) =====

    const card = document.getElementById('interactive-card');
    if (card) {
        const maxTilt = 15; // Derajat kemiringan maksimum

        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posisi x di dalam kartu
            const y = e.clientY - rect.top; // Posisi y di dalam kartu
            
            const width = card.offsetWidth;
            const height = card.offsetHeight;
            
            // Hitung rotasi (dari -maxTilt sampai +maxTilt)
            const rotateY = (x / width - 0.5) * 2 * maxTilt;
            const rotateX = (0.5 - y / height) * 2 * maxTilt;
            
            // Terapkan style transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', function() {
            // Reset ke posisi awal
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    // ===== 5. ANIMASI PARTIKEL CANVAS (BARU & CANGGIH) =====
    
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        // Dapatkan warna partikel dari CSS Variable
        const particleColor = getComputedStyle(document.documentElement)
                                .getPropertyValue('--particle-color').trim() || '#A0A0A0';

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight; // Set tinggi canvas = tinggi total halaman
        }
        
        // Panggil resize sekali di awal
        resizeCanvas();

        // Panggil resize saat ukuran window berubah
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor(x, y, radius, dx, dy) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.dx = dx; // Kecepatan x
                this.dy = dy; // Kecepatan y
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = particleColor;
                ctx.fill();
                ctx.closePath();
            }
            
            update() {
                // Pantulkan jika kena batas
                if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
                if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy;
                
                this.x += this.dx;
                this.y += this.dy;
                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            // Sesuaikan jumlah partikel berdasarkan lebar layar
            let particleCount = (canvas.width * canvas.height) / 10000;
            if (particleCount > 150) particleCount = 150; // Batas maksimum
            if (particleCount < 40) particleCount = 40;   // Batas minimum

            for (let i = 0; i < particleCount; i++) {
                let radius = Math.random() * 2 + 1; // Ukuran 1-3px
                let x = Math.random() * (canvas.width - radius * 2) + radius;
                let y = Math.random() * (canvas.height - radius * 2) + radius;
                let dx = (Math.random() - 0.5) * 0.5; // Kecepatan
                let dy = (Math.random() - 0.5) * 0.5;
                particles.push(new Particle(x, y, radius, dx, dy));
            }
        }

        function connectParticles() {
            let maxDistance = 120; // Jarak maksimum untuk menggambar garis
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < maxDistance) {
                        ctx.strokeStyle = particleColor;
                        ctx.lineWidth = 0.2;
                        // Opacity garis berdasarkan jarak
                        ctx.globalAlpha = 1 - (distance / maxDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1; // Reset opacity
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let particle of particles) {
                particle.update();
            }
            connectParticles(); // Gambar garis antar partikel
        }

        // Mulai semuanya
        initParticles();
        animate();
        
        // Perbarui jumlah partikel saat resize
        window.addEventListener('resize', initParticles);
    }
});