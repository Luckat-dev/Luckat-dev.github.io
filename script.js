// ============================================
// PORTFOLIO LUC KAT - SCRIPT UNIQUE ET OPTIMISÉ
// ============================================

// ===== INITIALISATION GÉNÉRALE =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de toutes les fonctionnalités
    initNavigation();
    initSmoothScroll();
    initActiveNav();
    initSkillBars();
    initHeroStatsCounter();
    initContactForm();
    initFooterNewsletter();
    initConsentSystem();      // Système de consentement avec comptage
    initScrollAnimations();
    initHeaderScroll();
    
    // Initialiser EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('I6EsZTDdzkv_VfLbE');
    }
});

// ===== 1. MENU HAMBURGER (OPTIMISÉ MOBILE) =====
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    // Ouvrir/fermer le menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fermer quand on clique sur un lien
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
    
    // Fermer en cliquant ailleurs
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
    animateSkillBars(); // Vérifier au chargement
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
    countStats(); // Vérifier au chargement
}

// ===== 6. SYSTÈME DE CONSENTEMENT AVEC COMPTAGE =====
function initConsentSystem() {
    const CONSENT_KEY = 'luc_kat_consent';
    const VISITOR_KEY = 'luc_kat_visitors';
    const ACCEPT_KEY = 'luc_kat_accepts';
    
    // Initialiser les compteurs
    if (!localStorage.getItem(VISITOR_KEY)) {
        localStorage.setItem(VISITOR_KEY, '0');
    }
    if (!localStorage.getItem(ACCEPT_KEY)) {
        localStorage.setItem(ACCEPT_KEY, '0');
    }
    
    // === SYSTÈME DE COMPTAGE INTELLIGENT ===
    // Ne compte le visiteur QUE si :
    // 1. Pas encore de consentement (nouveau visiteur)
    // 2. Pas déjà compté dans cette session
    const consent = localStorage.getItem(CONSENT_KEY);
    const isCounted = sessionStorage.getItem('visitor_counted');
    
    if (!consent && !isCounted) {
        // Incrémenter le compteur de visiteurs
        let visitors = parseInt(localStorage.getItem(VISITOR_KEY) || '0');
        visitors++;
        localStorage.setItem(VISITOR_KEY, visitors.toString());
        
        // Marquer comme compté pour cette session
        sessionStorage.setItem('visitor_counted', 'true');
        
        console.log('✅ Nouveau visiteur compté! Total:', visitors);
    }
    
    // === GESTION DE LA BANNIÈRE ===
    const overlay = document.getElementById('consentOverlay');
    const banner = document.getElementById('consentBanner');
    const yesBtn = document.getElementById('consentYes');
    const noBtn = document.getElementById('consentNo');
    
    if (!overlay || !banner || !yesBtn || !noBtn) return;
    
    // Afficher ou non la bannière selon le consentement
    if (consent === 'accepted') {
        overlay.style.display = 'none';
        banner.style.display = 'none';
    }
    else if (consent === 'refused') {
        // Redirection vers Google
        window.location.href = 'https://www.google.com';
    }
    else {
        // Afficher la bannière après 1 seconde
        setTimeout(() => {
            overlay.style.display = 'block';
            banner.style.display = 'block';
        }, 1000);
    }
    
    // Bouton OUI
    yesBtn.addEventListener('click', function() {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        
        // Incrémenter les acceptations
        let accepts = parseInt(localStorage.getItem(ACCEPT_KEY) || '0');
        accepts++;
        localStorage.setItem(ACCEPT_KEY, accepts.toString());
        
        // Masquer la bannière
        overlay.style.display = 'none';
        banner.style.display = 'none';
        
        // Mettre à jour l'affichage
        updateStatsDisplay();
        
        console.log('👍 Consentement accepté! Total acceptations:', accepts);
    });
    
    // Bouton NON
    noBtn.addEventListener('click', function() {
        localStorage.setItem(CONSENT_KEY, 'refused');
        window.location.href = 'https://www.google.com';
    });
    
    // Mettre à jour l'affichage des stats
    updateStatsDisplay();
    
    // Mise à jour périodique du badge
    setInterval(updateStatsDisplay, 2000);
}

