document.addEventListener('DOMContentLoaded', () => {

    // --- Seleção de Elementos HTML ---
    const productSelect = document.getElementById('product-select');
    const quantityInput = document.getElementById('quantidade');
    const summaryProductName = document.getElementById('produto-nome');
    const summaryQuantity = document.getElementById('quantidade-display');
    const gerenteNomeSpan = document.getElementById('gerente-nome');
    const enderecoLojaSpan = document.getElementById('endereco-loja');
    const nomeLoja = document.querySelector('.loja-header h2').textContent.trim(); // Pega "Loja 1", "Loja 2" ou "Loja 3"

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
        option.value = sabor;
        option.textContent = sabor;
        productSelect.appendChild(option);
    });

    // --- Função para atualizar o resumo do pedido ---
    const updateOrderSummary = () => {
        const selectedProductText = productSelect.options[productSelect.selectedIndex].textContent;
        const enteredQuantity = quantityInput.value;

        if (summaryProductName) {
            summaryProductName.textContent = selectedProductText && selectedProductText !== '-- Selecione um produto --' ? selectedProductText : '(produto nome)';
        }
        if (summaryQuantity) {
            summaryQuantity.textContent = enteredQuantity || '(num)';
        }
    };

    // --- Atualiza o resumo sempre que mudar produto ou quantidade ---
    productSelect.addEventListener('change', updateOrderSummary);
    quantityInput.addEventListener('input', updateOrderSummary);

    // --- Toggle Sidebar ---
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.getElementById("sidebar");

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
    });

    // --- Função logout ---
    function logout() {
        if (confirm('Você irá deslogar, quer prosseguir?')) {
            window.location.href = '../aLogin/index.html';
        }
    }
    window.logout = logout;

    // --- Mostrar nome do gerente ---
    const nomeGerente = localStorage.getItem('gerente');
    if (gerenteNomeSpan && nomeGerente) {
        gerenteNomeSpan.textContent = nomeGerente;
    } else if (gerenteNomeSpan) {
        gerenteNomeSpan.textContent = 'Não definido';
    }

    // --- Função para gerar código único de pedido ---
    function gerarCodigoPedido() {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const numero = pedidos.length + 1;
        return `P${String(numero).padStart(3, '0')}`;
    }

    // --- Função concluir pedido ---
    window.concluirPedido = () => {
        const selectedProductSabor = productSelect.value;
        const quantity = parseInt(quantityInput.value, 10);

        if (!selectedProductSabor || selectedProductSabor === '' || quantity <= 0) {
            alert('Por favor, selecione um produto e insira uma quantidade válida (maior que zero).');
            return;
        }

        let lotes = JSON.parse(localStorage.getItem("lotes")) || [];
        const loteIndex = lotes.findIndex(lote => lote.sabor === selectedProductSabor);

        if (loteIndex === -1) {
            alert('Produto não encontrado no estoque.');
            return;
        }

        if (quantity > lotes[loteIndex].quantidade) {
            alert(`Quantidade maior que o estoque disponível para o sabor ${selectedProductSabor}. Estoque atual: ${lotes[loteIndex].quantidade}`);
            return;
        }

        // Atualiza estoque
        lotes[loteIndex].quantidade -= quantity;
        localStorage.setItem("lotes", JSON.stringify(lotes));

        // Criar novo pedido com campo loja
        const novoPedido = {
            codigo: gerarCodigoPedido(),
            produto: selectedProductSabor,
            quantidade: quantity,
            endereco: enderecoLojaSpan.textContent || 'Não definido',
            gerente: gerenteNomeSpan.textContent || 'Não definido',
            loja: nomeLoja,   // <<< Salva o nome da loja aqui
            data: new Date().toLocaleDateString()
        };

        // Puxa pedidos existentes, adiciona novo e salva
        let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        pedidos.unshift(novoPedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));

        // Mostrar resumo e perguntar se quer reiniciar
        const orderSummaryMessage = `
--- Pedido Concluído ---
Produto: ${novoPedido.produto}
Quantidade: ${novoPedido.quantidade}
Loja: ${novoPedido.loja}
Endereço: ${novoPedido.endereco}
Gerente: ${novoPedido.gerente}
-----------------------
`;

        if (confirm(orderSummaryMessage + "\nDeseja finalizar o pedido e reiniciar a página?")) {
            window.location.reload();
        }
    };

    // --- Inicializa o resumo ---
    updateOrderSummary();

});
//FUNCAO DE MOSTAR USER 
document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const nomeUsuario = document.getElementById("username");
  
    if (usuarioLogado && usuarioLogado.nome && nomeUsuario) {
      nomeUsuario.textContent = `Olá, ${usuarioLogado.nome}`;
    } else {
      // Se não tiver usuário logado, força logout ou redireciona
      
      
    }
  });