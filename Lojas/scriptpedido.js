// Lógica que é executada quando o HTML estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- Seleção de Elementos HTML ---
    const productSelect = document.getElementById('product-select');
    const quantityInput = document.getElementById('quantity-input');
    const summaryProductName = document.getElementById('summary-product-name');
    const summaryOrderDate = document.getElementById('summary-order-date');
    const summaryQuantity = document.getElementById('summary-quantity');
    const completeOrderBtn = document.querySelector('.complete-order-btn');

    // --- Lógica para preencher a data atual ---
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR'); // Formato de data local
    if (summaryOrderDate) {
        summaryOrderDate.textContent = formattedDate; // Atualiza o conteúdo do span
    }

    // --- Função para atualizar o resumo do pedido ---
    const updateOrderSummary = () => {
        const selectedProductText = productSelect.options[productSelect.selectedIndex].textContent;
        const enteredQuantity = quantityInput.value;

        // Atualiza o texto dos spans no resumo
        if (summaryProductName) {
            summaryProductName.textContent = selectedProductText || '(nome produto)';
        }
        if (summaryQuantity) {
            summaryQuantity.textContent = enteredQuantity || '[Quantidade]';
        }
    };

    // --- Adiciona 'listeners' para atualizar o resumo quando houver mudanças ---
    if (productSelect) {
        productSelect.addEventListener('change', updateOrderSummary);
    }
    if (quantityInput) {
        quantityInput.addEventListener('input', updateOrderSummary); // 'input' detecta cada mudança
    }

    // --- Lógica para o botão "concluir pedido" ---
    if (completeOrderBtn) {
        completeOrderBtn.addEventListener('click', () => {
            const selectedProduct = productSelect.value;
            const quantity = parseInt(quantityInput.value, 10); // Converte para número inteiro

            if (selectedProduct && quantity > 0) {
                alert(`Pedido Concluído:\nProduto: ${productSelect.options[productSelect.selectedIndex].textContent}\nQuantidade: ${quantity}\nData: ${formattedDate}`);
                // Em um projeto real, aqui você enviaria esses dados para um servidor (backend)

                // Opcional: Limpa os campos após "concluir"
                productSelect.value = ''; // Reseta a seleção
                quantityInput.value = '1'; // Reseta a quantidade
                updateOrderSummary(); // Atualiza o resumo para refletir os campos limpos
            } else {
                alert('Por favor, selecione um produto e insira uma quantidade válida (maior que zero).');
            }
        });
    }

    // --- Lógica para a Barra Lateral (Sidebar) ---
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove a classe 'active' de todos os itens
            sidebarItems.forEach(i => i.classList.remove('active'));
            // Adiciona a classe 'active' apenas ao item clicado
            item.classList.add('active');

            console.log(`Item clicado: ${item.textContent}`);
            // Aqui você adicionaria a lógica para carregar conteúdo diferente
            // dependendo do item do menu clicado. Por exemplo, para alternar entre telas:
            // if (item.textContent.includes('Início')) {
            //     window.location.href = 'index.html'; // Redireciona para a tela inicial
            // } else if (item.textContent.includes('Pedido:')) {
            //     window.location.href = 'pedido.html'; // Redireciona para a tela de pedido (ou permanece aqui)
            // }
        });
    });

    // --- Chamada inicial para preencher o resumo assim que a página carrega ---
    updateOrderSummary();
});