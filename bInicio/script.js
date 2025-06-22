const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

// Função para alternar a sidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// Função de logout
function logout() {
  if (confirm('Você irá deslogar, quer prosseguir?')) {
    window.location.href = '../aLogin/index.html';
  }
}

// —————— GRÁFICO DE ESTOQUE TOTAL ——————
document.addEventListener("DOMContentLoaded", () => {
  // Verifica se o elemento do gráfico existe na página
  const chartElement = document.getElementById('estoqueTotalChart');
  if (!chartElement) return;

  // Obtém os dados do localStorage
  const lotesRaw = localStorage.getItem("lotes");
  let lotes = [];
  
  try {
    lotes = lotesRaw ? JSON.parse(lotesRaw) : [];
  } catch (e) {
    console.error("Erro ao fazer parse dos lotes:", e);
    showErrorMessage("Erro ao carregar dados do estoque");
    return;
  }

  // Calcula o estoque total por sabor
  const estoquePorSabor = calcularEstoquePorSabor(lotes);
  
  // Cria ou atualiza o gráfico
  if (estoquePorSabor.size > 0) {
    criarGraficoEstoque(estoquePorSabor);
  } else {
    showNoDataMessage();
  }
});

// Função para calcular o estoque por sabor
function calcularEstoquePorSabor(lotes) {
  const saboresMap = new Map();
  
  lotes.forEach(lote => {
    const quantidade = Number(lote.quantidade) || 0;
    if (quantidade > 0) {
      const sabor = lote.sabor || 'Desconhecido';
      const totalAtual = saboresMap.get(sabor) || 0;
      saboresMap.set(sabor, totalAtual + quantidade);
    }
  });
  
  return saboresMap;
}

// Função para criar o gráfico de estoque
function criarGraficoEstoque(estoquePorSabor) {
  const ctx = document.getElementById('estoqueTotalChart').getContext('2d');
  
  // Destrói o gráfico anterior se existir
  if (window.estoqueChart) {
    window.estoqueChart.destroy();
  }
  
  window.estoqueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from(estoquePorSabor.keys()),
      datasets: [{
        label: 'Baldes em Estoque',
        data: Array.from(estoquePorSabor.values()),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: false 
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.parsed.y} baldes`;
            },
            afterLabel: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentual = ((context.parsed.y / total) * 100).toFixed(1);
              return ` (${percentual}% do total)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { 
            display: true, 
            text: 'Quantidade de Baldes',
            font: {
              weight: 'bold'
            }
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          title: {
            display: true,
            text: 'Sabores',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    }
  });
}

// Função para mostrar mensagem quando não há dados
function showNoDataMessage() {
  const container = document.querySelector('.estoque-chart-box');
  if (container) {
    container.innerHTML = `
      <div class="no-data-message">
        <p>Nenhum balde em estoque no momento</p>
        <small>Adicione lotes na página de Fabricação</small>
      </div>`;
  }
}

// Função para mostrar mensagem de erro
function showErrorMessage(message) {
  const container = document.querySelector('.estoque-chart-box');
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
        <small>Verifique o console para detalhes</small>
      </div>`;
  }
}