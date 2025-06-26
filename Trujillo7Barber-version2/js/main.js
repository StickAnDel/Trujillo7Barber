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
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    servicesContainer.innerHTML = '';
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <img src="${service.image}" alt="${service.name}">
            <div class="service-info">
                <h3>${service.name}</h3>
                <p class="price">S/${service.price}</p>
            </div>
        `;
        
        //Evento click para efecto 3D
        serviceCard.addEventListener('click', function() {
            
            const modal = document.getElementById('service-modal-3d');
            const poster = document.getElementById('poster-3d');
            const serviceName = document.getElementById('service-name-modal');
            const servicePrice = document.getElementById('service-price-modal');
            
            
            poster.style.backgroundImage = `url(${service.image})`;
            serviceName.textContent = service.name;
            servicePrice.textContent = `S/${service.price}`;
            modal.style.display = 'flex';
            setup3DEffect();
        });
        
        servicesContainer.appendChild(serviceCard);
    });
    
    // Cerrar modal
    document.querySelector('.close-modal-3d').addEventListener('click', function() {
        document.getElementById('service-modal-3d').style.display = 'none';
    });
}

// Efecto 3D
function setup3DEffect() {
    const poster = document.getElementById('poster-3d');
    const height = poster.clientHeight;
    const width = poster.clientWidth;

    poster.addEventListener('mousemove', (evt) => {
        const { layerX, layerY } = evt;
        const yRotation = ((layerX - width / 2) / width) * 25;
        const xRotation = ((layerY - height / 2) / height) * 25;

        poster.style.transform = `
            perspective(1000px)
            scale(1.05)
            rotateX(${xRotation}deg)
            rotateY(${yRotation}deg)
        `;
    });

    poster.addEventListener('mouseout', () => {
        poster.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
    });
}