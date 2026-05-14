 document.addEventListener('DOMContentLoaded', function () {
            // LIGHTBOX FUNCTIONALITY
            const modal = document.getElementById('lightbox-modal');
            const modalImg = document.getElementById('lightbox-img');
            const modalCaption = document.getElementById('lightbox-caption');
            const closeBtn = document.querySelector('.lightbox-close');
            const galleryCards = document.querySelectorAll('.gallery-card');

            function openLightbox(card) {
                const img = card.querySelector('img');
                const overlay = card.querySelector('.card-overlay');

                modal.style.display = 'block';
                modalImg.src = img.src;
                modalCaption.innerHTML = overlay.innerHTML;

                document.body.style.overflow = 'hidden';
            }

            function closeLightbox() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            // Event listeners
            galleryCards.forEach(card => {
                card.addEventListener('click', () => openLightbox(card));
            });

            if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeLightbox();
                }
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (modal.style.display === 'block' && e.key === 'Escape') {
                    closeLightbox();
                }
            });

            // SCROLL ANIMATIONS
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);

            // Observe gallery cards
            galleryCards.forEach(card => {
                observer.observe(card);
            });

            // Observe section titles
            document.querySelectorAll('.section-title, .section-subtitle').forEach(elem => {
                observer.observe(elem);
            });

            // Observe highlight cards
            document.querySelectorAll('.highlight-card').forEach(card => {
                observer.observe(card);
            });

            // Observe exploration cards
            document.querySelectorAll('.exploration-card').forEach(card => {
                observer.observe(card);
            });
        });

        // Highlight active navigation link
        function highlightActiveNav() {
            const navLinks = document.querySelectorAll('.nav-links a');
            const currentFile = window.location.pathname.split('/').pop() || 'index.htm';

            navLinks.forEach(link => {
                link.classList.remove('active');
                const hrefFile = link.getAttribute('href').split('/').pop();
                if (hrefFile === currentFile || (currentFile === '' && hrefFile === 'index.htm')) {
                    link.classList.add('active');
                }
            });
        }

        highlightActiveNav();

        // ===== TRANSITION CHỈ CONTENT =====
        const content = document.getElementById('page-content');

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function (e) {

                if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();

                    const href = this.getAttribute('href');

                    if (content) {
                        content.classList.add('fade-out');
                    }

                    setTimeout(() => {
                        window.location.href = href;
                    }, 450);
                }
            });
        });