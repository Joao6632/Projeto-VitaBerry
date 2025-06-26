const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

// Variáveis globais
let loteAtualSelecionado = null;
let lojaSelecionadaGlobal = null;

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

// Modais
const quantidadeModal = document.getElementById('quantidadeModal');

// Mostrar modal de escolha da loja
function mostrarModal(codigoLote) {
  loteAtualSelecionado = codigoLote;
  document.getElementById('lojaModal').style.display = 'block';
}

function fecharModal() {
  document.getElementById('lojaModal').style.display = 'none';
}

function mostrarModalConfirmacao(loja) {
  const modal = document.getElementById('confirmacaoModal');
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  document.getElementById('confirmacaoText').innerHTML = `
    <p>Distribuído para ${loja} em</p>
    <p>${dataAtual}</p>
  `;

  modal.style.display = 'block';

  setTimeout(() => {
    modal.style.display = 'none';
  }, 3000);
}

function fecharModalConfirmacao() {
  document.getElementById('confirmacaoModal').style.display = 'none';
}

function mostrarDetalhes(itemElement) {
  itemElement.classList.toggle('expanded');
}

function logout() {
  if (confirm("Você irá deslogar, quer prosseguir?")) {
    window.location.href = "../aLogin/index.html";
  }
}

// === MODAL QUANTIDADE ===
function abrirModalQuantidade() {
  document.getElementById('inputQuantidade').value = '';
  quantidadeModal.style.display = 'block';
}

function fecharModalQuantidade() {
  quantidadeModal.style.display = 'none';
}

function confirmarDistribuicao() {
  const qtd = parseInt(document.getElementById('inputQuantidade').value);
  if (isNaN(qtd) || qtd <= 0) {
    alert("Quantidade inválida!");
    return;
  }

  const lotes = JSON.parse(localStorage.getItem("lotes")) || [];
  const loteIndex = lotes.findIndex(l => l.codigo === loteAtualSelecionado);

  if (loteIndex === -1) return alert("Lote não encontrado!");

  if (qtd > lotes[loteIndex].quantidade) {
    alert("Quantidade maior que o estoque disponível!");
    return;
  }

  const dataDistribuicao = new Date().toLocaleDateString('pt-BR');

  lotes[loteIndex].quantidade -= qtd;
  lotes[loteIndex].status = 'em_distribuicao';

  if (!lotes[loteIndex].historico) {
    lotes[loteIndex].historico = [];
  }

  lotes[loteIndex].historico.push({
    loja: lojaSelecionadaGlobal,
    quantidade: qtd,
    data: dataDistribuicao
  });

  localStorage.setItem("lotes", JSON.stringify(lotes));

  fecharModalQuantidade();
  mostrarModalConfirmacao(lojaSelecionadaGlobal);
  carregarLotes();
}

