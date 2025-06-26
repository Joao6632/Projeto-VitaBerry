function aplicarMascaraCPF(input) {
  let valor = input.value.replace(/\D/g, '');
  if (valor.length > 11) valor = valor.slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = valor;
}

// Aplica máscara ao digitar
document.getElementById('cpf').addEventListener('input', function () {
  aplicarMascaraCPF(this);
});

// Captura o envio do formulário de cadastro
const form = document.getElementById('login'); // pode renomear pra 'form-cadastro' se quiser
form.addEventListener('submit', function (e) {
  e.preventDefault(); // impede o envio padrão

  const nome = document.getElementById('nome').value.trim();
  const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
  const email = document.getElementById('email').value.trim().toLowerCase();
  const senha = document.getElementById('senha').value.trim();
  const funcao = document.getElementById('funcao').value;

  // Validações
  const cpfValido = /^\d{11}$/.test(cpf);
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!nome || !cpf || !email || !senha || !funcao) {
    alert("Preencha todos os campos.");
    return;
  }

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

  // Verifica se já existe usuário com mesmo e-mail ou CPF
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const jaExiste = usuarios.some(u => u.email === email || u.cpf === cpf);

  if (jaExiste) {
    alert("Já existe um usuário com esse e-mail ou CPF.");
    return;
  }

  // Cria e salva o novo usuário
  const novoUsuario = {
    nome,
    cpf,
    email,
    senha,
    cargo: funcao
  };

  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Usuário cadastrado com sucesso!");
  form.reset(); // limpa os campos
});
