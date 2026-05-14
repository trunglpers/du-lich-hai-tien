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