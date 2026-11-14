const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const bubbleLayer = document.createElement('div');
    bubbleLayer.className = 'love-bubbles';
    bubbleLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bubbleLayer);

    const bubbleCount = 16;

    for (let index = 0; index < bubbleCount; index += 1) {
        const bubble = document.createElement('span');
        const duration = 12 + Math.random() * 10;

        bubble.className = 'love-bubble';
        bubble.textContent = Math.random() > 0.35 ? '♡' : '♥';
        bubble.style.setProperty('--left', `${Math.random() * 100}%`);
        bubble.style.setProperty('--size', `${20 + Math.random() * 28}px`);
        bubble.style.setProperty('--duration', `${duration}s`);
        bubble.style.setProperty('--delay', `${-Math.random() * duration}s`);
        bubble.style.setProperty('--drift', `${Math.random() * 100 - 50}px`);

        bubbleLayer.appendChild(bubble);
    }
}

const counter = document.querySelector('#relationship-counter');

if (counter) {
    const startDate = new Date(counter.dataset.start);
    const units = {
        months: document.querySelector('#counter-months'),
        days: document.querySelector('#counter-days'),
        hours: document.querySelector('#counter-hours'),
        minutes: document.querySelector('#counter-minutes'),
        seconds: document.querySelector('#counter-seconds'),
    };

    function updateRelationshipCounter() {
        const now = new Date();

        if (Number.isNaN(startDate.getTime()) || now < startDate) {
            Object.values(units).forEach((unit) => {
                unit.textContent = '0';
            });
            return;
        }

        let months = (now.getFullYear() - startDate.getFullYear()) * 12
            + now.getMonth() - startDate.getMonth();
        const monthAnniversary = new Date(startDate);
        monthAnniversary.setMonth(startDate.getMonth() + months);

        if (monthAnniversary > now) {
            months -= 1;
            monthAnniversary.setTime(startDate.getTime());
            monthAnniversary.setMonth(startDate.getMonth() + months);
        }

        const elapsedSeconds = Math.floor((now - monthAnniversary) / 1000);
        const days = Math.floor(elapsedSeconds / (24 * 60 * 60));
        const hours = Math.floor((elapsedSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((elapsedSeconds % (60 * 60)) / 60);
        const seconds = elapsedSeconds % 60;

        units.months.textContent = months;
        units.days.textContent = days;
        units.hours.textContent = hours;
        units.minutes.textContent = minutes;
        units.seconds.textContent = seconds;
    }

    updateRelationshipCounter();
    window.setInterval(updateRelationshipCounter, 1000);
}

if (!prefersReducedMotion) {
    const hero = document.querySelector('.box-background');
    let parallaxFrame = null;

    function updateParallax() {
        if (!hero) return;

        const bounds = hero.getBoundingClientRect();
        const distanceFromCenter = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
        const offset = Math.max(-120, Math.min(120, distanceFromCenter * 0.28));
        hero.style.setProperty('--parallax-offset', `${offset}px`);
        parallaxFrame = null;
    }

    function requestParallaxUpdate() {
        if (parallaxFrame === null) {
            parallaxFrame = window.requestAnimationFrame(updateParallax);
        }
    }

    if (hero) {
        updateParallax();
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
        window.addEventListener('resize', requestParallaxUpdate);
    }

    const revealElements = document.querySelectorAll('.content-title, .gallery-grid .box, .love-button-section');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

        revealElements.forEach((element, index) => {
            element.classList.add('scroll-reveal');
            element.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
            revealObserver.observe(element);
        });
    }
}

const loveButton = document.querySelector('#love-button');

if (loveButton) {
    const countElement = document.querySelector('#love-button-count');
    const feedback = loveButton.querySelector('.love-button-feedback');
    const storageKey = 'gustavo-giovana-love-count';
    let count = Number(loveButton.dataset.count) || 1000000;

    try {
        const savedCount = Number(window.localStorage.getItem(storageKey));
        if (Number.isSafeInteger(savedCount) && savedCount >= count) {
            count = savedCount;
        }
    } catch {
        // O contador continua funcionando mesmo quando o armazenamento não está disponível.
    }

    const formatCount = (value) => new Intl.NumberFormat('pt-BR').format(value);
    const renderCount = () => {
        countElement.textContent = formatCount(count);
        loveButton.setAttribute('aria-label', `Gustavo e Giovana: ${formatCount(count)}`);
    };

    renderCount();

    loveButton.addEventListener('click', () => {
        count += 1;
        renderCount();

        try {
            window.localStorage.setItem(storageKey, String(count));
        } catch {
            // A contagem permanece atualizada durante esta visita.
        }

        loveButton.classList.remove('is-clicked');
        feedback.classList.remove('is-active');
        void loveButton.offsetWidth;
        loveButton.classList.add('is-clicked');
        feedback.classList.add('is-active');
    });

    loveButton.addEventListener('animationend', (event) => {
        if (event.animationName === 'heart-pulse') {
            loveButton.classList.remove('is-clicked');
        }
        if (event.animationName === 'float-feedback') {
            feedback.classList.remove('is-active');
        }
    });
}
