// ===== ATTENDRE QUE LE DOM SOIT CHARGÉ =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de toutes les fonctions
    initNavigation();
    initSmoothScroll();
    initActiveNav();
    initSkillBars();
    initStatsCounter();
    initContactForm();
    initFooterNewsletter();
    
    // Initialiser EmailJS avec VOTRE clé publique
    // 🔴 REMPLACEZ 'YOUR_PUBLIC_KEY' par votre vraie clé
    emailjs.init('I6EsZTDdzkv_VfLbE'); // Exemple: 'user_abc123def456'
});

// ===== MENU HAMBURGER À DROITE =====
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        
        // Ouvrir/fermer le menu
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Fermer quand on clique sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                
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
            }
        });
    }
}

// ===== SCROLL DOUX =====
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

// ===== NAVIGATION ACTIVE =====
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
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

// ===== BARRES DE COMPÉTENCES =====
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (barPosition < screenPosition) {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }
        });
    };
    
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars();
}

// ===== COMPTEUR DE STATISTIQUES =====
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let counted = false;
    
    const countStats = () => {
        const statsPosition = stats[0]?.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (statsPosition < screenPosition && !counted) {
            counted = true;
            
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
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
}

// ===== FORMULAIRE DE CONTACT AVEC EMAILJS =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Créer l'élément pour les messages s'il n'existe pas
    let formMessage = document.getElementById('formMessage');
    if (!formMessage) {
        formMessage = document.createElement('div');
        formMessage.id = 'formMessage';
        formMessage.className = 'form-message';
        form.appendChild(formMessage);
    }
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Vérifier que EmailJS est chargé
            if (typeof emailjs === 'undefined') {
                showMessage(formMessage, 'Erreur: EmailJS non chargé. Vérifiez votre connexion internet.', 'error');
                return;
            }
            
            // Désactiver le bouton pendant l'envoi
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Envoi en cours...</span> <i class="fas fa-spinner fa-spin"></i>';
            
            // Récupérer les données du formulaire
            const name = form.querySelector('input[name="name"]').value;
            const email = form.querySelector('input[name="email"]').value;
            const subject = form.querySelector('input[name="subject"]').value || 'Nouveau message du portfolio';
            const message = form.querySelector('textarea[name="message"]').value;
            
            // Validation
            if (!name || !email || !message) {
                showMessage(formMessage, 'Veuillez remplir tous les champs obligatoires.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage(formMessage, 'Veuillez entrer une adresse email valide.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';
                return;
            }
            
            // 🔴 REMPLACEZ CES VALEURS PAR CELLES D'EMAILJS
            const templateParams = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                to_email: 'luckatagondwa6@gmail.com' // Votre email
            };
            
            try {
                // 🔴 REMPLACEZ CES ID PAR LES VÔTRES
                const response = await emailjs.send(
                    'service_4xba3js',      // Votre Service ID
                    'template_fznbmbj',     // Votre Template ID
                    templateParams
                );
                
                if (response.status === 200) {
                    showMessage(formMessage, '✅ Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
                    form.reset();
                } else {
                    showMessage(formMessage, '❌ Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
                }
            } catch (error) {
                console.error('Erreur EmailJS:', error);
                showMessage(formMessage, '❌ Erreur de connexion. Veuillez vérifier votre configuration EmailJS.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Envoyer le message</span> <i class="fas fa-paper-plane"></i>';
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
}

// ===== NEWSLETTER FOOTER =====
function initFooterNewsletter() {
    const newsletterForm = document.getElementById('footerNewsletter');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (!isValidEmail(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            const submitBtn = this.querySelector('button');
            const originalIcon = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            try {
                // 🔴 Utilisez les mêmes IDs ou créez un template spécifique
                const response = await emailjs.send(
                    'service_4xba3js',      // Votre Service ID
                    'template_fznbmbj',     // Votre Template ID (ou un autre pour newsletter)
                    {
                        email: email,
                        type: 'newsletter',
                        to_email: 'luckatagondwa6@gmail.com',
                        date: new Date().toLocaleString('fr-FR')
                    }
                );
                
                if (response.status === 200) {
                    alert('✅ Merci pour votre inscription à la newsletter !');
                    emailInput.value = '';
                } else {
                    alert('❌ Erreur. Veuillez réessayer.');
                }
            } catch (error) {
                alert('❌ Erreur de connexion. Veuillez réessayer.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalIcon;
            }
        });
    }
}

// ===== FONCTION POUR AFFICHER LES MESSAGES =====
function showMessage(element, text, type) {
    element.className = 'form-message ' + type;
    element.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i> ' + text;
}

// ===== VALIDATION EMAIL =====
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    }
});

// ===== ANIMATION AU SCROLL =====
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

document.querySelectorAll('.skill-card, .project-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});



function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let counted = false;
    
    const countStats = () => {
        const statsPosition = stats[0]?.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (statsPosition < screenPosition && !counted) {
            counted = true;
            
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count')); // Prend la valeur dans data-count
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target; // Affiche la valeur finale
                    }
                };
                
                updateCount();
            });
        }
    };
    
    window.addEventListener('scroll', countStats);
}