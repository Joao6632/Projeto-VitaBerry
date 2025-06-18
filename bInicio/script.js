const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

function logout() {
  confirm('Você irá deslogar, quer prosseguir?')
  window.location.href = '../aLogin/index.html'
}

// —————— A PARTIR DESSA LINHA, INSIRA O CÓDIGO DO CARROSSEL ——————
window.addEventListener("load", () => {
  // Tenta carregar os lotes do localStorage. Se não houver, inicializa como array vazio.
  const lotesRaw = localStorage.getItem("lotes");
  console.log("Conteúdo bruto do localStorage 'lotes':", lotesRaw); // DEBUG

  let lotes = [];
  if (lotesRaw) {
      try {
          lotes = JSON.parse(lotesRaw);
          console.log("Lotes parseados do localStorage:", lotes); // DEBUG
      } catch (e) {
          console.error("Erro ao fazer parse dos lotes do localStorage:", e); // ERRO DEBUG
          slidesContainer.innerHTML = `
              <p style="text-align: center; margin-top: 20px; color: red;">
                  Erro ao carregar dados. Por favor, verifique o console para mais detalhes.
              </p>
          `;
          // Esconde os botões se houver erro
          document.querySelector("#chart-carousel .prev").style.display = "none";
          document.querySelector("#chart-carousel .next").style.display = "none";
          return; // Para a execução se houver erro de parse
      }
  } else {
      console.log("'lotes' não encontrado no localStorage ou está vazio."); // DEBUG
  }

  const slidesContainer = document.querySelector("#chart-carousel .slides");
  let current = 0; // Índice do slide atual

  // Limpa slides existentes para evitar duplicação em caso de recarga do script
  slidesContainer.innerHTML = ''; 

  // Verifica se há lotes para exibir. Se não houver, exibe a mensagem e para.
  if (lotes.length === 0) {
      console.log("Nenhum lote para exibir no carrossel. Exibindo mensagem de vazio."); // DEBUG
      slidesContainer.innerHTML = `
          <p style="text-align: center; margin-top: 20px; color: #777;">
              Nenhuma produção recente para exibir no carrossel.
              <br>Por favor, adicione alguns lotes para ver os gráficos.
          </p>
      `;
      // Esconde os botões de navegação se não houver gráficos
      document.querySelector("#chart-carousel .prev").style.display = "none";
      document.querySelector("#chart-carousel .next").style.display = "none";
      return; // Interrompe a execução se não houver lotes
  }

  console.log("Lotes encontrados! Criando slides do carrossel..."); // DEBUG
  // Itera sobre cada lote para criar um slide completo para ele
  lotes.forEach((lote, i) => {
      // Cria um contêiner (div) para todas as informações (gráficos) de um lote
      const loteSlide = document.createElement("div");
      loteSlide.classList.add("lote-slide"); // Adiciona uma classe para estilização CSS
      // Mostra o primeiro slide por padrão, oculta os outros
      loteSlide.style.display = i === 0 ? "block" : "none"; 

      // Adiciona um título para o slide do lote, para identificação
      const loteTitle = document.createElement("h3");
      // Usa lote.id se existir, senão usa o índice + 1. Adicione o sabor.
      loteTitle.textContent = `Detalhes do Lote ${lote.id || (i + 1)} - Sabor: ${lote.sabor || 'N/A'}`;
      loteTitle.style.marginBottom = '15px'; // Espaçamento abaixo do título do lote
      loteSlide.appendChild(loteTitle);

      // --- Gráfico de Quantidade do Sabor ---
      // Cria um canvas para o gráfico de sabor
      const canvasSabor = document.createElement("canvas");
      canvasSabor.id = `chart-sabor-${i}`; // ID único para o canvas
      loteSlide.appendChild(canvasSabor); // Anexa o canvas ao slide do lote

      // Configura e renderiza o gráfico de barras para a quantidade do sabor
      new Chart(canvasSabor.getContext("2d"), {
          type: "bar",
          data: {
              labels: ["Quantidade Produzida"],
              datasets: [{
                  label: `Lote ${lote.id || (i + 1)} - ${lote.sabor || 'Sabor Desconhecido'}`,
                  data: [Number(lote.quantidade) || 0], // Garante que é um número, default 0
                  backgroundColor: "rgba(75, 192, 192, 0.5)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1
              }]
          },
          options: { 
              responsive: true,
              maintainAspectRatio: false, // Permite que o gráfico se ajuste ao tamanho do contêiner
              plugins: {
                  title: {
                      display: true,
                      text: 'Produção por Sabor' // Título do gráfico individual
                  },
                  legend: {
                      display: false // Oculta a legenda para este gráfico simples
                  }
              },
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });

      // --- Exemplo de Gráfico de Perdas (se os dados de 'perdas' existirem no lote) ---
      // Adicione uma propriedade 'perdas' ao seu objeto lote no localStorage para testar
      if (lote.perdas !== undefined && lote.perdas !== null) {
          const canvasPerdas = document.createElement("canvas");
          canvasPerdas.id = `chart-perdas-${i}`;
          loteSlide.appendChild(canvasPerdas);

          const producaoLiquida = (Number(lote.quantidade) || 0) - (Number(lote.perdas) || 0);

          new Chart(canvasPerdas.getContext("2d"), {
              type: "pie", // Gráfico de pizza para perdas
              data: {
                  labels: ["Perdas", "Produção Líquida"],
                  datasets: [{
                      data: [Number(lote.perdas) || 0, producaoLiquida > 0 ? producaoLiquida : 0],
                      backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
                      borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
                      borderWidth: 1
                  }]
              },
              options: { 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      title: {
                          display: true,
                          text: 'Distribuição de Perdas'
                      }
                  }
              }
          });
      }

      // --- Exemplo de Gráfico de Distribuição (se os dados de 'distribuicao' existirem no lote) ---
      // Assume que 'lote.distribuicao' é um objeto como { "Loja A": 50, "Loja B": 30 }
      if (lote.distribuicao && typeof lote.distribuicao === 'object' && Object.keys(lote.distribuicao).length > 0) {
          const canvasDistribuicao = document.createElement("canvas");
          canvasDistribuicao.id = `chart-distribuicao-${i}`;
          loteSlide.appendChild(canvasDistribuicao);

          const labels = Object.keys(lote.distribuicao);
          const data = Object.values(lote.distribuicao).map(val => Number(val) || 0);

          new Chart(canvasDistribuicao.getContext("2d"), {
              type: "bar", // Ou 'doughnut', dependendo da visualização preferida
              data: {
                  labels: labels,
                  datasets: [{
                      label: `Distribuição do Lote ${lote.id || (i + 1)}`,
                      data: data,
                      backgroundColor: [
                          "rgba(255, 206, 86, 0.6)",
                          "rgba(153, 102, 255, 0.6)",
                          "rgba(255, 159, 64, 0.6)",
                          "rgba(0, 128, 0, 0.6)" // Exemplo de cores
                      ],
                      borderColor: [
                          "rgba(255, 206, 86, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                          "rgba(0, 128, 0, 1)"
                      ],
                      borderWidth: 1
                  }]
              },
              options: { 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                      title: {
                          display: true,
                          text: 'Distribuição por Ponto de Venda'
                      }
                  },
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
      }

      // Adiciona o slide completo do lote ao contêiner de slides do carrossel
      slidesContainer.appendChild(loteSlide);
  });

  // Função para mostrar o slide de lote correspondente ao índice
  function showSlide(idx) {
      document.querySelectorAll(".lote-slide").forEach((slide, i) => {
          slide.style.display = i === idx ? "block" : "none"; // Alterna a visibilidade
      });
  }

  // Adiciona event listeners para os botões de navegação "Próximo" e "Anterior"
  // Verifica se os botões existem antes de adicionar os event listeners
  const nextButton = document.querySelector("#chart-carousel .next");
  const prevButton = document.querySelector("#chart-carousel .prev");

  if (nextButton) {
      nextButton.onclick = () => {
          current = (current + 1) % lotes.length; // Avança para o próximo slide, voltando ao início se chegar ao fim
          showSlide(current);
      };
  }
  if (prevButton) {
      prevButton.onclick = () => {
          current = (current - 1 + lotes.length) % lotes.length; // Volta para o slide anterior, indo para o fim se estiver no início
          showSlide(current);
      };
  }
});