// === CARREGAR LOTES ===
function carregarLotes() {
  const lotes = JSON.parse(localStorage.getItem("lotes")) || [];
  const container = document.getElementById("estoqueContainer");
  container.innerHTML = '';

  lotes.slice().reverse().forEach((lote) => {
    const item = document.createElement("div");
    item.classList.add("item");
    const quantidadeZerada = lote.quantidade <= 0;

    item.innerHTML = `
      <div class="item-main">
        <div class="item-code">${lote.codigo}</div>
        <div class="item-sabor">${lote.sabor}</div>
        ${quantidadeZerada ? '<span class="tag-esgotado">Esgotado</span>' : ''}
      </div>
      <div class="actions">
        <button class="icon-button" onclick="mostrarDetalhes(this.parentElement.parentElement)">
          <img src="imagens/info.png" alt="Informações" class="info-icon">
        </button>
      </div>
      <div class="item-details">
        <p><span class="detail-label">Sabor:</span> ${lote.sabor}</p>
        <p><span class="detail-label">Data de fabricação:</span> ${lote.fabricacao}</p>
        <p><span class="detail-label">Data de validade:</span> ${lote.validade}</p>
        <p><span class="detail-label">Entrada no estoque:</span> ${lote.entrada}</p>
        <p><span class="detail-label">Quantidade de baldes:</span> ${lote.quantidade}</p>
        <div class="acoes-detalhes">
          <button class="btn-iniciar-distribuicao"
            onclick="${!quantidadeZerada ? `mostrarModal('${lote.codigo}')` : ''}"
            ${quantidadeZerada ? 'disabled' : ''}>
            Iniciar distribuição
          </button>
          <button class="btn-em-distribuicao ${lote.status === 'em_distribuicao' ? 'ativo' : ''}"
            ${(lote.status === 'em_distribuicao' && lote.historico?.length && !quantidadeZerada) ? 
              `onclick="mostrarHistoricoCompleto('${lote.codigo}')"` : ''}
            ${quantidadeZerada ? 'disabled' : ''}>
            ${lote.status === 'em_distribuicao' ? 'Em distribuição' : 'Não distribuído'}
          </button>
        </div>
        ${lote.historico && lote.historico.length > 0 ? `
          <div class="historico-distribuicao">
            <strong>Histórico de distribuição:</strong>
            <div class="historico-tabela">
              <div class="historico-cabecalho">
                <span>Data</span>
                <span>Loja</span>
                <span>Quantidade</span>
              </div>
              ${lote.historico.slice().reverse().map(entry => `
                <div class="historico-linha">
                  <span>${entry.data}</span>
                  <span>${entry.loja}</span>
                  <span>${entry.quantidade} baldes</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    container.appendChild(item);
  });
}

// Nova função para mostrar histórico completo em um modal
function mostrarHistoricoCompleto(codigoLote) {
  const lotes = JSON.parse(localStorage.getItem("lotes")) || [];
  const lote = lotes.find(l => l.codigo === codigoLote);
  
  if (!lote || !lote.historico?.length) return;

  const modal = document.createElement("div");
  modal.className = "modal-historico";
  modal.innerHTML = `
    <div class="modal-historico-conteudo">
      <h3>Histórico completo de distribuição</h3>
      <p><strong>Lote:</strong> ${lote.codigo} - ${lote.sabor}</p>
      <div class="historico-tabela-modal">
        <div class="historico-cabecalho">
          <span>Data</span>
          <span>Loja</span>
          <span>Quantidade</span>
        </div>
        ${lote.historico.slice().reverse().map(entry => `
          <div class="historico-linha">
            <span>${entry.data}</span>
            <span>${entry.loja}</span>
            <span>${entry.quantidade} baldes</span>
          </div>
        `).join('')}
      </div>
      <button class="btn-fechar-historico" onclick="this.parentElement.parentElement.remove()">Fechar</button>
    </div>
  `;

  document.body.appendChild(modal);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  document.querySelectorAll('.close-modal')?.forEach(btn => {
    btn.addEventListener('click', () => {
      fecharModal();
      fecharModalConfirmacao();
      fecharModalQuantidade();
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target == document.getElementById('lojaModal')) fecharModal();
    if (event.target == document.getElementById('confirmacaoModal')) fecharModalConfirmacao();
    if (event.target == quantidadeModal) fecharModalQuantidade();
  });

  document.querySelectorAll('.loja-option').forEach(option => {
    option.addEventListener('click', function () {
      if (!loteAtualSelecionado) return;
      lojaSelecionadaGlobal = this.textContent;
      fecharModal();
      abrirModalQuantidade();
    });
  });

  carregarLotes();
});

const filtroInput = document.querySelector('.filter-box input');
const estoqueContainer = document.getElementById('estoqueContainer');

filtroInput.addEventListener('input', e => {
  const termo = e.target.value.toUpperCase();
  const items = estoqueContainer.querySelectorAll('.item');

  items.forEach(item => {
    const texto = item.textContent.toUpperCase();
    // Se bate, exibe como flex (ou grid), senão some
    item.style.display = texto.includes(termo) ? 'flex' : 'none';
  });
});

