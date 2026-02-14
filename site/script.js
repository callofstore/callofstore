// TRATAMENTO DE ERROS DE EXTENSÕES

// MODIFICAÇÃO 4: SISTEMA ANTI-DOUBLE-CLICK REMOVIDO

class MouseTrail {
    constructor() {
        this.container = document.querySelector('.trail-container');
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.currentTrailType = 'rainbow';
        this.particleCount = 0;
        this.maxParticles = 20;
        this.lastTime = 0;
        this.velocityThreshold = 0.5;
        this.isMoving = false;
        this.movementTimer = null;
        this.init();
    }

    init() {
        this.animationId = requestAnimationFrame((time) => this.updateTrail(time));
        
        const mouseMoveHandler = (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            const deltaX = this.mouseX - this.lastMouseX;
            const deltaY = this.mouseY - this.lastMouseY;
            const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            this.isMoving = velocity > this.velocityThreshold;
            
            if (this.isMoving) {
                clearTimeout(this.movementTimer);
                this.movementTimer = setTimeout(() => {
                    this.isMoving = false;
                }, 50);
            }
            
            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;
            
            let trailType = 'rainbow';
            const containers = document.querySelectorAll('.special-section');
            
            containers.forEach(container => {
                const rect = container.getBoundingClientRect();
                const padding = 5;
                
                if (
                    this.mouseX >= rect.left - padding &&
                    this.mouseX <= rect.right + padding &&
                    this.mouseY >= rect.top - padding &&
                    this.mouseY <= rect.bottom + padding
                ) {
                    trailType = 'fire';
                }
            });
            
            this.currentTrailType = trailType;
        };
        
        document.addEventListener('mousemove', mouseMoveHandler);
        
        document.addEventListener('mouseenter', () => {});
    }

    updateTrail(time) {
        if (!this.lastTime) this.lastTime = time;
        const deltaTime = time - this.lastTime;
        
        if (this.isMoving && deltaTime > 16 && this.particleCount < this.maxParticles) {
            this.createParticle();
            this.lastTime = time;
        }
        
        this.animationId = requestAnimationFrame((t) => this.updateTrail(t));
    }

    createParticle() {
        if (this.particleCount >= this.maxParticles) return;
        
        const particle = document.createElement('div');
        particle.classList.add('trail-particle', this.currentTrailType);
        
        particle.style.left = `${this.mouseX - 3}px`;
        particle.style.top = `${this.mouseY - 3}px`;
        
        const tx = (Math.random() - 0.5) * 12;
        const ty = (Math.random() - 0.5) * 12;
        const rotation = Math.random() * 360;
        const scale = 0.5 + Math.random() * 0.5;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--rot', `${rotation}deg`);
        particle.style.transform = `scale(${scale})`;
        
        this.container.appendChild(particle);
        this.particleCount++;
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particleCount--;
            }
        }, 600);
    }
}

// MODIFICAÇÃO 3: FUNÇÃO CRIAR ESTRELAS DE TODAS AS DIREÇÕES
function createStarsBackground() {
    const container = document.getElementById('stars-bg');
    if (!container) return;
    
    const starCount = 450;
    
    // Limpar estrelas existentes
    container.innerHTML = '';
    
    // Distribuição:
    // 40% caindo de cima (originais)
    // 20% da esquerda para direita
    // 20% da direita para esquerda
    // 10% de baixo para cima
    
    for (let i = 0; i < starCount * 0.4; i++) createStar(container, 'top');
    for (let i = 0; i < starCount * 0.2; i++) createStar(container, 'left');
    for (let i = 0; i < starCount * 0.2; i++) createStar(container, 'right');
    for (let i = 0; i < starCount * 0.1; i++) createStar(container, 'bottom');
    
    // Iniciar animações IMEDIATAMENTE
    setTimeout(() => {
        const stars = container.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.animationPlayState = 'running';
        });
    }, 100);
}

