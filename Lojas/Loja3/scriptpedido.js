// Lógica que é executada quando o HTML estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- Seleção de Elementos HTML ---
    const productSelect = document.getElementById('product-select');
    const quantityInput = document.getElementById('quantidade');
    const summaryProductName = document.getElementById('produto-nome');
    const summaryQuantity = document.getElementById('quantidade-display');
    // REMOVIDO: estimatedDateInput e summaryOrderDate
    const completeOrderBtn = document.querySelector('.concluir-pedido-btn');
    const gerenteNomeSpan = document.getElementById('gerente-nome');
    const enderecoLojaSpan = document.getElementById('endereco-loja');

    // --- Popular o Dropdown de Produtos com dados do localStorage ---
    const lotesSalvos = JSON.parse(localStorage.getItem("lotes")) || [];

    const saboresUnicos = new Set();
    lotesSalvos.forEach(lote => {
        if (lote.sabor) {
            saboresUnicos.add(lote.sabor);
        }
    });

    saboresUnicos.forEach(sabor => {
        const option = document.createElement('option');
        option.value = sabor; // O valor da opção será o sabor
        option.textContent = sabor;
        productSelect.appendChild(option);
    });

    // --- Função para atualizar o resumo do pedido ---
    const updateOrderSummary = () => {
        const selectedProductText = productSelect.options[productSelect.selectedIndex].textContent;
        const enteredQuantity = quantityInput.value;
        // REMOVIDO: selectedDate

        // Atualiza o texto dos spans no resumo
        if (summaryProductName) {
            summaryProductName.textContent = selectedProductText && selectedProductText !== '-- Selecione um produto --' ? selectedProductText : '(produto nome)';
        }
        if (summaryQuantity) {
            summaryQuantity.textContent = enteredQuantity || '(num)';
        }
        // REMOVIDO: Lógica para exibir a data
    };

    // --- Adiciona 'listeners' para atualizar o resumo quando houver mudanças ---
    if (productSelect) {
        productSelect.addEventListener('change', updateOrderSummary);
    }
    if (quantityInput) {
        quantityInput.addEventListener('input', updateOrderSummary);
    }
    // REMOVIDO: Listener para estimatedDateInput

    // --- Lógica para a Barra Lateral (Sidebar) ---
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });

    function logout() {
        if (confirm('Você irá deslogar, quer prosseguir?')) {
            window.location.href = '../aLogin/index.html';
        }
    }
    window.logout = logout; // Torna a função logout globalmente acessível

    // --- Carregar e exibir o nome do gerente ---
    const nomeGerente = localStorage.getItem('gerente');
    if (gerenteNomeSpan && nomeGerente) {
        gerenteNomeSpan.textContent = nomeGerente;
    } else if (gerenteNomeSpan) {
        gerenteNomeSpan.textContent = 'Não definido';
    }

    // --- Função para CONCLUIR PEDIDO ---
    window.concluirPedido = () => {
        const selectedProductSabor = productSelect.value; // Pega o sabor selecionado
        const quantity = parseInt(quantityInput.value, 10);
        // REMOVIDO: estimatedDate

        if (selectedProductSabor && selectedProductSabor !== '' && quantity > 0) {
            // Salva a 'quantity' no localStorage como 'novoValor'
            localStorage.setItem("novoValor", quantity);

            // Carrega os lotes do localStorage
            let lotes = JSON.parse(localStorage.getItem("lotes")) || [];

            // Encontra o lote correspondente ao sabor selecionado
            const loteIndex = lotes.findIndex(lote => lote.sabor === selectedProductSabor);

            if (loteIndex !== -1) {
                // Verifica se há estoque suficiente
                if (quantity <= lotes[loteIndex].quantidade) {
                    // Subtrai a 'quantity' do 'qtd' do lote
                    lotes[loteIndex].quantidade -= quantity;

                    // Salva os lotes atualizados de volta no localStorage
                    localStorage.setItem("lotes", JSON.stringify(lotes));

                    const orderSummaryMessage = `
--- Pedido Concluído ---
Produto: ${productSelect.options[productSelect.selectedIndex].textContent}
Quantidade: ${quantity}
Endereço: ${enderecoLojaSpan.textContent}
Gerente: ${gerenteNomeSpan.textContent}
-----------------------
`;
                    if (confirm(orderSummaryMessage + "\nDeseja finalizar o pedido e reiniciar a página?")) {
                        window.location.reload();
                    }
                } else {
                    alert(`Quantidade maior que o estoque disponível para o sabor ${selectedProductSabor}. Estoque atual: ${lotes[loteIndex].quantidade}`);
                }
            } else {
                alert('Produto não encontrado no estoque.');
            }
        } else {
            alert('Por favor, selecione um produto e insira uma quantidade válida (maior que zero).');
        }
    };

    // --- Chamada inicial para preencher o resumo assim que a página carrega ---
    updateOrderSummary();
});