/**
 * SCRIPT.JS - INTERAKTIVITAS & VISUAL EFFECTS
 * Portofolio Abid Taqiyudin
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. DYNAMIC BACKGROUND CANVAS (PARTICLE CONSTELLATION)
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 18000), 65);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 1.5 + 0.5;
                this.baseAlpha = Math.random() * 0.35 + 0.15;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.baseAlpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let animationFrameId;
        function render() {
            ctx.clearRect(0, 0, width, height);

            // Draw subtle connection lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (1 - dist / 110) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        }

        render();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    // -------------------------------------------------------------------------
    // 2. DYNAMIC TYPING EFFECT (HERO SUBTITLE)
    // -------------------------------------------------------------------------
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            "Teknik Komputer & Jaringan (TJKT)",
            "Siswa SMK Tunas Harapan Pati",
            "Junior Web Developer",
            "Pengembang Game Edukasi",
            "Hardware & Network Enthusiast"
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Selesai mengetik satu frasa, pause sejenak
                typeSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }

        typeLoop();
    }

    // -------------------------------------------------------------------------
    // 3. MOUSE SPOTLIGHT EFFECT ON CARDS
    // -------------------------------------------------------------------------
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // -------------------------------------------------------------------------
    // 4. IDE TABS INTERACTIVITY
    // -------------------------------------------------------------------------
    const ideTabs = document.querySelectorAll('.ide-tab');
    const tabContents = {
        'profile-code': document.getElementById('tab-profile-code'),
        'skills-json': document.getElementById('tab-skills-json'),
        'cli-terminal': document.getElementById('tab-cli-terminal')
    };

    ideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            ideTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            Object.keys(tabContents).forEach(key => {
                if (tabContents[key]) {
                    tabContents[key].classList.remove('active');
                }
            });

            if (tabContents[targetTab]) {
                tabContents[targetTab].classList.add('active');
                if (targetTab === 'cli-terminal') {
                    const cliInput = document.getElementById('cli-input');
                    if (cliInput) setTimeout(() => cliInput.focus(), 100);
                }
            }
        });
    });

    // Copy Code from IDE
    const btnCopyCode = document.getElementById('btn-copy-code');
    if (btnCopyCode) {
        btnCopyCode.addEventListener('click', () => {
            const activeBody = document.querySelector('.ide-body.active code');
            if (activeBody) {
                copyToClipboard(activeBody.innerText, "Kode berhasil disalin!");
            }
        });
    }

    // -------------------------------------------------------------------------
    // 5. INTERACTIVE CLI TERMINAL (BASH SIMULATOR)
    // -------------------------------------------------------------------------
    const cliInput = document.getElementById('cli-input');
    const cliHistory = document.getElementById('cli-history');

    if (cliInput && cliHistory) {
        const commands = {
            help: () => `Perintah yang tersedia:
  • help       : Menampilkan bantuan ini
  • bio        : Rangkuman profil Abid
  • skills     : Ringkasan keahlian teknis
  • school     : Data sekolah & kejuruan
  • contact    : Info WhatsApp, Email & GitHub
  • clear      : Membersihkan layar terminal
  • date       : Waktu & status sistem
  • secret     : Pesan rahasia pengembang`,

            bio: () => `Nama     : Abid Taqiyudin
Status   : Pelajar SMK Tunas Harapan Pati (XII TJKT 1)
Minat    : Web Development, Perakitan PC, Infrastruktur Jaringan, Edu Game
Lokasi   : Pati, Jawa Tengah, Indonesia`,

            skills: () => `Stack & Keahlian:
  [+] Frontend   : HTML5, CSS3 Modern, Responsive Design, JavaScript Basics
  [+] TJKT       : Jaringan LAN, Subnetting IP, Pengkabelan UTP/RJ-45
  [+] Hardware   : Perakitan Komputer, Instalasi OS Windows/Linux, Troubleshooting
  [+] Kreatif    : Game Edukasi Sederhana`,

            school: () => `Institusi : SMK Tunas Harapan Pati
Jurusan   : Teknik Komputer dan Jaringan (TJKT)
Kelas     : XII TJKT 1
Fokus     : Siap Kerja, Mandiri, & Berdaya Saing Global`,

            contact: () => `Hubungi Langsung:
  WhatsApp : 0896-3003-7316 (https://wa.me/6289630037316)
  Email    : abidgeade2@gmail.com
  GitHub   : https://github.com/abid-hue`,

            date: () => `Sistem Aktif: ${new Date().toLocaleString('id-ID')}
Status: All Services Normal & Running.`,

            secret: () => `🚀 "Kode yang baik bukan hanya tentang menulis fungsi, tapi bagaimana menyelesaikan masalah dengan efisien dan elegan." - Abid Taqiyudin`,

            abidyow: () => `⚡ abidyow — Alias digital & portofolio resmi Abid Taqiyudin. SMK Tunas Harapan Pati.`,

            sudo: () => `Permisi ditolak: Anda tidak memerlukan hak akses root untuk menjelajahi portofolio ini :)`
        };

        cliInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawVal = cliInput.value.trim();
                if (!rawVal) return;

                const args = rawVal.split(' ');
                const cmd = args[0].toLowerCase();

                // Append Command to History
                const cmdItem = document.createElement('div');
                cmdItem.className = 'cli-history-item';

                if (cmd === 'clear') {
                    cliHistory.innerHTML = '';
                    cliInput.value = '';
                    return;
                }

                let outputText = '';
                if (commands[cmd]) {
                    outputText = commands[cmd]();
                } else {
                    outputText = `Perintah '${cmd}' tidak dikenali. Ketik 'help' untuk daftar perintah yang sah.`;
                }

                cmdItem.innerHTML = `
                    <div class="cli-history-cmd"><span style="color:#10b981;">abid@portfolio:~$</span> ${escapeHTML(rawVal)}</div>
                    <div class="cli-history-output">${escapeHTML(outputText)}</div>
                `;

                cliHistory.appendChild(cmdItem);
                cliHistory.scrollTop = cliHistory.scrollHeight;
                cliInput.value = '';
            }
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // -------------------------------------------------------------------------
    // 6. TOAST NOTIFICATION & CLIPBOARD COPY HELPER
    // -------------------------------------------------------------------------
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    function showToast(message) {
        if (!toast) return;
        if (toastMessage) toastMessage.textContent = message;
        toast.classList.add('show');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2600);
    }

    function copyToClipboard(text, successMsg = "Tersalin ke clipboard!") {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMsg);
            }).catch(() => {
                fallbackCopy(text, successMsg);
            });
        } else {
            fallbackCopy(text, successMsg);
        }
    }

    function fallbackCopy(text, successMsg) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(successMsg);
        } catch (err) {
            showToast("Gagal menyalin otomatis.");
        }
        document.body.removeChild(textarea);
    }

    // Hero Copy Email Button
    const btnHeroCopyEmail = document.getElementById('btn-copy-email-hero');
    if (btnHeroCopyEmail) {
        btnHeroCopyEmail.addEventListener('click', () => {
            copyToClipboard("abidgeade2@gmail.com", "Email abidgeade2@gmail.com berhasil disalin!");
        });
    }

    // Item-specific Copy Buttons in Dossier
    const itemCopyButtons = document.querySelectorAll('.btn-item-copy');
    itemCopyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                copyToClipboard(textToCopy, `Tersalin: ${textToCopy}`);
            }
        });
    });

    // Copy All Dossier Summary
    const btnCopyAllInfo = document.getElementById('btn-copy-all-info');
    if (btnCopyAllInfo) {
        btnCopyAllInfo.addEventListener('click', () => {
            const summary = `DATA DIRI - ABID TAQIYUDIN
• Nama: Abid Taqiyudin
• Tempat, Tanggal Lahir: Pati, 2009
• Sekolah: SMK Tunas Harapan Pati
• Jurusan: Teknik Komputer dan Jaringan (XII TJKT 1)
• WhatsApp/Telp: 089630037316
• Email: abidgeade2@gmail.com
• Alamat: Perum Pesona Bumi Mandiri 2 RT 06 RW 03, Pati
• Hobi: Mempelajari Komputer, Olahraga, & Musik
• Portofolio: https://github.com/abid-hue`;

            copyToClipboard(summary, "Ringkasan biodata lengkap berhasil disalin!");
        });
    }

    // -------------------------------------------------------------------------
    // 7. QUICK WHATSAPP MESSAGE COMPOSER
    // -------------------------------------------------------------------------
    const quickMessageForm = document.getElementById('quick-message-form');
    if (quickMessageForm) {
        quickMessageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('sender-name');
            const msgInput = document.getElementById('sender-message');

            const name = nameInput ? nameInput.value.trim() : 'Pengunjung';
            const message = msgInput ? msgInput.value.trim() : '';

            if (!message) return;

            const fullText = `Halo Abid, perkenalkan saya ${name}.\n\n${message}`;
            const targetUrl = `https://wa.me/6289630037316?text=${encodeURIComponent(fullText)}`;

            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // -------------------------------------------------------------------------
    // 8. SCROLLSPY & ACTIVE NAVBAR HIGHLIGHT
    // -------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');

    function updateActiveNav() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // -------------------------------------------------------------------------
    // 9. MOBILE NAVIGATION TOGGLE
    // -------------------------------------------------------------------------
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        // Tutup menu saat salah satu link diklik
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 10. BACK TO TOP BUTTON
    // -------------------------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
