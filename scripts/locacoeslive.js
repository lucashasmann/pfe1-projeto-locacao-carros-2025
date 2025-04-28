// Carrega as locações do localStorage
const locacoesAtivas = JSON.parse(localStorage.getItem('acmeRentals')) || [];
const tabela = document.getElementById('tabelaLocacoesAtivas');

// Preenche a tabela com os dados
locacoesAtivas.forEach(locacao => {
  const row = document.createElement('tr');

  // Formata as datas para o formato brasileiro
  const dataInicio = new Date(locacao.startDate).toLocaleDateString('pt-BR');
  const dataFim = new Date(locacao.endDate).toLocaleDateString('pt-BR');

  row.innerHTML = `
    <td>${locacao.id}</td>
    <td>${locacao.carName}</td>
    <td>${locacao.carBrand}</td>
    <td>${locacao.clientName}</td>
    <td>${locacao.cpf}</td>
    <td>${dataInicio}</td>
    <td>${dataFim}</td>
    <td>
      <span class="status-badge ${locacao.status === 'active' ? 'pending' : 'completed'}">
        ${locacao.status === 'active' ? 'Em andamento' : 'Finalizada'}
      </span>
    </td>
    <td>
      <button class="btn-action danger" title="Excluir" onclick="excluirLocacaoAtiva('${locacao.id}')">
        <i class="fas fa-trash"></i>
      </button>
    </td>
  `;

  tabela.appendChild(row);
});

// Função para excluir uma locação ativa
function excluirLocacaoAtiva(id) {
  if (confirm('Tem certeza que deseja excluir esta locação?')) {
    const novasLocacoes = locacoesAtivas.filter(locacao => locacao.id !== id);
    localStorage.setItem('acmeRentals', JSON.stringify(novasLocacoes));
    window.location.reload();
  }
}
