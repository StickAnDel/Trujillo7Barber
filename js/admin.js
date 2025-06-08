// Funcionalidades del administrador
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación y rol
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Cargar reservas activas
    loadActiveReservations();
    
    // Cargar servicios existentes
    loadServicesForAdmin();
    
    // Manejar formulario para agregar nuevo servicio
    const addServiceForm = document.getElementById('add-service-form');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', handleAddService);
    }
});

function loadActiveReservations() {
    const reservationsContainer = document.getElementById('active-reservations');
    const reservations = db.getAllReservations().filter(r => r.status === 'pending' || r.status === 'late');
    
    reservationsContainer.innerHTML = '';
    
    if (reservations.length === 0) {
        reservationsContainer.innerHTML = '<p>No hay reservas activas en este momento.</p>';
        return;
    }
    
    reservations.forEach(reservation => {
        const user = db.findUserByEmail(reservation.userEmail);
        const service = db.getServices().find(s => s.id === reservation.serviceId);
        
        const reservationCard = document.createElement('div');
        reservationCard.className = 'reservation-card';
        reservationCard.innerHTML = `
            <div class="reservation-info">
                <h3>${user.name}</h3>
                <p><strong>Fecha:</strong> ${reservation.date}</p>
                <p><strong>Hora:</strong> ${reservation.time}</p>
                <p><strong>Servicio:</strong> ${service.name} (S/${service.price})</p>
                ${reservation.status === 'late' && reservation.adminComment ? 
                    `<p class="admin-comment"><strong>Comentario:</strong> ${reservation.adminComment}</p>` : ''}
                <span class="status-${reservation.status}">
                    ${reservation.status === 'pending' ? 'Pendiente' : 
                     reservation.status === 'completed' ? 'Completado' : 'Atrasado'}
                </span>
            </div>
            <div class="reservation-actions">
                <button class="btn complete-btn" data-id="${reservation.id}">Completado</button>
                <button class="btn late-btn" data-id="${reservation.id}">Atrasado</button>
            </div>
        `;
        
        reservationsContainer.appendChild(reservationCard);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reservationId = parseInt(this.getAttribute('data-id'));
            db.updateReservationStatus(reservationId, 'completed');
            loadActiveReservations();
        });
    });
    
    document.querySelectorAll('.late-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reservationId = parseInt(this.getAttribute('data-id'));
            const comment = prompt('Ingrese un comentario para el cliente:');
            if (comment !== null) {
                db.updateReservationStatus(reservationId, 'late', comment);
                loadActiveReservations();
            }
        });
    });
}

function loadServicesForAdmin() {
    const servicesContainer = document.getElementById('admin-services-list');
    const services = db.getServices();
    
    servicesContainer.innerHTML = '';
    
    services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.innerHTML = `
            <img src="${service.image}" alt="${service.name}">
            <div>
                <h3>${service.name}</h3>
                <p>$${service.price}</p>
            </div>
            <div class="service-item-actions">
                <button class="btn edit-btn" data-id="${service.id}">Editar</button>
                <button class="btn delete-btn" data-id="${service.id}">Eliminar</button>
            </div>
        `;
        
        servicesContainer.appendChild(serviceItem);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = parseInt(this.getAttribute('data-id'));
            editService(serviceId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = parseInt(this.getAttribute('data-id'));
            if (confirm('¿Está seguro de que desea eliminar este servicio?')) {
                db.deleteService(serviceId);
                loadServicesForAdmin();
            }
        });
    });
}

function editService(serviceId) {
    const service = db.getServices().find(s => s.id === serviceId);
    if (!service) return;
    
    const newName = prompt('Nuevo nombre del servicio:', service.name);
    if (newName === null) return;
    
    const newPrice = prompt('Nuevo precio del servicio:', service.price);
    if (newPrice === null) return;
    
    const newImage = prompt('Nueva URL de la imagen:', service.image);
    if (newImage === null) return;
    
    const updatedService = {
        name: newName,
        price: parseFloat(newPrice),
        image: newImage
    };
    
    db.updateService(serviceId, updatedService);
    loadServicesForAdmin();
}

function handleAddService(e) {
    e.preventDefault();
    
    const name = document.getElementById('service-name').value;
    const price = parseFloat(document.getElementById('service-price').value);
    const image = document.getElementById('service-image').value;
    
    if (!name || isNaN(price) || !image) {
        alert('Por favor complete todos los campos correctamente');
        return;
    }
    
    const newService = {
        name,
        price,
        image
    };
    
    db.addService(newService);
    document.getElementById('add-service-form').reset();
    loadServicesForAdmin();
    
    alert('Servicio agregado exitosamente');
}