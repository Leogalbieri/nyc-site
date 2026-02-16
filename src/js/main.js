// FUNÇÃO PRINCIPAL

// Aguarda o HTML carregar antes de rodar o script
document.addEventListener("DOMContentLoaded", function() {

    // Seleção de elementos
    const links = document.querySelectorAll('.nav-link'); // Links do menu
    const pages = document.querySelectorAll('.page-content'); // Seções de texto
    const heroTitle = document.querySelector('.content h1'); // Título
    
    const learnMoreBtn = document.getElementById('learn-more-btn'); // Botão Learn More
    const pagesContainer = document.getElementById('pages-container'); // Container do conteúdo

    // Títulos
    const titles = [
        "NEW YORK",
        "STATUE OF LIBERTY",
        "TIMES SQUARE",
        "CENTRAL PARK",
        "EMPIRE STATE",
        "BROADWAY"
    ];

    // "Troca" a página ao esconder e mostrar seções específicas
    function changePage(index, shouldScroll = true) {
        index = parseInt(index); 

        // Sobe a página até o hero ao trocar de seção
        if (shouldScroll) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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

    // Arruma o refresh, sem voltar para a home
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash !== "" && !isNaN(currentHash)) {
        changePage(currentHash, false);
    } else {
        changePage(0, false); 
    }
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