// FUNÇÕES AUXILIARES PARA CRIAÇÃO DE ESTRELAS
function createStar(container, direction) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    let startX, startY, endX, endY;
    const size = 2 + Math.random() * 4;
    const duration = 5 + Math.random() * 10;
    const delay = Math.random() * 5;
    const opacity = 0.5 + Math.random() * 0.5;
    
    // Configuração baseada na direção
    switch(direction) {
        case 'top':
            startX = Math.random() * 100;
            startY = -10;
            endX = (Math.random() * 100 - 50);
            endY = 110;
            break;
        case 'left':
            startX = -10;
            startY = Math.random() * 100;
            endX = 110;
            endY = (Math.random() * 100 - 50);
            break;
        case 'right':
            startX = 110;
            startY = Math.random() * 100;
            endX = -10;
            endY = (Math.random() * 100 - 50);
            break;
        case 'bottom':
            startX = Math.random() * 100;
            startY = 110;
            endX = (Math.random() * 100 - 50);
            endY = -10;
            break;
    }
    
    // Aplicar estilos
    star.style.left = `${startX}%`;
    star.style.top = `${startY}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;
    star.style.opacity = `${opacity}`;
    
    // Criar keyframes dinâmicos para direções diferentes
    const animationName = `fall-${direction}`;
    star.style.animationName = animationName;
    
    // Adicionar keyframes dinâmicos se ainda não existirem
    if (!document.getElementById(`keyframes-${animationName}`)) {
        const style = document.createElement('style');
        style.id = `keyframes-${animationName}`;
        
        let keyframes;
        switch(direction) {
            case 'top':
                keyframes = `
                    @keyframes ${animationName} {
                        0% {
                            transform: translateY(${startY}vh) translateX(${startX}%) rotate(0deg) scale(1);
                            opacity: 0;
                        }
                        5% {
                            opacity: ${opacity};
                        }
                        95% {
                            opacity: ${opacity};
                        }
                        100% {
                            transform: translateY(${endY}vh) translateX(${endX}%) rotate(360deg) scale(1.5);
                            opacity: 0;
                        }
                    }
                `;
                break;
            case 'left':
                keyframes = `
                    @keyframes ${animationName} {
                        0% {
                            transform: translateX(${startX}vw) translateY(${startY}%) rotate(0deg) scale(1);
                            opacity: 0;
                        }
                        5% {
                            opacity: ${opacity};
                        }
                        95% {
                            opacity: ${opacity};
                        }
                        100% {
                            transform: translateX(${endX}vw) translateY(${endY}%) rotate(360deg) scale(1.5);
                            opacity: 0;
                        }
                    }
                `;
                break;
            case 'right':
                keyframes = `
                    @keyframes ${animationName} {
                        0% {
                            transform: translateX(${startX}vw) translateY(${startY}%) rotate(0deg) scale(1);
                            opacity: 0;
                        }
                        5% {
                            opacity: ${opacity};
                        }
                        95% {
                            opacity: ${opacity};
                        }
                        100% {
                            transform: translateX(${endX}vw) translateY(${endY}%) rotate(360deg) scale(1.5);
                            opacity: 0;
                        }
                    }
                `;
                break;
            case 'bottom':
                keyframes = `
                    @keyframes ${animationName} {
                        0% {
                            transform: translateY(${startY}vh) translateX(${startX}%) rotate(0deg) scale(1);
                            opacity: 0;
                        }
                        5% {
                            opacity: ${opacity};
                        }
                        95% {
                            opacity: ${opacity};
                        }
                        100% {
                            transform: translateY(${endY}vh) translateX(${endX}%) rotate(360deg) scale(1.5);
                            opacity: 0;
                        }
                    }
                `;
                break;
        }
        
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
    
    // Cor aleatória
    const colors = [
        'var(--accent-color)',
        'var(--primary-color)',
        '#ff6666',
        '#ff9999',
        '#ff3333',
        '#ff5500'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    star.style.background = `radial-gradient(circle at 30% 30%, ${color}, ${color}dd)`;
    star.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    container.appendChild(star);
}

// MODIFICAÇÃO: Função para garantir que a tela de carregamento desapareça - CORRIGIDA
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    if (!loadingScreen) return;
    
    console.log('Iniciando animação de carregamento...');
    
    // Garantir que o body não tenha scroll durante o loading
    document.body.style.overflow = 'hidden';
    document.body.classList.add('loading-active');
    
    // Simular progresso de forma mais confiável
    let progress = 0;
    const progressSteps = [10, 25, 45, 65, 85, 95, 100];
    let currentStep = 0;
    
    function updateProgress() {
        if (currentStep >= progressSteps.length) {
            finishLoading();
            return;
        }
        
        progress = progressSteps[currentStep];
        if (loadingProgress) {
            loadingProgress.style.width = progress + '%';
        }
        
        currentStep++;
        
        // Intervalos variados para parecer mais natural
        const delay = currentStep === progressSteps.length - 1 ? 300 : 200 + Math.random() * 300;
        setTimeout(updateProgress, delay);
    }
    
    function finishLoading() {
        console.log('Carregamento completo!');
        
        // Pequena pausa para mostrar 100%
        setTimeout(() => {
            loadingScreen.classList.add('loaded');
            
            // Forçar remoção após animação
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'auto';
                document.body.classList.remove('loading-active');
                
                console.log('Tela de carregamento removida');
                
                // Iniciar sistemas após loading
                initAfterLoading();
            }, 500);
        }, 300);
    }
    
    // Iniciar progresso
    setTimeout(updateProgress, 200);
    
    // Safety timeout - força o desaparecimento após 5 segundos NO MÁXIMO
    setTimeout(() => {
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.log('Safety timeout ativado - forçando fechamento');
            
            if (loadingProgress) {
                loadingProgress.style.width = '100%';
            }
            
            finishLoading();
        }
    }, 5000);
}

// Função para pular loading manualmente
function skipLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.classList.remove('loading-active');
        initAfterLoading();
        console.log('Loading pulado manualmente');
    }
}

// Função para verificar se os recursos estão carregados
function checkIfLoaded() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('loaded')) {
        console.log('Forçando finalização do loading...');
        loadingScreen.classList.add('loaded');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.classList.remove('loading-active');
            initAfterLoading();
        }, 500);
    }
}

// FUNÇÃO PARA INICIAR TUDO APÓS O LOADING
function initAfterLoading() {
    console.log('Iniciando todos os sistemas...');
    
    // Criar estrelas
    createStarsBackground();
    
    // Inicializar sistemas
    try {
        const mouseTrail = new MouseTrail();
        window.priceUpdateSystem = new PriceUpdateSystem();
        const filterSystem = new FilterSystem();
        window.filterSystem = filterSystem;
        
        console.log('Sistemas básicos inicializados');
    } catch (error) {
        console.error('Erro ao inicializar sistemas:', error);
    }
    
    // Animações iniciais
    setTimeout(() => {
        document.querySelectorAll('.fade-in-fast, .slide-left-fast, .slide-right-fast').forEach(el => {
            el.classList.add('visible');
        });
        
        setTimeout(() => {
            const socialIcons = document.querySelectorAll('.social-sidebar a');
            socialIcons.forEach((icon, index) => {
                setTimeout(() => {
                    icon.classList.add('visible');
                }, index * 100);
            });
        }, 300);
    }, 100);
    
    // Menu mobile
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Navegação suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80;
                
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
                
                if (navMenu) {
                    navMenu.classList.remove('show');
                }
                if (mobileMenu) {
                    mobileMenu.querySelector('i').classList.add('fa-bars');
                    mobileMenu.querySelector('i').classList.remove('fa-times');
                }
            }
        });
    });

    // Fechar modais ao clicar fora
    document.querySelectorAll('.modal, .modal-info, .game-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Scroll animations
    window.addEventListener('scroll', checkScrollAnimations);
    setTimeout(checkScrollAnimations, 50);
    
    // Typewriter effect
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
    
    // Inicializar vídeo de fundo
    setTimeout(() => {
        initBackgroundVideo();
    }, 1000);
}

const gamesData = [
    {
        id: 1,
        title: "Silent Hill f",
        category: "terror",
        steamPrice: 249.90,
        ourPrice: 39.90,
        image: "https://imgs.search.brave.com/1-H73cJLi9CDTHmAY5u7jFYebXogRBmiA0pB2irV20Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/LmVwaWNnYW1lcy5j/b20vc3B0LWFzc2V0/cy82ZDM0MjgyYTI2/YzU0NGRmODhjY2M1/NzUwNWNkZDJmMC9z/aWxlbnQtaGlsbC1m/LXEzdWh5LmpwZz9y/ZXNpemU9MSZ3PTQ4/MCZoPTI3MCZxdWFs/aXR5PW1lZGl1bQ",
        requirements: {
            "Sistema Operacional": "Windows 10 64-bit",
            "Processador": "Intel Core i7-4790 ou AMD Ryzen 5 3600",
            "Memória": "16 GB RAM",
            "Placa de vídeo": "NVIDIA GeForce GTX 1660 Ti ou AMD Radeon RX 5600 XT",
            "DirectX": "Versão 12",
            "Armazenamento": "60 GB disponíveis"
        }
    },
    {
        id: 2,
        title: "Dying Light: The Beast",
        category: "acao",
        steamPrice: 199.90,
        ourPrice: 29.90,
        image: "https://imgs.search.brave.com/ddGpXuLZPjkyYwTMP8BgxA5-qLEUD4xnWTaiHM2HpxY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDE0MzQ2/MTMxLmpwZw",
        requirements: {
            "Sistema Operacional": "Windows 10 64-bit",
            "Processador": "Intel Core i7-7700K / AMD Ryzen 5 2600",
            "Memória": "16 GB RAM",
            "Placa de vídeo": "NVIDIA GeForce GTX 1660 Ti / AMD Radeon RX 580",
            "DirectX": "Versão 12",
            "Armazenamento": "85 GB disponíveis"
        }
    },
    {
        id: 3,
        title: "Hollow Knight: Silksong",
        category: "aventura",
        steamPrice: 99.90,
        ourPrice: 24.90,
        image: "https://imgs.search.brave.com/6XA4wJaoOs5WQzynXu40p-zGeFF_SDvYVRqU726xFwk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvZW4vdGh1bWIv/MC8wNS9TaWxrc29u/Zy5qcGcvMjUwcHgt/U2lsa3NvbmcuanBn",
        requirements: {
            "Sistema Operacional": "Windows 10",
            "Processador": "Intel Core i5-6500 / AMD Ryzen 3 1200",
            "Memória": "8 GB RAM",
            "Placa de vídeo": "NVIDIA GeForce GTX 1050 / AMD Radeon RX 560",
            "DirectX": "Versão 11",
            "Armazenamento": "25 GB disponíveis"
        }
    },
    {
        id: 4,
        title: "No, I'm not a Human",
        category: "aventura",
        steamPrice: 79.90,
        ourPrice: 19.90,
        image: "https://imgs.search.brave.com/OZEtv-Greq-cYoJRsR749HzTmEI5_VksmMJkESGLJj4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9nYW1p/bmctY2RuLmNvbS9p/bWFnZXMvcHJvZHVj/dHMvMTkxNDQvNjE2/eDM1My9uby1pLW0t/bm90LWEtaHVtYW4t/cGMtc3RlYW0tY292/ZXIuanBnP3Y9MTc1/ODUyOTEzMA",
        requirements: {
            "Sistema Operacional": "Windows 10",
            "Processador": "Intel Core i3-6100 / AMD FX-8350",
            "Memória": "8 GB RAM",
            "Placa de vídeo": "NVIDIA GeForce GTX 750 Ti / AMD Radeon R7 360",
            "DirectX": "Versão 11",
            "Armazenamento": "15 GB disponíveis"
        }
    },
    {
        id: 5,
        title: "Metal Gear Solid Δ Snake Eater",
        category: "acao",
        steamPrice: 299.90,
        ourPrice: 39.90,
        image: "https://imgs.search.brave.com/_m_ydTHvAB9UbCbI5v99_TBa7VM7ptoTbjChUdoKC2g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1QllXSTNOalk1/WW1FdFptUmlPQzAw/T1dJeUxXRXpPRGt0/T1dNMU5HTTNPVEJq/WkRSaFhrRXlYa0Zx/Y0djQC5qcGc",
        requirements: {
            "Sistema Operacional": "Windows 10 64-bit",
            "Processador": "Intel Core i7-9700K / AMD Ryzen 7 3700X",
            "Memória": "16 GB RAM",
            "Placa de vídeo": "NVIDIA GeForce RTX 2070 / AMD Radeon RX 5700 XT",
            "DirectX": "Versão 12",
            "Armazenamento": "100 GB disponíveis"
        }
    },
    {
        id: 6,
        title: "Hell is Us",
        category: "acao",
        steamPrice: 149.90,
        ourPrice: 27.90,
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        requirements: {
            "Sistema Operacional": "Windows 10 64-bit",
            "Processador": "Intel Core i5-8400 / AMD Ryzen 5 2600",
            "Memória": "12 GB RAM",
            "Placa de vídeo": "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580",
            "DirectX": "Versão 12",
            "Armazenamento": "50 GB disponíveis"
        }
    },
    {
        id: 7,
        title: "Clair Obscur: Expedition 33",
        category: "rpg",
        steamPrice: 199.90,
        ourPrice: 29.90,
        image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        requirements: {
            "Sistema Operacional": "Windows 10",
            "Processador": "Intel Core i5-6600K / AMD Ryzen 5 1400",
            "Memória": "8 GB RAM",
            "Placa de vídeo": "NVIDIA GeForce GTX 1060 / AMD Radeon RX 580",
            "DirectX": "Versão 12",
            "Armazenamento": "40 GB disponíveis"
        }
    },
    {
        id: 8,
        title: "Elden Ring",
        category: "rpg",
        steamPrice: 249.90,
        ourPrice: 19.90,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        requirements: {
            "Sistema Operacional": "Windows 10",
            "Processador": "INTEL CORE I5-8400 or AMD RYZEN 3 3300X",
            "Memória": "12 GB RAM",
            "Placa de vídeo": "NVIDIA GEFORCE GTX 1060 3 GB or AMD RADEON RX 580 4 GB",
            "DirectX": "Versão 12",
            "Armazenamento": "60 GB disponíveis"
        }
    },
    {
        id: 9,
        title: "Resident Evil 4 Remake",
        category: "terror",
        steamPrice: 289.90,
        ourPrice: 29.90,
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        requirements: {
            "Sistema Operacional": "Windows 10",
            "Processador": "AMD Ryzen 3 1200 / Intel Core i5-7500",
            "Memória": "8 GB RAM",
            "Placa de vídeo": "AMD Radeon RX 560 / NVIDIA GeForce GTX 1050 Ti",
            "DirectX": "Versão 12",
            "Armazenamento": "60 GB disponíveis"
        }
    },
    {
        id: 10,
        title: "Forza Horizon 5",
        category: "corrida",
        steamPrice: 249.90,
        ourPrice: 29.90,
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        requirements: {
            "Sistema Operacional": "Windows 10 version 15063.0 or higher",
            "Processador": "Intel i5-4460 / AMD Ryzen 3 1200",
            "Memória": "8 GB RAM",
            "Placa de vídeo": "NVidia GTX 970 / AMD RX 470",
            "DirectX": "Versão 12",
            "Armazenamento": "110 GB disponíveis"
        }
    }
];

class PriceUpdateSystem {
    constructor() {
        this.gamesData = gamesData;
        this.updateAllDiscounts();
    }

    calculateDiscount(steamPrice, ourPrice) {
        if (steamPrice <= 0 || ourPrice >= steamPrice) return 0;
        return Math.round(((steamPrice - ourPrice) / steamPrice) * 100);
    }

    updateAllDiscounts() {
        this.gamesData.forEach(game => {
            game.discount = this.calculateDiscount(game.steamPrice, game.ourPrice);
        });
    }

    updateGamePrice(gameId, newSteamPrice, newOurPrice) {
        const game = this.gamesData.find(g => g.id === gameId);
        if (!game) return false;

        game.steamPrice = newSteamPrice;
        game.ourPrice = newOurPrice;
        game.discount = this.calculateDiscount(newSteamPrice, newOurPrice);

        this.updateDisplay(game);
        return true;
    }

    updateDisplay(game) {
        const gameCard = document.querySelector(`.game-card[data-game-id="${game.id}"]`);
        if (gameCard) {
            const discountBadge = gameCard.querySelector('.discount-badge');
            const currentPrice = gameCard.querySelector('.current-price');
            const originalPrice = gameCard.querySelector('.original-price');

            if (currentPrice) {
                currentPrice.textContent = `R$${game.ourPrice.toFixed(2)}`;
            }

            if (originalPrice) {
                originalPrice.textContent = game.steamPrice > 0 ? `R$${game.steamPrice.toFixed(2)}` : '';
            }

            if (discountBadge) {
                if (game.discount > 0) {
                    discountBadge.textContent = `-${game.discount}%`;
                    discountBadge.style.display = 'block';
                } else {
                    discountBadge.style.display = 'none';
                }
            }
        }

        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle && modalTitle.textContent === game.title) {
            document.getElementById('modalPrice').textContent = `R$${game.ourPrice.toFixed(2)}`;
            if (game.steamPrice > 0) {
                document.getElementById('modalOriginalPrice').textContent = `De: R$${game.steamPrice.toFixed(2)}`;
            } else {
                document.getElementById('modalOriginalPrice').textContent = '';
            }
        }
    }

    editGamePrice(gameId) {
        const game = this.gamesData.find(g => g.id === gameId);
        if (!game) {
            alert('Jogo não encontrado!');
            return;
        }

        const newSteamPrice = parseFloat(prompt(`Editar preço da Steam para "${game.title}" (atual: R$${game.steamPrice.toFixed(2)}):`, game.steamPrice));
        if (isNaN(newSteamPrice) || newSteamPrice < 0) {
            alert('Preço da Steam inválido!');
            return;
        }

        const newOurPrice = parseFloat(prompt(`Editar nosso preço para "${game.title}" (atual: R$${game.ourPrice.toFixed(2)}):`, game.ourPrice));
        if (isNaN(newOurPrice) || newOurPrice < 0) {
            alert('Nosso preço inválido!');
            return;
        }

        if (this.updateGamePrice(gameId, newSteamPrice, newOurPrice)) {
            alert(`Preços atualizados!\nSteam: R$${newSteamPrice.toFixed(2)}\nNosso: R$${newOurPrice.toFixed(2)}\nDesconto: ${this.calculateDiscount(newSteamPrice, newOurPrice)}%`);
        }
    }
}

class FilterSystem {
    constructor() {
        this.currentFilter = 'todos';
        this.currentSearch = '';
        this.gamesGrid = document.getElementById('games-grid');
        this.filterButtons = document.getElementById('filterButtons');
        this.searchInput = document.getElementById('searchInput');
        this.searchResultsInfo = document.getElementById('searchResultsInfo');
        this.priceUpdateSystem = new PriceUpdateSystem();
        this.init();
    }

    init() {
        this.renderGames();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.filterButtons.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const category = e.target.dataset.category;
                this.setActiveFilter(category);
                this.filterGames();
            }
        });

        this.searchInput.addEventListener('input', () => {
            this.currentSearch = this.searchInput.value.toLowerCase();
            this.filterGames();
        });
    }

    setActiveFilter(category) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`.filter-btn[data-category="${category}"]`).classList.add('active');
        this.currentFilter = category;
    }

    filterGames() {
        const games = this.gamesGrid.querySelectorAll('.game-card');
        let visibleCount = 0;
        
        games.forEach(game => {
            const gameCategory = game.dataset.category;
            const gameTitle = game.querySelector('.game-title').textContent.toLowerCase();
            
            const matchesCategory = this.currentFilter === 'todos' || gameCategory === this.currentFilter;
            const matchesSearch = !this.currentSearch || gameTitle.includes(this.currentSearch);
            
            if (matchesCategory && matchesSearch) {
                game.classList.remove('hidden');
                game.classList.add('visible');
                setTimeout(() => {
                    game.style.display = 'flex';
                }, 50);
                visibleCount++;
            } else {
                game.classList.remove('visible');
                game.classList.add('hidden');
                setTimeout(() => {
                    game.style.display = 'none';
                }, 300);
            }
        });
        
        this.updateSearchResultsInfo(visibleCount);
    }

    updateSearchResultsInfo(visibleCount) {
        const totalCount = this.gamesGrid.querySelectorAll('.game-card').length;
        
        if (this.currentSearch) {
            this.searchResultsInfo.textContent = 
                `Mostrando ${visibleCount} de ${totalCount} jogos para "${this.currentSearch}"`;
            this.searchResultsInfo.style.color = 'var(--primary-color)';
        } else if (this.currentFilter !== 'todos') {
            this.searchResultsInfo.textContent = 
                `Mostrando ${visibleCount} de ${totalCount} jogos na categoria ${this.currentFilter}`;
            this.searchResultsInfo.style.color = 'var(--accent-color)';
        } else {
            this.searchResultsInfo.textContent = `Mostrando todos os ${totalCount} jogos`;
            this.searchResultsInfo.style.color = '#aaa';
        }
    }

    renderGames() {
        if (!this.gamesGrid) return;
        
        let html = '';
        gamesData.forEach((game, index) => {
            const discount = this.priceUpdateSystem.calculateDiscount(game.steamPrice, game.ourPrice);
            
            const discountBadge = discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : '';
            
            const priceDisplay = `R$${game.ourPrice.toFixed(2)}`;
            const originalPriceDisplay = game.steamPrice > 0 ? `<span class="original-price">R$${game.steamPrice.toFixed(2)}</span>` : '';
            
            html += `
                <div class="game-card scale-in-fast visible" style="--i: ${index};" data-category="${game.category}" data-game-id="${game.id}">
                    <img src="${game.image}" alt="${game.title}" class="game-img">
                    ${discountBadge}
                    <div class="game-info">
                        <h3 class="game-title">${game.title}</h3>
                        <div class="game-price">
                            <span class="current-price">${priceDisplay}</span>
                            ${originalPriceDisplay}
                        </div>
                        <button class="buy-btn" onclick="openGameModal(${game.id})">
                            <i class="fas fa-shopping-cart"></i> Comprar
                        </button>
                        <button class="buy-btn" style="background: linear-gradient(135deg, #666, #444); font-size: 0.8rem; padding: 8px;" onclick="priceUpdateSystem.editGamePrice(${game.id})">
                            <i class="fas fa-edit"></i> Editar Preço
                        </button>
                    </div>
                </div>
            `;
        });
        
        this.gamesGrid.innerHTML = html;
        
        setTimeout(() => {
            const cards = this.gamesGrid.querySelectorAll('.scale-in-fast');
            cards.forEach((card, i) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, i * 100);
            });
        }, 100);
    }
}

let currentModalGame = null;
let priceUpdateSystem = null;

function openGameModal(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;
    
    currentModalGame = game;
    
    document.getElementById('modalImage').src = game.image;
    document.getElementById('modalTitle').textContent = game.title;
    document.getElementById('modalPrice').textContent = `R$${game.ourPrice.toFixed(2)}`;
    
    if (game.steamPrice > 0) {
        document.getElementById('modalOriginalPrice').textContent = `De: R$${game.steamPrice.toFixed(2)}`;
    } else {
        document.getElementById('modalOriginalPrice').textContent = '';
    }
    
    const requirementsGrid = document.getElementById('modalRequirements');
    requirementsGrid.innerHTML = '';
    
    if (game.requirements) {
        for (const [key, value] of Object.entries(game.requirements)) {
            const requirementItem = document.createElement('div');
            requirementItem.className = 'requirement-item';
            
            requirementItem.innerHTML = `
                <h4>${key}:</h4>
                <p>${value}</p>
            `;
            
            requirementsGrid.appendChild(requirementItem);
        }
    }
    
    document.getElementById('gameModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGameModal() {
    document.getElementById('gameModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function comprarJogoModal() {
    if (currentModalGame) {
        closeGameModal();
        setTimeout(() => {
            showDiscordModal(currentModalGame.title);
        }, 50);
    }
}

let currentGameTitle = '';

function showDiscordModal(gameTitle) {
    currentGameTitle = gameTitle;
    document.getElementById('modalGameTitle').textContent = gameTitle;
    document.getElementById('commandText').textContent = `/comprar ${gameTitle}`;
    document.getElementById('discordModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('discordModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openDiscord() {
    window.open('https://discord.gg/3hPTerCjju', '_blank');
}

function copyCommand() {
    const command = `/comprar ${currentGameTitle}`;
    navigator.clipboard.writeText(command).then(() => {
        alert('✅ Comando copiado! Agora vá para o Discord e cole no canal #comprar-aqui');
    });
}

function openModal(modalType) {
    let modalId = '';
    switch(modalType) {
        case 'termos':
            modalId = 'termosModal';
            break;
        case 'privacidade':
            modalId = 'privacidadeModal';
            break;
        case 'faq':
            modalId = 'faqModal';
            break;
    }
    
    if (modalId) {
        document.getElementById(modalId).style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeInfoModal(modalType) {
    let modalId = '';
    switch(modalType) {
        case 'termos':
            modalId = 'termosModal';
            break;
        case 'privacidade':
            modalId = 'privacidadeModal';
            break;
        case 'faq':
            modalId = 'faqModal';
            break;
    }
    
    if (modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function checkScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up-fast, .fade-in-fast, .scale-in-fast, .slide-left-fast, .slide-right-fast, .rotate-in');
    const windowHeight = window.innerHeight;
    const triggerOffset = 50;
    
    elements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - triggerOffset) {
            element.classList.add('visible');
            
            if (element.classList.contains('game-card')) {
                element.style.transitionDelay = `${index * 0.03}s`;
            }
        }
    });
    
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        document.querySelector('.header-container').style.padding = '10px 0';
    } else {
        header.classList.remove('scrolled');
        document.querySelector('.header-container').style.padding = '15px 0';
    }
}

// Função para filtrar jogos pela pesquisa
function filterGamesBySearch() {
    const searchInput = document.getElementById('searchInput');
    const filterSystem = window.filterSystem;
    
    if (filterSystem) {
        filterSystem.currentSearch = searchInput.value.toLowerCase();
        filterSystem.filterGames();
    }
}

// Função para controlar o vídeo de fundo
function initBackgroundVideo() {
    const video = document.querySelector('#bg-video');
    if (!video) return;
    
    console.log('Inicializando vídeo de fundo...');
    
    // Configurar vídeo
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // Tentar reproduzir automaticamente
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay bloqueado:', error);
            
            // Mostrar botão de play se autoplay falhar
            showVideoPlayButton();
            
            // Tentar reproduzir com interação do usuário
            document.addEventListener('click', function playOnClick() {
                video.play();
                document.removeEventListener('click', playOnClick);
            }, { once: true });
        });
    }
    
    // Otimizar para mobile
    if (window.innerWidth <= 768) {
        video.style.display = 'none';
        console.log('Vídeo desativado em dispositivos móveis');
    }
    
    // Verificar se o vídeo carregou
    video.addEventListener('loadeddata', function() {
        console.log('Vídeo de fundo carregado com sucesso!');
    });
    
    video.addEventListener('error', function(e) {
        console.error('Erro ao carregar vídeo:', e);
        showFallbackBackground();
    });
}

// Mostrar botão de play se necessário
function showVideoPlayButton() {
    const existingBtn = document.querySelector('.video-play-btn');
    if (existingBtn) return;
    
    const playBtn = document.createElement('button');
    playBtn.className = 'video-play-btn';
    playBtn.innerHTML = '<i class="fas fa-play"></i> Ativar Fundo';
    playBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 99999;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
        transition: all 0.3s ease;
    `;
    
    playBtn.addEventListener('mouseenter', () => {
        playBtn.style.transform = 'translateY(-3px)';
        playBtn.style.boxShadow = '0 6px 20px rgba(255, 0, 0, 0.4)';
    });
    
    playBtn.addEventListener('mouseleave', () => {
        playBtn.style.transform = 'translateY(0)';
        playBtn.style.boxShadow = '0 4px 15px rgba(255, 0, 0, 0.3)';
    });
    
    playBtn.addEventListener('click', () => {
        const video = document.querySelector('#bg-video');
        if (video) {
            video.play().then(() => {
                playBtn.style.display = 'none';
                console.log('Vídeo iniciado pelo usuário');
            }).catch(error => {
                console.log('Usuário não permitiu reprodução:', error);
                alert('Por favor, permita a reprodução automática para o vídeo de fundo.');
            });
        }
    });
    
    document.body.appendChild(playBtn);
}

