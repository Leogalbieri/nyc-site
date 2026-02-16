document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    const heroTitle = document.querySelector('.content h1');

    const titles = [
        "NEW YORK",
        "STATUE OF LIBERTY",
        "TIMES SQUARE",
        "CENTRAL PARK",
        "EMPIRE STATE",
        "BROADWAY"
    ];

    // Adicionamos o shouldScroll = true por padrão
    function changePage(index, shouldScroll = true) {
        index = parseInt(index); 

        // 1. Só reseta o Scroll se o clique veio do menu (shouldScroll for true)
        if (shouldScroll) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // 2. Limpa classes ativas
        links.forEach(link => link.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));

        // 3. Ativa o link e a página
        if(links[index]) links[index].classList.add('active');
        
        const targetPage = document.getElementById(`page-${index}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        if (heroTitle) {
            heroTitle.classList.remove('animate-title');
            heroTitle.innerText = titles[index];
            void heroTitle.offsetWidth; 
            heroTitle.classList.add('animate-title');
        }

        // 4. Salva o índice na URL
        window.location.hash = index;
    }

    // Evento de Clique: aqui o scroll deve acontecer (comportamento padrão)
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const index = this.getAttribute('data-index');
            changePage(index); // shouldScroll é true
        });
    });

    // LÓGICA DE REFRESH: aqui passamos 'false' para o scroll não resetar
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash !== "" && !isNaN(currentHash)) {
        changePage(currentHash, false); // Muda o conteúdo, mas mantém a posição do scroll
    } else {
        changePage(0, false); 
    }
});


// NavBar sólida ao sair do hero

const navEl = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navEl.classList.add('nav-scrolled');
    } else if (window.scrollY <= 50) {
        navEl.classList.remove('nav-scrolled');
    }
})


