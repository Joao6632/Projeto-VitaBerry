const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

function logout() {
  if (confirm("Você irá deslogar, quer prosseguir?")) {
    window.location.href = "../aLogin/index.html";
  }
}

// ------------------------
// CARREGAR LOTES NO ESTOQUE
// ------------------------
window.addEventListener("load", () => {
  const lotes = JSON.parse(localStorage.getItem("lotes")) || [];
  const container = document.getElementById("estoqueContainer");

  lotes
    .slice()
    .reverse()
    .forEach((lote, index) => {
      const item = document.createElement("div");
      item.classList.add("item");

      item.innerHTML = `
  <div class="item-main">
    <div class="item-code">${lote.codigo}</div>
    <div class="item-sabor">${lote.sabor}</div>
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
      <button>Iniciar distribuição</button>
      <button>Em distribuição</button>
    </div>
  </div>
`;

      container.appendChild(item);
    });
});

function mostrarDetalhes(itemElement) {
  itemElement.classList.toggle('expanded');
}
