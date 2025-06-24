

function aplicarMascaraCPF(input) {
    let valor = input.value.replace(/\D/g, ''); // tira tudo que não é número
  
    if (valor.length > 11) valor = valor.slice(0, 11); // limita a 11 dígitos
  
    // aplica a máscara
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  
    input.value = valor;
  }
  
 // VERIFCAÇÂO
  const form = document.getElementById('login');
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // cancela envio padrão


    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
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
  document.getElementById('cpf').addEventListener('input', function () {
    aplicarMascaraCPF(this);
  });
  
  //MOSTRAR NOME DO USUARIO
  function salvarUsuario() {
  const novoUSuario = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    cargo: document.getElementById('cargo').value
};
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
usuarios.push(novoUsuario);
localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

/*PRECISA ARRUMAR ESSE COISO DE MOSTAR  O NOOME DO USUARIO, O SCRIPT
 TA DIVIDIDO EM MUITAS PAGINAS, MAS ATÈ AGORA Só TEM NO LOGIN E CADASTRO*/