// Mostrar fallback se o vídeo falhar
function showFallbackBackground() {
    const videoContainer = document.querySelector('.video-background');
    if (videoContainer) {
        videoContainer.style.background = 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%)';
    }
    console.log('Usando fallback background');
}

// Inicialização principal - CORRIGIDA
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Carregado - Iniciando tela de carregamento');
    
    // Verificar se já estamos no estado carregado
    if (document.readyState === 'complete') {
        console.log('Página já carregada, pulando tela de loading');
        document.getElementById('loading-screen').style.display = 'none';
        document.body.style.overflow = 'auto';
        initAfterLoading();
        return;
    }
    
    // Adicionar evento para quando a página estiver completamente carregada
    window.addEventListener('load', function() {
        console.log('Todos os recursos carregados');
    });
    
    // Iniciar tela de carregamento
    initializeLoadingScreen();
});

// Adicionar timeout global como backup
setTimeout(checkIfLoaded, 8000); // 8 segundos no máximo

// Safety: Forçar inicialização após 5 segundos como fallback
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('Fallback de 5 segundos ativado - forçando fechamento');
        loadingScreen.classList.add('loaded');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Iniciar sistemas se ainda não iniciados
            if (typeof initAfterLoading === 'function') {
                initAfterLoading();
            }
        }, 500);
    }
}, 5000);