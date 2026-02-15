// ============================================
// PORTFOLIO LUC KAT - VERSION FINALE NETTOYÉE
// ============================================

// ===== INITIALISATION GÉNÉRALE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du site...');
    
    // Initialisation de toutes les fonctionnalités
    initNavigation();
    initSmoothScroll();
    initActiveNav();
    initSkillBars();
    initHeroStatsCounter();
    initContactForm();
    initFooterNewsletter();
    initScrollAnimations();
    initHeaderScroll();
    
    // SYSTÈME DE CONSENTEMENT UNIQUEMENT
    initConsentSystem();
    
    // Initialiser EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('I6EsZTDdzkv_VfLbE');
        console.log('📧 EmailJS initialisé');
    }
});

// ===== 1. MENU HAMBURGER =====
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== 2. SCROLL DOUX =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ===== 3. NAVIGATION ACTIVE =====
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== 4. BARRES DE COMPÉTENCES =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    if (!skillBars.length) return;
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (barPosition < screenPosition && !bar.classList.contains('animated')) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
                bar.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars();
}

// ===== 5. COMPTEUR DES STATS DU HERO =====
function initHeroStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    if (!stats.length) return;
    
    let counted = false;
    
    const countStats = () => {
        const statsPosition = stats[0].getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (statsPosition < screenPosition && !counted) {
            counted = true;
            
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count') || '0');
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target;
                    }
                };
                
                updateCount();
            });
        }
    };
    
    window.addEventListener('scroll', countStats);
    countStats();
}

// ===== 6. SYSTÈME DE CONSENTEMENT - SOLUTION FINALE =====
function initConsentSystem() {
    console.log('🔍 Initialisation du consentement...');
    
    const overlay = document.getElementById('consentOverlay');
    const banner = document.getElementById('consentBanner');
    const yesBtn = document.getElementById('consentYes');
    const noBtn = document.getElementById('consentNo');
    
    if (!overlay || !banner || !yesBtn || !noBtn) {
        console.log('⚠️ Éléments de consentement non trouvés');
        return;
    }
    
    // 🇫🇷 CLÉ UNIQUE POUR TOUT LE SITE
    const CONSENT_KEY = 'luc_kat_global_consent';
    const CONSENT_TIME = 'luc_kat_consent_time';
    
    // Vérifier si l'utilisateur a déjà fait un choix
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    const consentTime = localStorage.getItem(CONSENT_TIME);
    const now = Date.now();
    
    // Si consentement donné il y a moins de 24h, on ne fait rien
    if (hasConsent && consentTime && (now - parseInt(consentTime) < 24 * 60 * 60 * 1000)) {
        console.log('ℹ️ Consentement déjà donné aujourd\'hui');
        overlay.style.display = 'none';
        banner.style.display = 'none';
        return;
    }
    
    // Sinon, on affiche la bannière
    console.log('🕐 Affichage de la bannière...');
    
    setTimeout(() => {
        overlay.style.display = 'block';
        banner.style.display = 'block';
        console.log('🟢 Bannière affichée');
    }, 1000);
    
    // Bouton OUI
    yesBtn.addEventListener('click', function() {
        console.log('👍 Clic sur OUI');
        localStorage.setItem(CONSENT_KEY, 'accepted');
        localStorage.setItem(CONSENT_TIME, Date.now().toString());
        overlay.style.display = 'none';
        banner.style.display = 'none';
    });
    
    // Bouton NON
    noBtn.addEventListener('click', function() {
        console.log('👎 Clic sur NON');
        localStorage.setItem(CONSENT_KEY, 'refused');
        localStorage.setItem(CONSENT_TIME, Date.now().toString());
        window.location.href = 'https://www.google.com';
    });
}

// ===== 7. FORMULAIRE DE CONTACT =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const submitBtn = document.getElementById('submitBtn');
    
    let formMessage = document.getElementById('formMessage');
    if (!formMessage) {
        formMessage = document.createElement('div');
        formMessage.id = 'formMessage';
        formMessage.className = 'form-message';
        form.appendChild(formMessage);
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (typeof emailjs === 'undefined') {
            showFormMessage(formMessage, 'Erreur: EmailJS non chargé', 'error');
            return;
        }
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Envoi...</span> <i class="fas fa-spinner fa-spin"></i>';
        }
        
        const name = form.querySelector('[name="name"]')?.value || '';
        const email = form.querySelector('[name="email"]')?.value || '';
        const subject = form.querySelector('[name="subject"]')?.value || 'Message du portfolio';
        const message = form.querySelector('[name="message"]')?.value || '';
        
        if (!name || !email || !message) {
            showFormMessage(formMessage, 'Veuillez remplir tous les champs obligatoires', 'error');
            resetSubmitButton(submitBtn);
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage(formMessage, 'Email invalide', 'error');
            resetSubmitButton(submitBtn);
            return;
        }
        
        try {
            const response = await emailjs.send(
                'service_4xba3js',
                'template_fznbmbj',
                {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    to_email: 'luckatagondwa6@gmail.com'
                }
            );
            
            if (response.status === 200) {
                showFormMessage(formMessage, '✅ Message envoyé avec succès!', 'success');
                form.reset();
            } else {
                showFormMessage(formMessage, '❌ Erreur lors de l\'envoi', 'error');
            }
        } catch (error) {
            console.error('Erreur EmailJS:', error);
            showFormMessage(formMessage, '❌ Erreur de connexion', 'error');
        } finally {
            resetSubmitButton(submitBtn);
        }
    });
}

// ===== 8. NEWSLETTER =====
function initFooterNewsletter() {
    const newsletterForm = document.getElementById('footerNewsletter');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        if (!emailInput) return;
        
        const email = emailInput.value;
        
        if (!isValidEmail(email)) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }
        
        const submitBtn = this.querySelector('button');
        if (!submitBtn) return;
        
        const originalIcon = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        try {
            await emailjs.send(
                'service_4xba3js',
                'template_fznbmbj',
                {
                    email: email,
                    type: 'newsletter',
                    to_email: 'luckatagondwa6@gmail.com',
                    date: new Date().toLocaleString('fr-FR')
                }
            );
            
            alert('✅ Merci pour votre inscription!');
            emailInput.value = '';
        } catch (error) {
            alert('❌ Erreur. Veuillez réessayer.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalIcon;
        }
    });
}

// ===== 9. ANIMATIONS AU SCROLL =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ===== 10. EFFET DE SCROLL SUR LA NAVBAR =====
function initHeaderScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
        }
    });
}

// ===== 11. FONCTIONS UTILITAIRES =====
function showFormMessage(element, text, type) {
    if (!element) return;
    element.className = 'form-message ' + type;
    element.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i> ' + text;
    
    setTimeout(() => {
        element.innerHTML = '';
        element.className = 'form-message';
    }, 5000);
}

function resetSubmitButton(btn) {
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialisation supplémentaire au chargement complet
window.addEventListener('load', function() {
    console.log('✅ Site complètement chargé');
});