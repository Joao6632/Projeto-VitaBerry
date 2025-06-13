const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});


function logout() {
    confirm('Você irá deslogar, quer prosseguir?')
    window.location.href = '../aLogin/index.html'
}