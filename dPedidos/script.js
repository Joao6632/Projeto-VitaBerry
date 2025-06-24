document.addEventListener('DOMContentLoaded', () => {
    const estoqueContainer = document.getElementById('estoqueContainer');
    const filterInput = document.querySelector('.filter-box input');
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  
    init();
  
    function init() {
      renderPedidos();
      filterInput.addEventListener('input', renderPedidos);
  
      estoqueContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.info-btn');
        if (!btn) return;
  
        const codigo = btn.dataset.codigo;
        const pedido = pedidos.find(p => p.codigo === codigo);
        if (!pedido) return;
  
        const itemDiv = btn.closest('.item');
        let detalhesDiv = itemDiv.querySelector('.detalhes-expandido');
  
        if (detalhesDiv) {
          detalhesDiv.remove(); // fecha
        } else {
          detalhesDiv = document.createElement('div');
          detalhesDiv.className = 'detalhes-expandido';
          detalhesDiv.style.borderTop = '1px solid #ccc';
          detalhesDiv.style.marginTop = '10px';
          detalhesDiv.style.paddingTop = '10px';
          detalhesDiv.style.fontSize = '14px';
  
          detalhesDiv.innerHTML = `
            <p><strong>Sabor:</strong> ${pedido.produto}</p>
            <p><strong>Quantidade:</strong> ${pedido.quantidade}</p>
            <p><strong>Loja:</strong> ${pedido.loja || pedido.endereco}</p>
            <p><strong>Gerente:</strong> ${pedido.gerente}</p>
            <p><strong>Data do Pedido:</strong> ${pedido.data}</p>
          `;
  
          itemDiv.appendChild(detalhesDiv);
        }
      });
    }
  
    function renderPedidos() {
      const filtro = filterInput.value.toLowerCase();
  
      const pedidosFiltrados = pedidos.filter(p =>
        p.codigo.toLowerCase().includes(filtro) ||
        p.produto.toLowerCase().includes(filtro) ||
        p.data.toLowerCase().includes(filtro)
      );
  
      estoqueContainer.innerHTML = '';
  
      if (pedidosFiltrados.length === 0) {
        estoqueContainer.innerHTML = '<p>Nenhum pedido encontrado</p>';
        return;
      }
  
      pedidosFiltrados.forEach(pedido =>
        estoqueContainer.appendChild(createPedidoElement(pedido))
      );
    }
  
    function createPedidoElement(pedido) {
      const item = document.createElement('div');
      item.className = 'item';
      item.style.position = 'relative';
      item.style.border = '2px solid black';
      item.style.borderRadius = '10px';
      item.style.padding = '15px';
      item.style.marginBottom = '20px';
      item.style.backgroundColor = '#fdfdfd';
  
      // Info principal
      const titulo = document.createElement('div');
      titulo.style.fontWeight = 'bold';
      titulo.style.fontSize = '18px';
      titulo.textContent = pedido.codigo;
  
      const subtitulo = document.createElement('div');
      subtitulo.style.fontSize = '15px';
      subtitulo.textContent = pedido.produto;
  
      // Botão info
      const btn = document.createElement('button');
      btn.className = 'info-btn';
      btn.dataset.codigo = pedido.codigo;
      btn.title = 'Mais informações';
      btn.textContent = 'i';
      btn.style.cssText = `
        position: absolute;
        top: 12px;
        right: 12px;
        cursor: pointer;
        background: #fff;
        border: 2px solid black;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        font-weight: bold;
        font-size: 16px;
        line-height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      `;
  
      item.appendChild(titulo);
      item.appendChild(subtitulo);
      item.appendChild(btn);
  
      return item;
    }
  
    window.logout = () => {
      if (confirm('Você irá deslogar, quer prosseguir?')) {
        window.location.href = '../aLogin/index.html';
      }
    };
  });
  