/**
 * DATOS RÁPIDOS - GITHUB PAGES
 * JavaScript para funcionalidad básica y mejoras de UX
 * Sin lógica sensible - Solo funcionalidades públicas
 */

// Configuración global
const CONFIG = {
    // Configuración de animaciones
    animationDuration: 300,
    
    // Configuración de scroll suave
    scrollOffset: 80,
    
    // Configuración de navegación
    navActiveClass: 'active',
    
    // Configuración de efectos
    fadeInOffset: 100
};

// Utilidades generales
const Utils = {
    /**
     * Debounce function para optimizar eventos
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function para limitar la frecuencia de eventos
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Verificar si un elemento está en el viewport
     */
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Obtener la posición de scroll actual
     */
    getScrollPosition: function() {
        return window.pageYOffset || document.documentElement.scrollTop;
    },

    /**
     * Scroll suave a un elemento
     */
    smoothScrollTo: function(target, offset = 0) {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - offset;
        const startPosition = this.getScrollPosition();
        const distance = targetPosition - startPosition;
        const duration = CONFIG.animationDuration;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        requestAnimationFrame(animation.bind(this));
    },

    /**
     * Función de easing para animaciones suaves
     */
    easeInOutQuad: function(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
};

// Gestor de navegación
const Navigation = {
    /**
     * Inicializar navegación
     */
    init: function() {
        this.setupSmoothScroll();
        this.setupActiveLinks();
        this.setupMobileMenu();
    },

    /**
     * Configurar scroll suave para enlaces internos
     */
    setupSmoothScroll: function() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Solo procesar enlaces internos
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    Utils.smoothScrollTo(target, CONFIG.scrollOffset);
                }
            });
        });
    },

    /**
     * Configurar enlaces activos en navegación
     */
    setupActiveLinks: function() {
        const navLinks = document.querySelectorAll('.nav a[href^="#"]');
        const sections = document.querySelectorAll('section[id]');

        const updateActiveLink = Utils.throttle(() => {
            const scrollPos = Utils.getScrollPosition() + CONFIG.scrollOffset;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    // Remover clase activa de todos los enlaces
                    navLinks.forEach(link => link.classList.remove(CONFIG.navActiveClass));
                    
                    // Agregar clase activa al enlace correspondiente
                    const activeLink = document.querySelector(`.nav a[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add(CONFIG.navActiveClass);
                    }
                }
            });
        }, 100);

        window.addEventListener('scroll', updateActiveLink);
    },

    /**
     * Configurar menú móvil (si es necesario)
     */
    setupMobileMenu: function() {
        // Funcionalidad básica para menú móvil
        const nav = document.querySelector('.nav');
        if (!nav) return;

        // Agregar clase para dispositivos móviles
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                nav.classList.add('mobile');
            } else {
                nav.classList.remove('mobile');
            }
        };

        window.addEventListener('resize', Utils.debounce(checkMobile, 250));
        checkMobile();
    }
};

// Gestor de animaciones
const Animations = {
    /**
     * Inicializar animaciones
     */
    init: function() {
        this.setupFadeIn();
        this.setupScrollAnimations();
    },

    /**
     * Configurar animaciones de fade-in
     */
    setupFadeIn: function() {
        const fadeElements = document.querySelectorAll('.fade-in');
        
        const checkFadeElements = Utils.throttle(() => {
            fadeElements.forEach(element => {
                if (Utils.isInViewport(element) && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        }, 100);

        window.addEventListener('scroll', checkFadeElements);
        checkFadeElements(); // Verificar elementos visibles al cargar
    },

    /**
     * Configurar animaciones basadas en scroll
     */
    setupScrollAnimations: function() {
        const animatedElements = document.querySelectorAll('.card, .privacy-section');
        
        const checkScrollAnimations = Utils.throttle(() => {
            animatedElements.forEach(element => {
                if (Utils.isInViewport(element) && !element.classList.contains('scroll-animated')) {
                    element.classList.add('scroll-animated');
                    
                    // Agregar efecto de entrada
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 200);
                }
            });
        }, 150);

        window.addEventListener('scroll', checkScrollAnimations);
        checkScrollAnimations(); // Verificar elementos visibles al cargar
    }
};

// Gestor de interacciones
const Interactions = {
    /**
     * Inicializar interacciones
     */
    init: function() {
        this.setupButtonEffects();
        this.setupCardHover();
        this.setupFormValidation();
    },

    /**
     * Configurar efectos de botones
     */
    setupButtonEffects: function() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
            
            button.addEventListener('click', function() {
                // Efecto de clic
                this.style.transform = 'translateY(0)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-2px)';
                }, 100);
            });
        });
    },

    /**
     * Configurar efectos de hover en cards
     */
    setupCardHover: function() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
        });
    },

    /**
     * Configurar validación de formularios (si los hay)
     */
    setupFormValidation: function() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validación básica
                const inputs = form.querySelectorAll('input[required], textarea[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = '#f44336';
                        
                        setTimeout(() => {
                            input.style.borderColor = '';
                        }, 3000);
                    }
                });
                
                if (isValid) {
                    // Aquí se procesaría el formulario
                    console.log('Formulario válido');
                }
            });
        });
    }
};

// Gestor de rendimiento
const Performance = {
    /**
     * Inicializar optimizaciones de rendimiento
     */
    init: function() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupResourceHints();
    },

    /**
     * Configurar carga perezosa de imágenes
     */
    setupLazyLoading: function() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    },

    /**
     * Configurar optimización de imágenes
     */
    setupImageOptimization: function() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Agregar atributos de optimización
            img.loading = 'lazy';
            img.decoding = 'async';
        });
    },

    /**
     * Configurar hints de recursos
     */
    setupResourceHints: function() {
        // Preload de recursos críticos
        const criticalResources = [
            'css/style.css',
            'js/main.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
};

// Gestor de accesibilidad
const Accessibility = {
    /**
     * Inicializar mejoras de accesibilidad
     */
    init: function() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
    },

    /**
     * Configurar navegación por teclado
     */
    setupKeyboardNavigation: function() {
        document.addEventListener('keydown', (e) => {
            // Navegación con teclas de flecha
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
                const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
                
                if (e.key === 'ArrowDown' && currentIndex < focusableElements.length - 1) {
                    focusableElements[currentIndex + 1].focus();
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    focusableElements[currentIndex - 1].focus();
                }
            }
        });
    },

    /**
     * Configurar gestión de foco
     */
    setupFocusManagement: function() {
        // Mejorar visibilidad del foco
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid #1976D2 !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Configurar etiquetas ARIA
     */
    setupAriaLabels: function() {
        // Agregar etiquetas ARIA a elementos interactivos
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Botón de acción');
            }
        });
    }
};

// Inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Datos Rápidos - GitHub Pages inicializado');
    
    // Inicializar todos los módulos
    Navigation.init();
    Animations.init();
    Interactions.init();
    Performance.init();
    Accessibility.init();
    
    // Configuración adicional
    setupThemeDetection();
    setupErrorHandling();
    
    console.log('✅ Todos los módulos inicializados correctamente');
});

// Funciones auxiliares
function setupThemeDetection() {
    // Detectar preferencia de tema del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-theme');
    }
}

function setupErrorHandling() {
    // Manejo global de errores
    window.addEventListener('error', function(e) {
        console.error('Error en la aplicación:', e.error);
        // Aquí se podría enviar el error a un servicio de monitoreo
    });
    
    // Manejo de errores de promesas no capturadas
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promesa rechazada:', e.reason);
        e.preventDefault();
    });
}

// Exportar utilidades para uso global
window.DatosRapidos = {
    Utils,
    Navigation,
    Animations,
    Interactions,
    Performance,
    Accessibility
};