// ===== 7. PANNEAU STATISTIQUE =====
function updateStatsDisplay() {
    const visitors = parseInt(localStorage.getItem('luc_kat_visitors') || '0');
    const accepts = parseInt(localStorage.getItem('luc_kat_accepts') || '0');
    const rate = visitors > 0 ? Math.round((accepts / visitors) * 100) : 0;
    
    // Mettre à jour le panneau
    const statVisitors = document.getElementById('statVisitors');
    const statAccepts = document.getElementById('statAccepts');
    const statRate = document.getElementById('statRate');
    const statUpdate = document.getElementById('statUpdate');
    const liveCount = document.getElementById('liveCount');
    
    if (statVisitors) statVisitors.textContent = visitors;
    if (statAccepts) statAccepts.textContent = accepts;
    if (statRate) statRate.textContent = rate + '%';
    if (statUpdate) statUpdate.textContent = new Date().toLocaleTimeString('fr-FR');
    if (liveCount) liveCount.textContent = visitors;
}

// Fonctions globales pour le panneau
window.toggleStatsPanel = function() {
    const panel = document.getElementById('statsPanel');
    if (panel) {
        if (panel.style.display === 'none' || panel.style.display === '') {
            panel.style.display = 'block';
            refreshStats();
        } else {
            panel.style.display = 'none';
        }
    }
};

window.closeStatsPanel = function() {
    const panel = document.getElementById('statsPanel');
    if (panel) panel.style.display = 'none';
};

window.refreshStats = function() {
    updateStatsDisplay();
    
    // Animation du bouton
    const refreshBtn = document.querySelector('.stats-btn.refresh i');
    if (refreshBtn) {
        refreshBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 300);
    }
};

window.resetStats = function() {
    const pwd = prompt('🔐 Mot de passe pour réinitialiser:');
    if (pwd === 'LucKat2026') {
        localStorage.setItem('luc_kat_visitors', '0');
        localStorage.setItem('luc_kat_accepts', '0');
        localStorage.removeItem('luc_kat_consent');
        sessionStorage.removeItem('visitor_counted');
        updateStatsDisplay();
        alert('✅ Statistiques réinitialisées!');
        location.reload();
    } else if (pwd !== null) {
        alert('❌ Mot de passe incorrect!');
    }
};

// ===== 8. FORMULAIRE DE CONTACT =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const submitBtn = document.getElementById('submitBtn');
    
    // Créer le conteneur de message s'il n'existe pas
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
        
        // Désactiver le bouton
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Envoi...</span> <i class="fas fa-spinner fa-spin"></i>';
        }
        
        // Récupérer les données
        const name = form.querySelector('[name="name"]')?.value || '';
        const email = form.querySelector('[name="email"]')?.value || '';
        const subject = form.querySelector('[name="subject"]')?.value || 'Message du portfolio';
        const message = form.querySelector('[name="message"]')?.value || '';
        
        // Validation
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
        
        // Envoyer
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

// ===== 9. NEWSLETTER =====
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

// ===== 10. ANIMATIONS AU SCROLL =====
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

// ===== 11. EFFET DE SCROLL SUR LA NAVBAR =====
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

// ===== 12. FONCTIONS UTILITAIRES =====
function showFormMessage(element, text, type) {
    if (!element) return;
    element.className = 'form-message ' + type;
    element.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i> ' + text;
    
    // Auto-effacer après 5 secondes
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

// ===== 13. COMMANDE CONSOLE POUR DÉBOGUER =====
window.showStats = function() {
    const visitors = localStorage.getItem('luc_kat_visitors') || '0';
    const accepts = localStorage.getItem('luc_kat_accepts') || '0';
    const v = parseInt(visitors);
    const a = parseInt(accepts);
    const rate = v > 0 ? Math.round((a / v) * 100) : 0;
    
    console.log('📊 STATISTIQUES DU SITE:');
    console.log(`   👥 Visiteurs: ${visitors}`);
    console.log(`   ✅ Acceptations: ${accepts}`);
    console.log(`   📈 Taux: ${rate}%`);
    console.log(`   🍪 Consentement: ${localStorage.getItem('luc_kat_consent') || 'pas encore'}`);
};