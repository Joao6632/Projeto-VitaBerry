// Máscara de CPF
function aplicarMascaraCPF(input) {
  let valor = input.value.replace(/\D/g, '');
  if (valor.length > 11) valor = valor.slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = valor;
}

// Aplica máscara em tempo real
document.getElementById('cpfEmail').addEventListener('input', function () {
  aplicarMascaraCPF(this);
});

// Função principal de login
document.getElementById("login").addEventListener("submit", function (e) {
  e.preventDefault(); // Impede envio padrão

  const cpf = document.getElementById('cpfEmail').value.replace(/\D/g, '');
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  // Validações
  const cpfValido = /^\d{11}$/.test(cpf);
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!cpfValido) {
    alert('CPF inválido. Digite os 11 números corretamente.');
    return;
  }

  if (!emailValido) {
    alert('E-mail inválido. Verifique se está no formato correto.');
    return;
  }

  if (senha.length < 4) {
    alert('Senha muito curta. Mínimo 4 caracteres.');
    return;
  }

  // Verificação de usuário
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioLogado = usuarios.find(user =>
    user.email === email && user.senha === senha
  );

  if (usuarioLogado) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    window.location.href = "../bInicio/index.html"; // ou painel.html
  } else {
    alert("E-mail ou senha incorretos.");
  }
});