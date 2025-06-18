const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});

function logout() {
    confirm('Você irá deslogar, quer prosseguir?')
    window.location.href = '../aLogin/index.html'
}

// --- lógica de busca ---

const searchInput = document.getElementById('searchInput');
const lojasContainer = document.getElementById('lojasContainer');
const allLojas = lojasContainer.querySelectorAll('.item-link');

searchInput.addEventListener('input', function () {
    // Trim para remover espaços em branco no início/fim e toLowerCase para busca sem case-sensitive
    const searchTerm = this.value.trim().toLowerCase();

    allLojas.forEach(loja => {
        // Pega o texto do item-code (ex: "Loja 1")
        const lojaName = loja.querySelector('.item-code').textContent.toLowerCase();
        // Pega o texto do endereço (ex: "17563 Albuquerque Marginal - ...")
        const lojaAddress = loja.querySelector('div:last-child').textContent.toLowerCase();

        // Combina o texto relevante para a busca
        const searchableText = `${lojaName} ${lojaAddress}`;

        // Se o texto pesquisável da loja incluir o termo de busca, exibe; caso contrário, esconde
        if (searchableText.includes(searchTerm)) {
            loja.style.display = ''; // Volta ao display padrão (flex)
        } else {
            loja.style.display = 'none'; // Esconde a loja
        }
    });
});