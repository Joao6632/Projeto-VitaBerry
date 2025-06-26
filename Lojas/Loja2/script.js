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