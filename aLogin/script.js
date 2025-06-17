function aplicarMascaraCPF(input) {
    let valor = input.value.replace(/\D/g, ''); // tira tudo que não é número
  
    if (valor.length > 11) valor = valor.slice(0, 11); // limita a 11 dígitos
  
    // aplica a máscara
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  
    input.value = valor;
  }
  
  const form = document.getElementById('login');
  
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // cancela envio padrão
  
    const cpf = document.getElementById('cpfEmail').value.replace(/\D/g, '');
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
  
    const cpfValido = /^\d{11}$/.test(cpf);
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    if (!cpfValido) {
      alert('CPF inválido. Digite os 11 números corretamente.');
      return;
    }
  
    if (!emailValido) {
      alert('E-mail inválido. Verifique se está no formato correto (ex: nome@email.com).');
      return;
    }
  
    if (senha.length < 4) {
      alert('Senha muito curta. Mínimo 4 caracteres.');
      return;
    }
  
    // Tudo ok!
    window.location.href = "../bInicio/index.html";
  });
  
  // Pra aplicar a máscara enquanto digita
  document.getElementById('cpfEmail').addEventListener('input', function () {
    aplicarMascaraCPF(this);
  });
  