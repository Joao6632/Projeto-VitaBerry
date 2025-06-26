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

// Corrigir o botão de criação do lote
document.querySelector(".create-lot-button").addEventListener("click", function (event) {
  event.preventDefault(); // Evita o recarregamento da página

  const sabor = document.getElementById("saborAcai").value;
  const validade = document.getElementById("dataValidade").value;
  const fabricacao = document.getElementById("dataFabricacao").value;
  const quantidade = document.getElementById("qtdBaldes").value;

  const lotes = JSON.parse(localStorage.getItem("lotes")) || [];

  // Gerar novo código
  const novoCodigo = `A${(lotes.length + 1).toString().padStart(2, "0")}`;

  const hoje = new Date();
  const entrada = hoje.toLocaleDateString("pt-BR");

  const novoLote = {
    codigo: novoCodigo,
    sabor,
    validade,
    fabricacao,
    entrada,
    quantidade,
  };

  lotes.push(novoLote);
  localStorage.setItem("lotes", JSON.stringify(lotes));

  alert("Lote criado com sucesso!"); 
  window.location.href = "../dEstoque/index.html";
});

document.addEventListener('DOMContentLoaded', () => {
  const hojeBR = new Date().toLocaleDateString('pt-BR'); // dd/mm/aaaa
  const fab    = document.getElementById('dataFabricacao');
  if (fab.value === '(automático)') fab.value = hojeBR;

  const entrada = document.getElementById('dataEntradaEstoque');
  if (entrada && entrada.value === '(automático)') entrada.value = hojeBR;
});

