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

    // 4. Carrossel Infinito (Resultados)
    const carrossel = document.getElementById('carrossel-resultados');
    const btnPrev = document.querySelector('.carrossel-btn.prev');
    const btnNext = document.querySelector('.carrossel-btn.next');

    // --- Clone Sandwich: [clones início] [originais] [clones fim] ---
    const originals = Array.from(carrossel.querySelectorAll('.carrossel-item'));
    const N = originals.length;

    // Prepend: clones na mesma ordem dos originais
    originals.slice().reverse().forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        carrossel.prepend(clone);
    });

    // Append: clones na mesma ordem
    originals.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        carrossel.appendChild(clone);
    });

    // currentIndex começa no primeiro original (posição N)
    let currentIndex = N;

    function getAllItems() {
        return carrossel.querySelectorAll('.carrossel-item');
    }

    function getOffset(index) {
        const items = getAllItems();
        const containerWidth = carrossel.parentElement.offsetWidth;
        const gap = parseFloat(getComputedStyle(carrossel).gap) || 24;
        const itemWidth = items[0].offsetWidth;
        return (containerWidth - itemWidth) / 2 - index * (itemWidth + gap);
    }

    function updateActive() {
        getAllItems().forEach((el, i) => {
            el.classList.toggle('active', i === currentIndex);
        });
    }

    function moveTo(index, animate = true) {
        carrossel.style.transition = animate
            ? 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            : 'none';
        carrossel.style.transform = `translateX(${getOffset(index)}px)`;
        updateActive();
    }

    // Após cada transição: se estiver nos clones, teleporta silenciosamente para o original
    carrossel.addEventListener('transitionend', () => {
        if (currentIndex >= N * 2) {
            currentIndex -= N;
        } else if (currentIndex < N) {
            currentIndex += N;
        } else {
            return; // dentro dos originais, nada a fazer
        }
        carrossel.style.transition = 'none';
        carrossel.style.transform = `translateX(${getOffset(currentIndex)}px)`;
        updateActive();
        carrossel.getBoundingClientRect(); // força reflow antes de re-habilitar transição
    });

    // Inicializa sem animação
    moveTo(currentIndex, false);

    // Recalcula no resize
    window.addEventListener('resize', () => moveTo(currentIndex, false));

    btnNext.addEventListener('click', () => { currentIndex++; moveTo(currentIndex); });
    btnPrev.addEventListener('click', () => { currentIndex--; moveTo(currentIndex); });

    // Clicar num card lateral navega até ele
    carrossel.addEventListener('click', e => {
        const item = e.target.closest('.carrossel-item');
        if (!item) return;
        const idx = Array.from(getAllItems()).indexOf(item);
        if (idx !== currentIndex) {
            currentIndex = idx;
            moveTo(currentIndex);
        }
    });

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
