// Funcionalidades del cliente
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación y rol
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'client') {
        window.location.href = 'login.html';
        return;
    }
    
    // Mostrar nombre del cliente
    if (document.getElementById('client-name')) {
        document.getElementById('client-name').textContent = user.name;
    }
    
    // Cargar servicios para reserva
    loadServicesForReservation();
    
    // Cargar reservas del cliente
    loadClientReservations();
    
    // Manejar formulario de nueva reserva
    const reservationForm = document.getElementById('new-reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleNewReservation);
    }
    
    // Configurar fecha mínima (hoy) en el input de fecha
    const dateInput = document.getElementById('reservation-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Manejar cierre del modal
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('reservation-modal').style.display = 'none';
        });
    }
    
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('reservation-modal').style.display = 'none';
        });
    }
});

function loadServicesForReservation() {
    const servicesContainer = document.getElementById('client-services-list');
    const services = db.getServices();
    
    servicesContainer.innerHTML = '';
    
    services.forEach(service => {
        const serviceOption = document.createElement('div');
        serviceOption.className = 'service-option';
        serviceOption.innerHTML = `
            <img src="${service.image}" alt="${service.name}">
            <h3>${service.name}</h3>
            <p class="price">$${service.price}</p>
            <input type="radio" name="service" value="${service.id}" required>
        `;
        
        serviceOption.addEventListener('click', function() {
            // Seleccionar este servicio
            document.querySelectorAll('.service-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });
        
        servicesContainer.appendChild(serviceOption);
    });
}

function loadClientReservations() {
    const reservationsContainer = document.getElementById('client-reservations');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const reservations = db.getReservationsByUser(user.id);
    
    reservationsContainer.innerHTML = '';
    
    if (reservations.length === 0) {
        reservationsContainer.innerHTML = '<p>No tienes reservas activas.</p>';
        return;
    }
    
    reservations.forEach(reservation => {
        const service = db.getServices().find(s => s.id === reservation.serviceId);
        
        const reservationItem = document.createElement('div');
        reservationItem.className = 'reservation-item';
        reservationItem.innerHTML = `
            <h3>${service.name}</h3>
            <p><strong>Fecha:</strong> ${reservation.date}</p>
            <p><strong>Hora:</strong> ${reservation.time}</p>
            <p><strong>Precio:</strong> $${service.price}</p>
            <span class="reservation-status status-${reservation.status}">
                ${reservation.status === 'pending' ? 'Pendiente' : 
                 reservation.status === 'completed' ? 'Completado' : 'Atrasado'}
            </span>
            ${reservation.status === 'late' && reservation.adminComment ? 
                `<div class="admin-comment">${reservation.adminComment}</div>` : ''}
        `;
        
        reservationsContainer.appendChild(reservationItem);
    });
}

function handleNewReservation(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const date = document.getElementById('reservation-date').value;
    const time = document.getElementById('reservation-time').value;
    const serviceId = parseInt(document.querySelector('input[name="service"]:checked').value);
    
    // Validar horario
    if (!isValidTime(date, time)) {
        alert('Lo sentimos, no hay atención disponible a esa hora. Por favor, elige otro horario disponible.');
        return;
    }
    
    const service = db.getServices().find(s => s.id === serviceId);
    
    // Crear nueva reserva
    const newReservation = {
        userId: user.id,
        userEmail: user.email,
        serviceId,
        date,
        time,
        serviceName: service.name,
        servicePrice: service.price,
        serviceImage: service.image
    };
    
    const reservation = db.addReservation(newReservation);
    
    // Mostrar mensaje de confirmación
    showConfirmation(reservation.id);
    
    // Recargar las reservas del cliente
    loadClientReservations();
    
    // Limpiar el formulario
    e.target.reset();
    document.querySelectorAll('.service-option').forEach(opt => {
        opt.classList.remove('selected');
    });
}

function isValidTime(dateString, timeString) {
    const date = new Date(`${dateString}T${timeString}`);
    const dayOfWeek = date.getDay(); // 0 (Domingo) a 6 (Sábado)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Verificar si es fin de semana o feriado (simplificado, en realidad debería verificar feriados)
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
        // Horario de fin de semana: 12:30 PM - 4:00 PM
        const startTime = 12 * 60 + 30; // 12:30 en minutos
        const endTime = 16 * 60; // 16:00 en minutos
        
        const reservationTime = hours * 60 + minutes;
        
        return reservationTime >= startTime && reservationTime <= endTime;
    } else {
        // Horario de semana: 10:30 AM - 7:00 PM
        const startTime = 10 * 60 + 30; // 10:30 en minutos
        const endTime = 19 * 60; // 19:00 en minutos
        
        const reservationTime = hours * 60 + minutes;
        
        return reservationTime >= startTime && reservationTime <= endTime;
    }
}

function showConfirmation(reservationId) {
    const modal = document.getElementById('reservation-modal');
    const message = document.getElementById('reservation-confirmation-message');
    
    message.textContent = `¡Listo! Te esperamos en la barbería. Tu número de orden es: ${reservationId}`;
    modal.style.display = 'block';
}