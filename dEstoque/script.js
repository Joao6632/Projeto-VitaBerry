const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});


function logout() {
    confirm('Você irá deslogar, quer prosseguir?')
    window.location.href = '../aLogin/index.html'
}

document.querySelectorAll('.icon-button').forEach(button => {
    button.addEventListener('click', function() {
      // Aqui você pode implementar a lógica para mostrar o popup
      // Por exemplo:
      const itemCode = this.closest('.item').querySelector('.item-code').textContent;
      alert(`Mostrando informações do item ${itemCode}`);
      // No futuro, substitua o alert por um modal/popup personalizado
    });
  });