// Simulación de base de datos
const database = {
    // Usuarios registrados
    users: [
        {
            id: 1,
            name: "Administrador",
            email: "admin@gmail.com",
            password: "123456",
            role: "admin",
            phone: "1234567890"
        }
    ],
    
    // Servicios de barbería
    services: [
        {
            id: 1,
            name: "Corte Clásico",
            price: 15,
            image: "https://i.pinimg.com/474x/59/db/c8/59dbc820764ac46ea6e4cd9c81296f37.jpg"
        },
        {
            id: 2,
            name: "Corte Moderno",
            price: 10,
            image: "https://tahecosmetics.com/trends/wp-content/uploads/2023/02/mohicano-personalizado.jpg"
        },
        {
            id: 3,
            name: "Corte y Barba",
            price: 9,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKMPVJmpXfeKCMgiRky_R1_LqQ3dgTDSzRwg&s"
        },
        {
            id: 4,
            name: "Corte + Lavado Capilar",
            price: 18,
            image: "images/CorteLavadoCapilar.jpg"
        },
        {
            id: 5,
            name: "Corte + Peinado con Gel",
            price: 17,
            image: "images/co-hombres6-080222_865698_20220208144140.jpg"
        },
        {
            id: 6,
            name: "Corte + Lavado + Peinado",
            price: 20,
            image: "images/CorteLavadoPeinado.jpg"
        },
        {
            id: 7,
            name: "Corte + Afeitado Tradicional con Navaja",
            price: 20,
            image: "images/afeitado-clasico-1.jpg"
        },
        {
            id: 8,
            name: "Corte + Diseño en Cabello",
            price: 18,
            image: "images/00042e16b996b663344422eb76bc20a4.jpg"
        },
        {
            id: 9,
            name: "Corte + Tinte para Barba o Cabello",
            price: 22,
            image: "images/0ace67724c768ae10fe030ff2a399d1a.jpg"
        },
        {
            id: 10,
            name: "Corte + Mascarilla Facial",
            price: 23,
            image: "images/barbero-aplica-mascara-carbon-negro-cara-hombre-limpiar-piel-poros-eliminar-acne-nariz-barberia_356893-894.jpg"
        },
        {
            id: 11,
            name: "Corte + Cejas con Navaja",
            price: 16,
            image: "images/Risco-na-Barba-e-Cabelo-2.jpg"
        },
        {
            id: 12,
            name: "Corte + Lavado + Mascarilla Facial",
            price: 25,
            image: "images/CorteLavadoMascarillaFacial.jpg"
        },
        {
            id: 13,
            name: "Corte + Hidratación Capilar + Peinado",
            price: 24,
            image: "images/straight-hair-haircuts-for-guys.jpg"
        },
        {
            id: 14,
            name: "Corte Ejecutivo (rápido y formal)",
            price: 12,
            image: "images/f48901af134bbe15dc93923354572f70.jpg"
        },
        {
            id: 15,
            name: "Solo Barba (perfilado y rebajado)",
            price: 10,
            image: "images/perfilado-de-barba.jpg"
        },
        {
            id: 16,
            name: "Corte para Niño (hasta 12 años)",
            price: 7,
            image: "images/cortes-de-pelo-niños-8-9-10-años.jpg"
        },
        {
            id: 17,
            name: "Lavado + Peinado (sin corte)",
            price: 12,
            image: "images/Cabello-largo-texturizado.jpg"
        },
        {
            id: 18,
            name: "Mascarilla Facial + Lavado Capilar",
            price: 15,
            image: "images/IMG_2268-2-scaled.jpg"
        },
        {
            id: 19,
            name: "Corte + Barba + Lavado",
            price: 22,
            image: "images/lavabarba.jpg"
        },
        {
            id: 20,
            name: "Combo Premium (Corte + Barba + Lavado + Peinado + Mascarilla)",
            price: 30,
            image: "images/fewfwfdsa.jpg"
        }

    ],
    
    // Reservas
    reservations: [],
    
    // ID autoincremental
    nextId: {
        user: 2,
        service: 4,
        reservation: 1
    }
};

// Funciones para interactuar con la "base de datos"

// Usuarios
function addUser(user) {
    user.id = database.nextId.user++;
    database.users.push(user);
    return user;
}

function findUserByEmail(email) {
    return database.users.find(user => user.email === email);
}

// Servicios
function getServices() {
    return database.services;
}

function addService(service) {
    service.id = database.nextId.service++;
    database.services.push(service);
    return service;
}

function updateService(id, updatedService) {
    const index = database.services.findIndex(s => s.id === id);
    if (index !== -1) {
        database.services[index] = { ...database.services[index], ...updatedService };
        return database.services[index];
    }
    return null;
}

function deleteService(id) {
    const index = database.services.findIndex(s => s.id === id);
    if (index !== -1) {
        return database.services.splice(index, 1)[0];
    }
    return null;
}

// Reservas
function addReservation(reservation) {
    reservation.id = database.nextId.reservation++;
    reservation.status = "pending"; // pending, completed, late
    database.reservations.push(reservation);
    return reservation;
}

function getReservationsByUser(userId) {
    return database.reservations.filter(r => r.userId === userId);
}

function getAllReservations() {
    return database.reservations;
}

function updateReservationStatus(id, status, comment = "") {
    const reservation = database.reservations.find(r => r.id === id);
    if (reservation) {
        reservation.status = status;
        if (comment) {
            reservation.adminComment = comment;
        }
        return reservation;
    }
    return null;
}

// Exportar las funciones necesarias
window.db = {
    addUser,
    findUserByEmail,
    getServices,
    addService,
    updateService,
    deleteService,
    addReservation,
    getReservationsByUser,
    getAllReservations,
    updateReservationStatus
};