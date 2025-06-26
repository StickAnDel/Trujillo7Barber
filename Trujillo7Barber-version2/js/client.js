document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'client') {
        window.location.href = 'login.html';
        return;
    }

    const nameElem = document.getElementById('client-name');
    if (nameElem) nameElem.textContent = user.name;

    loadServicesForReservation();
    loadClientReservations();

    const reservationForm = document.getElementById('new-reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleNewReservation);
    }

    const dateInput = document.getElementById('reservation-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('reservation-modal').style.display = 'none';
        });
    }

    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('reservation-modal').style.display = 'none';
        });
    }
});

function loadServicesForReservation() {
    const servicesContainer = document.getElementById('client-services-list');
    const services = database.services;

    servicesContainer.innerHTML = '';

    services.forEach(service => {
        const serviceOption = document.createElement('div');
        serviceOption.className = 'service-option';
        serviceOption.innerHTML = `
            <img src="${service.image}" alt="${service.name}">
            <h3>${service.name}</h3>
            <p class="price">S/${service.price}</p>
            <input type="radio" name="service" value="${service.id}" required>
        `;

        serviceOption.addEventListener('click', function () {
            document.querySelectorAll('.service-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
        });

        servicesContainer.appendChild(serviceOption);
    });
}

async function loadClientReservations() {
    const reservationsContainer = document.getElementById('client-reservations');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    try {
        const response = await fetch('http://localhost:5000/reservas', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user.username })
        });

        const reservations = await response.json();
        reservationsContainer.innerHTML = '';

        if (reservations.length === 0) {
            reservationsContainer.innerHTML = '<p>No tienes reservas activas.</p>';
            return;
        }

        reservations.forEach(res => {
            const item = document.createElement('div');
            item.className = 'reservation-item';
            item.innerHTML = `
                <h3>${res.serviceName}</h3>
                <p><strong>Fecha:</strong> ${res.date}</p>
                <p><strong>Hora:</strong> ${res.time}</p>
                <p><strong>Precio:</strong> S/${res.servicePrice}</p>
                <span class="reservation-status status-${res.status}">
                    ${res.status === 'pending' ? 'Pendiente' : res.status}
                </span>
            `;
            reservationsContainer.appendChild(item);
        });
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        reservationsContainer.innerHTML = '<p>Error al cargar tus reservas.</p>';
    }
}

async function handleNewReservation(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const date = document.getElementById('reservation-date').value;
    const time = document.getElementById('reservation-time').value;
    const serviceId = parseInt(document.querySelector('input[name="service"]:checked').value);

    const service = getServiceById(serviceId);

    if (!isValidTime(date, time)) {
        alert('Horario inválido. Revisa los horarios de atención.');
        return;
    }

    const newReservation = {
        username: user.username,
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price,
        serviceImage: service.image,
        date,
        time
    };

    try {
        const response = await fetch('http://localhost:5000/reservas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReservation)
        });

        const result = await response.json();

        if (response.ok) {
            showConfirmation('generada correctamente');
            loadClientReservations();
            e.target.reset();
            document.querySelectorAll('.service-option').forEach(opt => opt.classList.remove('selected'));
        } else {
            alert(result.message || 'Error al registrar la reserva');
        }
    } catch (err) {
        console.error('Error al enviar reserva:', err);
        alert('No se pudo registrar la reserva');
    }
}

function isValidTime(dateString, timeString) {
    const date = new Date(`${dateString}T${timeString}`);
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeMinutes = hours * 60 + minutes;

    if (day === 0 || day === 6) {
        return timeMinutes >= 750 && timeMinutes <= 960; // 12:30 - 16:00
    } else {
        return timeMinutes >= 630 && timeMinutes <= 1140; // 10:30 - 19:00
    }
}

function getServiceById(id) {
    return database.services.find(s => s.id === id);
}

function showConfirmation(msg) {
    const modal = document.getElementById('reservation-modal');
    const message = document.getElementById('reservation-confirmation-message');
    message.textContent = `¡Listo! Tu reserva fue ${msg}. Te esperamos en la barbería.`;
    modal.style.display = 'block';
}
