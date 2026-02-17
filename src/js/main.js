// Desabilitar reset de scroll do navegador
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// FUNÇÃO PRINCIPAL

// Aguarda o HTML carregar antes de rodar o script
document.addEventListener("DOMContentLoaded", function() {

    // Seleção de elementos
    const links = document.querySelectorAll('.nav-link'); // Links do menu
    const pages = document.querySelectorAll('.page-content'); // Seções de texto
    const heroTitle = document.querySelector('.content h1'); // Título
    const videoPlayer = document.getElementById('bg-video'); // Seleciona o vídeo de fundo
    const heroSection = document.querySelector('.hero');
    
    const learnMoreBtn = document.getElementById('learn-more-btn'); // Botão Learn More
    const pagesContainer = document.getElementById('pages-container'); // Container do conteúdo

    // Títulos
    const titles = [
        "NEW YORK",
        "STATUE OF LIBERTY",
        "TIMES SQUARE",
        "CENTRAL PARK",
        "EMPIRE STATE",
        "BROOKLYN BRIDGE"
    ];

     // Vídeos
    const videoSources = [
        "assets/videos/nyc.mp4?v=2",
        "assets/videos/statue_of_liberty.mp4?v=2",
        "assets/videos/times_square.mp4?v=2",
        "assets/videos/central_park.mp4?v=2",
        "assets/videos/empire_state.mp4?v=2",
        "assets/videos/brooklyn_bridge.mp4?v=2"
    ];

    // Primeiro frame do vídeo para evitar fundo preto
    const videoPosters = [
        "assets/img/nyc.webp",
        "assets/img/statue_of_liberty.webp",
        "assets/img/times_square.webp",
        "assets/img/central_park.webp",
        "assets/img/empire_state.webp",
        "assets/img/brooklyn_bridge.webp"
    ];



    // Função troca vídeo
    function updateVideo(index) {
        if (!videoPlayer || !videoSources[index]) return;

        videoPlayer.poster = videoPosters[index];
        videoPlayer.src = videoSources[index];

        const p = videoPlayer.play();
        if (p && p.catch) p.catch(() => {});
    }



    // "Troca" a página ao esconder e mostrar seções específicas
    function changePage(index, shouldScroll = true) {
        index = parseInt(index); 
        
        // Chama a função para trocar o vídeo de fundo
        updateVideo(index);

        // Sobe a página até o hero ao trocar de seção
        if (shouldScroll) {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Remove todos os "active" antes de trocar de seção
        links.forEach(link => link.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));

        // Colocar o "active" na seção que deve ser mostrada
        if(links[index]) links[index].classList.add('active');

        // Procura a seção pelo ID e a torna visível
        const targetPage = document.getElementById(`page-${index}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Animação do título
        if (heroTitle) {
            heroTitle.classList.remove('animate-title');
            heroTitle.innerText = titles[index];
            void heroTitle.offsetWidth; 
            heroTitle.classList.add('animate-title');
        }

        // Atualiza o endereço do navegador, faz o refresh ficar na parte específica ao invés de voltar ao início do site
        window.location.hash = index;
    }



    // Troca a seção quando o vídeo acabar
    if (videoPlayer) {
        videoPlayer.addEventListener('ended', function() {
            let currentIndex = parseInt(window.location.hash.replace('#', '')) || 0;
            let nextIndex = (currentIndex + 1) % titles.length;

            changePage(nextIndex, true);
        });
    }



    // Ao clicar no "learn more", ele te move para a seção de texto fora do hero
    if (learnMoreBtn && pagesContainer) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = pagesContainer.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }



    // Adiciona o evento de clique em todos os links da navegação
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const index = this.getAttribute('data-index');
            changePage(index);
        });
    });



// 1. CAPTURA A POSIÇÃO ANTES DE MUDAR QUALQUER COISA
    const currentHash = window.location.hash.replace('#', '');
    const savedScrollPos = sessionStorage.getItem('retainedScroll') || window.scrollY;

    // 2. FUNÇÃO PARA RESTAURAR SEM PULO
    const restoreScroll = () => {
        window.scrollTo(0, savedScrollPos);
    };

    if (currentHash !== "" && !isNaN(currentHash)) {
        // 'false' para não dar scroll automático do changePage
        changePage(currentHash, false);
    } else {
        changePage(0, false); 
    }

    // 3. O PULO DO GATO: Forçamos o scroll várias vezes nos primeiros milissegundos
    // Isso combate o "atraso" do carregamento do vídeo que empurra a página
    restoreScroll();
    setTimeout(restoreScroll, 10);
    setTimeout(restoreScroll, 50);
    setTimeout(restoreScroll, 100);

    // Salva a posição ao scrollar para garantir que o refresh saiba onde voltar
    window.addEventListener('scroll', () => {
        sessionStorage.setItem('retainedScroll', window.scrollY);
    });



    // Se o hero for mais de 50% visível, o vídeo troca de seção. Se for menos que 10% visível, o vídeo roda em loop. Se não for visível, o vídeo pausa.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!videoPlayer) return;

            // Caso 1: Mais de 10% visível -> troca de seção
            if (entry.intersectionRatio > 0.5) {
                videoPlayer.loop = false; 
                videoPlayer.play().catch(e => {});
            } 
            // Caso 2: Entre 1% e 50% visível -> vídeo em loop
            else if (entry.intersectionRatio > 0 && entry.intersectionRatio <= 0.5) {
                videoPlayer.loop = true;
                videoPlayer.play().catch(e => {});
            }
            // Caso 3: 0% visível -> vídeo pausado
            else {
                videoPlayer.pause();
            }
        });
    }, {
        // Detecção da visibilidade do hero
        threshold: [0, 0.01, 0.5, 1.0] 
    });

    if (heroSection) {
        observer.observe(heroSection);
    }



    // ANIMAÇÃO DAS SEÇÕES E RESET
    let isScrollingToTop = false;

    const revealRow = new IntersectionObserver((entries) => {
        if (isScrollingToTop) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                revealRow.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.05, 
        rootMargin: "0px 0px -10% 0px" 
    });

    function resetAndInitReveal() {
        isScrollingToTop = true;
        
        document.querySelectorAll('.timeline-row').forEach(row => {
            row.classList.remove('reveal');
            revealRow.unobserve(row); // Para de observar tudo para limpar o cache
        });

        // Tempo para o scroll chegar no topo
        setTimeout(() => {
            isScrollingToTop = false;

            document.querySelectorAll('.timeline-row').forEach((row, index) => {
                revealRow.observe(row);

                // Se for o primeiro ou segundo item e já estiver aparecendo um pedaço dele, força a revelação
                const rect = row.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    row.classList.add('reveal');
                    revealRow.unobserve(row);
                }
            });
        }, 850);
    }

    // Conecta aos links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', resetAndInitReveal);
    });

    // Inicialização
    resetAndInitReveal();

    

});



// -------------------------------------------------------------------------------------

// NavBar sólida ao sair do hero

const navEl = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navEl.classList.add('nav-scrolled');
    } else if (window.scrollY <= 50) {
        navEl.classList.remove('nav-scrolled');
    }
})



// HAMBÚRGUER

const nav = document.querySelector('.nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const learnMoreBtn = document.getElementById('learn-more-btn');

// Função para abrir/fechar nav
function toggleMenu() {
    nav.classList.toggle('active');
}

// Fechar ao clicar em qualquer link do menu
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Fechar ao clicar no botão Learn More
learnMoreBtn.addEventListener('click', () => {
    nav.classList.remove('active');
});

// Fechar ao clicar fora da nav
document.addEventListener('click', (e) => {
    // Se a nav estiver aberta, e o clique não for no nav nem no hamburger
    if(nav.classList.contains('active') && !nav.contains(e.target) && !hamburger.contains(e.target)){
        nav.classList.remove('active');
    }
});

