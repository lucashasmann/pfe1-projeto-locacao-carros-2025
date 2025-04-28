// Variável para armazenar o carro selecionado
let selectedCar = null;

// Função para abrir o modal de detalhes do carro
function openModal(name, brand, year, color, mileage, price, fuel, transmission, seats, imageUrl) {
  selectedCar = {
    name, brand, year, color, mileage, price, fuel, transmission, seats, imageUrl
  };

  document.getElementById('modalCarName').textContent = name;
  document.getElementById('modalCarBrand').textContent = brand;
  document.getElementById('modalCarYear').textContent = year;
  document.getElementById('modalCarColor').textContent = color;
  document.getElementById('modalCarMileage').textContent = mileage;
  document.getElementById('modalCarPrice').textContent = price;
  document.getElementById('modalCarFuel').textContent = fuel;
  document.getElementById('modalCarTransmission').textContent = transmission;
  document.getElementById('modalCarSeats').textContent = seats;

  const carImage = document.querySelector('#carModal .modal-car-image');
  carImage.style.backgroundImage = `url('${imageUrl}')`;
  document.getElementById('carModal').style.display = 'block';
}

// Função para fechar o modal de detalhes
function closeModal() {
  document.getElementById('carModal').style.display = 'none';
}

// Função para abrir o modal de reserva
function openReservationModal() {
  if (!selectedCar) return;
  
  document.getElementById('reservationCarName').textContent = selectedCar.name;
  
  // Setar a data mínima para hoje
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').min = today;
  
  closeModal();
  document.getElementById('reservationModal').style.display = 'block';
}

// Função para fechar o modal de reserva
function closeReservationModal() {
  document.getElementById('reservationModal').style.display = 'none';
}

// Máscara para CPF
document.getElementById('cpf').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  
  if (value.length > 3) value = value.replace(/^(\d{3})(\d)/g, '$1.$2');
  if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3');
  if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3-$4');
  if (value.length > 14) value = value.substring(0, 14);
  
  e.target.value = value;
});

// Atualizar data mínima da devolução quando a data de início muda
document.getElementById('startDate').addEventListener('change', function() {
  const startDate = this.value;
  const endDateInput = document.getElementById('endDate');
  endDateInput.min = startDate;
  
  if (endDateInput.value && endDateInput.value < startDate) {
    endDateInput.value = '';
  }
});

// ÚNICO evento de submit do formulário
document.getElementById('rentalForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // Validações
  if (!name || !cpf || !startDate || !endDate) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if (new Date(endDate) <= new Date(startDate)) {
    alert('A data de devolução deve ser posterior à data de início.');
    return;
  }

  // Obter locações existentes
  let rentals = JSON.parse(localStorage.getItem('acmeRentals')) || [];

  // Criar nova locação
  const newRental = {
    id: Date.now().toString(),
    carName: selectedCar.name,
    carBrand: selectedCar.brand,
    carImage: selectedCar.imageUrl,
    clientName: name,
    cpf: cpf,
    startDate: startDate,
    endDate: endDate,
    dailyPrice: selectedCar.price.replace('$', ''),
    status: 'active',
    createdAt: new Date().toISOString()
  };

  // Adicionar nova locação
  rentals.push(newRental);

  try {
    // Salvar no localStorage
    localStorage.setItem('acmeRentals', JSON.stringify(rentals));
    
    alert('Reserva confirmada! Redirecionando para suas locações...');
    window.location.href = '/pages/locacoeslive.html';
    
    
  } catch (e) {
    console.error('Erro ao salvar:', e);
    alert('Erro ao salvar a reserva. Por favor, tente novamente.');
  }
});

// Fechar modais ao clicar fora do conteúdo
window.onclick = function(event) {
  if (event.target === document.getElementById('carModal')) {
    closeModal();
  }
  if (event.target === document.getElementById('reservationModal')) {
    closeReservationModal();
  }
};