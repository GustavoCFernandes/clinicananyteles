document.addEventListener('DOMContentLoaded', () => {

    // 1. Menu Mobile Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuLinks = navMenu.querySelectorAll('a');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    // Fechar menu ao clicar em um link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });

    // 2. Header Sticky Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            // Fechar todos
            document.querySelectorAll('.accordion-item').forEach(accItem => {
                accItem.classList.remove('active');
            });

            // Abrir o clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

        // 3. Initialize carousels (generic)
        const initCarousel = (carousel) => {
            if (!carousel) {
                console.warn('Carousel element not found');
                return;
            }
            const container = carousel.parentElement;
            const btnPrev = container.querySelector('.carrossel-btn.prev');
            const btnNext = container.querySelector('.carrossel-btn.next');
            const originals = Array.from(carousel.querySelectorAll('.carrossel-item'));
            const N = originals.length;
            if (N === 0) {
                console.warn('No carousel items found');
                return;
            }
            // Clone sandwich: prepend reversed clones, then append original order clones
            originals.slice().reverse().forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                carousel.prepend(clone);
            });
            originals.forEach(item => {
                const clone = item.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                carousel.appendChild(clone);
            });
            let currentIndex = N;
            const getAllItems = () => carousel.querySelectorAll('.carrossel-item');
            const getOffset = (index) => {
                const items = getAllItems();
                const containerWidth = carousel.parentElement.offsetWidth;
                const gap = parseFloat(getComputedStyle(carousel).gap) || 24;
                const itemWidth = items[0].offsetWidth;
                return (containerWidth - itemWidth) / 2 - index * (itemWidth + gap);
            };
            const updateActive = () => {
                getAllItems().forEach((el, i) => {
                    el.classList.toggle('active', i === currentIndex);
                });
            };
            const moveTo = (index, animate = true) => {
                carousel.style.transition = animate ? 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
                carousel.style.transform = `translateX(${getOffset(index)}px)`;
                updateActive();
            };
            carousel.addEventListener('transitionend', () => {
                if (currentIndex >= N * 2) {
                    currentIndex -= N;
                } else if (currentIndex < N) {
                    currentIndex += N;
                } else return;
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(${getOffset(currentIndex)}px)`;
                updateActive();
                carousel.getBoundingClientRect();
            });
            // Init without animation
            console.log('Initializing carousel with', N, 'items');
            moveTo(currentIndex, false);
            window.addEventListener('resize', () => moveTo(currentIndex, false));
            if (btnNext) {
                btnNext.addEventListener('click', () => { currentIndex++; moveTo(currentIndex); });
            } else {
                console.warn('Next button not found');
            }
            if (btnPrev) {
                btnPrev.addEventListener('click', () => { currentIndex--; moveTo(currentIndex); });
            } else {
                console.warn('Prev button not found');
            }
            carousel.addEventListener('click', e => {
                const item = e.target.closest('.carrossel-item');
                if (!item) return;
                const idx = Array.from(getAllItems()).indexOf(item);
                if (idx !== currentIndex) {
                    currentIndex = idx;
                    moveTo(currentIndex);
                }
            });
        };
        // Initialize both carousels after page load
        const initAllCarousels = () => {
            const carouselClinica = document.getElementById('carrossel-clinica');
            const carouselResultados = document.getElementById('carrossel-resultados');
            initCarousel(carouselClinica);
            initCarousel(carouselResultados);
        };
        if (document.readyState === 'complete') {
            initAllCarousels();
        } else {
            window.addEventListener('load', initAllCarousels);
        }

    // 5. Smooth Scroll à prova de falhas (Ignora as configurações do CSS e Força a rolagem via JS)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); // Cancela o pulo nativo
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                // Força a rolagem suave na janela
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
