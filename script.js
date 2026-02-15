// ============================================
// PORTFOLIO LUC KAT - VERSION FINALE CORRIGÉE
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
    
    // SYSTÈME DE COMPTAGE - PRIORITAIRE
    initCountingSystem();
    
    // SYSTÈME DE CONSENTEMENT
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

// ===== 6. SYSTÈME DE COMPTAGE CORRIGÉ =====
function initCountingSystem() {
    console.log('🔍 Initialisation du compteur...');
    
    const VISITOR_KEY = 'luc_kat_visitors';
    const SESSION_KEY = 'visitor_counted_' + window.location.pathname;
    
    // 1. Initialiser le compteur si besoin (préserve TES données existantes)
    if (!localStorage.getItem(VISITOR_KEY)) {
        localStorage.setItem(VISITOR_KEY, '0');
        console.log('📊 Compteur initialisé à 0');
    }
    
    // 2. Lire la valeur actuelle (TES VRAIS VISITEURS)
    let visitors = parseInt(localStorage.getItem(VISITOR_KEY) || '0');
    console.log('📊 Valeur actuelle dans localStorage:', visitors);
    
    // 3. AFFICHER IMMÉDIATEMENT TES VRAIS VISITEURS
    updateAllDisplays();
    
    // 4. Vérifier si c'est une nouvelle visite dans CETTE session
    if (!sessionStorage.getItem(SESSION_KEY)) {
        // C'est un NOUVEAU visiteur dans cette session
        visitors++;
        localStorage.setItem(VISITOR_KEY, visitors.toString());
        sessionStorage.setItem(SESSION_KEY, 'true');
        
        console.log('✅ NOUVEAU VISITEUR COMPTÉ! Total:', visitors);
        
        // Afficher une notification dans la console
        console.log('👋 Bienvenue sur mon portfolio!');
        
        // 5. METTRE À JOUR L'AFFICHAGE APRÈS LE NOUVEAU VISITEUR
        updateAllDisplays();
    } else {
        console.log('ℹ️ Visiteur déjà compté dans cette session');
    }
    
    // 6. Mettre à jour périodiquement (toutes les 1 seconde pour être plus réactif)
    setInterval(updateAllDisplays, 1000);
}

// ===== 7. SYSTÈME DE CONSENTEMENT (SANS COMPTAGE) =====
function initConsentSystem() {
    const CONSENT_KEY = 'luc_kat_consent';
    const ACCEPT_KEY = 'luc_kat_accepts';
    
    // Initialiser le compteur d'acceptations
    if (!localStorage.getItem(ACCEPT_KEY)) {
        localStorage.setItem(ACCEPT_KEY, '0');
    }
    
    // Récupérer les éléments
    const overlay = document.getElementById('consentOverlay');
    const banner = document.getElementById('consentBanner');
    const yesBtn = document.getElementById('consentYes');
    const noBtn = document.getElementById('consentNo');
    
    if (!overlay || !banner || !yesBtn || !noBtn) {
        console.log('⚠️ Éléments de consentement non trouvés');
        return;
    }
    
    const consent = localStorage.getItem(CONSENT_KEY);
    
    // Afficher ou non la bannière
    if (consent === 'accepted') {
        overlay.style.display = 'none';
        banner.style.display = 'none';
        console.log('🔓 Consentement déjà accepté');
    }
    else if (consent === 'refused') {
        console.log('🔒 Consentement refusé');
        // Redirection vers Google
        window.location.href = 'https://www.google.com';
    }
    else {
        // Afficher la bannière après 2 secondes
        console.log('🕐 Affichage de la bannière dans 2s...');
        setTimeout(() => {
            overlay.style.display = 'block';
            banner.style.display = 'block';
            console.log('🟢 Bannière affichée');
        }, 2000);
    }
    
    // Bouton OUI
    yesBtn.addEventListener('click', function() {
        console.log('👍 Clic sur OUI');
        localStorage.setItem(CONSENT_KEY, 'accepted');
        
        // Incrémenter les acceptations
        let accepts = parseInt(localStorage.getItem(ACCEPT_KEY) || '0');
        accepts++;
        localStorage.setItem(ACCEPT_KEY, accepts.toString());
        
        // Masquer la bannière
        overlay.style.display = 'none';
        banner.style.display = 'none';
        
        // Mettre à jour l'affichage
        updateAllDisplays();
        
        console.log('✅ Consentement accepté! Total acceptations:', accepts);
    });
    
    // Bouton NON
    noBtn.addEventListener('click', function() {
        console.log('👎 Clic sur NON - Redirection');
        localStorage.setItem(CONSENT_KEY, 'refused');
        window.location.href = 'https://www.google.com';
    });
    
    // Mettre à jour l'affichage
    updateAllDisplays();
}

// ===== 8. MISE À JOUR DE TOUS LES AFFICHAGES =====
function updateAllDisplays() {
    const visitors = parseInt(localStorage.getItem('luc_kat_visitors') || '0');
    const accepts = parseInt(localStorage.getItem('luc_kat_accepts') || '0');
    const rate = visitors > 0 ? Math.round((accepts / visitors) * 100) : 0;
    
    // Mettre à jour le badge en bas à gauche
    const liveCount = document.getElementById('liveCount');
    if (liveCount) {
        liveCount.textContent = visitors;
    }
    
    // Mettre à jour le panneau
    const statVisitors = document.getElementById('statVisitors');
    const statAccepts = document.getElementById('statAccepts');
    const statRate = document.getElementById('statRate');
    const statUpdate = document.getElementById('statUpdate');
    
    if (statVisitors) statVisitors.textContent = visitors;
    if (statAccepts) statAccepts.textContent = accepts;
    if (statRate) statRate.textContent = rate + '%';
    if (statUpdate) statUpdate.textContent = new Date().toLocaleTimeString('fr-FR');
}

// ===== 9. FONCTIONS GLOBALES POUR LE PANNEAU =====
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
    updateAllDisplays();
    
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
        sessionStorage.clear();
        updateAllDisplays();
        alert('✅ Statistiques réinitialisées!');
        console.log('🔄 Compteur remis à zéro');
        location.reload();
    } else if (pwd !== null) {
        alert('❌ Mot de passe incorrect!');
    }
};

// ===== 10. FORMULAIRE DE CONTACT =====
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

// ===== 11. NEWSLETTER =====
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

// ===== 12. ANIMATIONS AU SCROLL =====
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

// ===== 13. EFFET DE SCROLL SUR LA NAVBAR =====
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

// ===== 14. FONCTIONS UTILITAIRES =====
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

// ===== 15. COMMANDE CONSOLE POUR DÉBOGUER =====
window.showStats = function() {
    const visitors = localStorage.getItem('luc_kat_visitors') || '0';
    const accepts = localStorage.getItem('luc_kat_accepts') || '0';
    const v = parseInt(visitors);
    const a = parseInt(accepts);
    const rate = v > 0 ? Math.round((a / v) * 100) : 0;
    
    console.log('📊 STATISTIQUES DU SITE:');
    console.log(`   👥 Visiteurs: ${visitors}`);s
    console.log(`   ✅ Acceptations: ${accepts}`);
    console.log(`   📈 Taux: ${rate}%`);
    console.log(`   🍪 Consentement: ${localStorage.getItem('luc_kat_consent') || 'pas encore'}`);
};

// Initialisation supplémentaire au chargement complet
window.addEventListener('load', function() {
    console.log('✅ Site complètement chargé');
    console.log('📊 Visiteurs actuels:', localStorage.getItem('luc_kat_visitors') || '0');
});