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
            price: 150,
            image: "https://i.pinimg.com/474x/59/db/c8/59dbc820764ac46ea6e4cd9c81296f37.jpg"
        },
        {
            id: 2,
            name: "Corte Moderno",
            price: 180,
            image: "https://tahecosmetics.com/trends/wp-content/uploads/2023/02/mohicano-personalizado.jpg"
        },
        {
            id: 3,
            name: "Corte y Barba",
            price: 220,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKMPVJmpXfeKCMgiRky_R1_LqQ3dgTDSzRwg&s"
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