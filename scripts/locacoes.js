
let selectedCar = null;


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


function closeModal() {
  document.getElementById('carModal').style.display = 'none';
}

function openReservationModal() {
  if (!selectedCar) return;
  
  document.getElementById('reservationCarName').textContent = selectedCar.name;
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('startDate').min = today;
  
  closeModal();
  document.getElementById('reservationModal').style.display = 'block';
}

function closeReservationModal() {
  document.getElementById('reservationModal').style.display = 'none';
}


document.getElementById('cpf').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  
  if (value.length > 3) value = value.replace(/^(\d{3})(\d)/g, '$1.$2');
  if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3');
  if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, '$1.$2.$3-$4');
  if (value.length > 14) value = value.substring(0, 14);
  
  e.target.value = value;
});


document.getElementById('startDate').addEventListener('change', function() {
  const startDate = this.value;
  const endDateInput = document.getElementById('endDate');
  endDateInput.min = startDate;
  
  if (endDateInput.value && endDateInput.value < startDate) {
    endDateInput.value = '';
  }
});


document.getElementById('rentalForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

 
  if (!name || !cpf || !startDate || !endDate) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if (new Date(endDate) <= new Date(startDate)) {
    alert('A data de devolução deve ser posterior à data de início.');
    return;
  }

  let rentals = JSON.parse(localStorage.getItem('acmeRentals')) || [];


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


  rentals.push(newRental);

  try {

    localStorage.setItem('acmeRentals', JSON.stringify(rentals));
    
    alert('Reserva confirmada! Redirecionando para suas locações...');
    window.location.href = '/pfe1-projeto-locacao-carros-2025/pages/locacoeslive.html';
    
    
  } catch (e) {
    console.error('Erro ao salvar:', e);
    alert('Erro ao salvar a reserva. Por favor, tente novamente.');
  }
});


window.onclick = function(event) {
  if (event.target === document.getElementById('carModal')) {
    closeModal();
  }
  if (event.target === document.getElementById('reservationModal')) {
    closeReservationModal();
  }
};