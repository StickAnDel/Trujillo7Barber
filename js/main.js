// Funcionalidades comunes
document.addEventListener('DOMContentLoaded', function() {
    // Cargar servicios en la página principal
    if (document.getElementById('services-container')) {
        loadServices();
    }
});

function loadServices() {
    const servicesContainer = document.getElementById('services-container');
    const services = db.getServices();
    
    servicesContainer.innerHTML = '';
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <img src="${service.image}" alt="${service.name}">
            <div class="service-info">
                <h3>${service.name}</h3>
                <p class="price">$${service.price}</p>
            </div>
        `;
        servicesContainer.appendChild(serviceCard);
    });
}