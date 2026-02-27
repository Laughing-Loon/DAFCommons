function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.scroll-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => observer.observe(el));

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.bg-texture').forEach((texture, index) => {
            const speed = 0.3 + (index * 0.1);
            const scale = 1 + (scrolled * 0.0001);
            texture.style.transform = 'translateY(' + (scrolled * speed) + 'px) scale(' + scale + ')';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => initScrollAnimations());
