document.addEventListener('DOMContentLoaded', () => {
  const estoqueContainer = document.getElementById('estoqueContainer');
  const filterInput = document.querySelector('.filter-box input');
  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

  // Função de mostrar usuário (já existente)
  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const nomeUsuario = document.getElementById("username");

  if (usuarioLogado && usuarioLogado.nome && nomeUsuario) {
      nomeUsuario.textContent = `Olá, ${usuarioLogado.nome}`;
  } else {
      // Se não tiver usuário logado, força logout ou redireciona
  }

  init();

  function init() {
      renderPedidos();
      filterInput.addEventListener('input', renderPedidos);
  }

  // Função para mostrar/esconder detalhes (adaptada do Estoque)
  function mostrarDetalhes(itemElement) {
      itemElement.classList.toggle('expanded');
  }

  function renderPedidos() {
      const filtro = filterInput.value.toLowerCase();
      estoqueContainer.innerHTML = ''; // Limpa o container antes de renderizar

      // Filtra os pedidos
      const pedidosFiltrados = pedidos.filter(p =>
          p.codigo.toLowerCase().includes(filtro) ||
          p.produto.toLowerCase().includes(filtro) ||
          p.data.toLowerCase().includes(filtro) ||
          p.loja.toLowerCase().includes(filtro) ||
          p.gerente.toLowerCase().includes(filtro)
      );

      if (pedidosFiltrados.length === 0) {
          estoqueContainer.innerHTML = '<p>Nenhum pedido encontrado</p>';
          return;
      }

      pedidosFiltrados.slice().reverse().forEach(pedido => {
          const item = document.createElement("div");
          item.classList.add("item");

          // Verifica se o pedido tem quantidade zero para exibir "Esgotado" (se aplicável para pedidos)
          // Ajuste esta lógica se "esgotado" não for apropriado para pedidos
          const quantidadeZerada = parseInt(pedido.quantidade) <= 0;

          item.innerHTML = `
                <div class="item-main">
                    <div class="item-code">${pedido.codigo}</div>
                    <div class="item-sabor">${pedido.produto}</div>
                    ${quantidadeZerada ? '<span class="tag-esgotado">Zerado</span>' : ''}
                </div>
                <div class="actions">
                    <button class="icon-button" onclick="mostrarDetalhes(this.parentElement.parentElement)">
                        <img src="../dEstoque/imagens/info.png" alt="Informações" class="info-icon">
                    </button>
                </div>
                <div class="item-details">
                    <p><span class="detail-label">Sabor:</span> ${pedido.produto}</p>
                    <p><span class="detail-label">Quantidade:</span> ${pedido.quantidade}</p>
                    <p><span class="detail-label">Loja:</span> ${pedido.loja || pedido.endereco || 'N/A'}</p>
                    <p><span class="detail-label">Gerente:</span> ${pedido.gerente || 'Não definido'}</p>
                    <p><span class="detail-label">Data do Pedido:</span> ${pedido.data}</p>
                    </div>
            `;
          estoqueContainer.appendChild(item);
      });
  }

  window.mostrarDetalhes = mostrarDetalhes; // Torna a função global para o onclick no HTML

  window.logout = () => {
      if (confirm('Você irá deslogar, quer prosseguir?')) {
          window.location.href = '../aLogin/index.html';
      }
  };

  // Sidebar toggle (mantido como está no estoque)
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
  });
});