document.addEventListener('DOMContentLoaded', function() {
    // Elementos del carrusel
    const slides = document.querySelector('.slides');
    const slideElements = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const indicators = document.querySelectorAll('.indicator');
    
    // Variables de estado
    let currentIndex = 0;
    const slideCount = slideElements.length;
    let autoSlideInterval;
    let isAnimating = false;
    
    // Función para mover el carrusel
    function moveSlide() {
        if (isAnimating) return;
        
        isAnimating = true;
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Resetear flag de animación después de la transición
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Función para avanzar al siguiente slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        moveSlide();
    }
    
    // Función para retroceder al slide anterior
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        moveSlide();
    }
    
    // Event listeners para botones
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
    
    // Event listeners para indicadores
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            if (isAnimating) return;
            
            const newIndex = parseInt(this.getAttribute('data-index'));
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                moveSlide();
                resetAutoSlide();
            }
        });
    });
    
    // Función para el desplazamiento automático
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    // Función para reiniciar el auto-desplazamiento
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Iniciar auto-desplazamiento
    startAutoSlide();
    
    // Pausar auto-desplazamiento al interactuar con el carrusel
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Soporte para dispositivos táctiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    }, false);
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (isAnimating) return;
        
        const minSwipeDistance = 50;
        
        if (touchStartX - touchEndX > minSwipeDistance) {
            // Deslizar a la izquierda -> siguiente
            nextSlide();
        } else if (touchEndX - touchStartX > minSwipeDistance) {
            // Deslizar a la derecha -> anterior
            prevSlide();
        }
        
        resetAutoSlide();
    }
    
    // Precargar imágenes para mejor experiencia
    function preloadImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            } else {
                img.classList.add('loaded');
            }
        });
    }
    
    preloadImages();
    
    // Efecto de carga suave para las imágenes
    const fadeInOnScroll = function() {
        const images = document.querySelectorAll('img');
        
        images.forEach(image => {
            const imagePosition = image.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (imagePosition < screenPosition) {
                image.style.opacity = "1";
                image.style.transform = "scale(1)";
            }
        });
    };
    
    // Aplicar estilos iniciales para la animación
    document.querySelectorAll('img').forEach(img => {
        img.style.opacity = "0";
        img.style.transform = "scale(0.95)";
        img.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });
    
    window.addEventListener('scroll', fadeInOnScroll);
    window.addEventListener('load', fadeInOnScroll);
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});