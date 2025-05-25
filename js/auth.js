// Manejo de autenticación
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay una sesión activa al cargar la página
    checkAuth();
    
    // Manejar el formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Manejar el formulario de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Mostrar/ocultar campo de tipo de discapacidad
        const disabilityYes = document.getElementById('disability-yes');
        const disabilityNo = document.getElementById('disability-no');
        const disabilityTypeGroup = document.getElementById('disability-type-group');
        
        disabilityYes.addEventListener('change', function() {
            if (this.checked) {
                disabilityTypeGroup.style.display = 'block';
                disabilityNo.checked = false;
            }
        });
        
        disabilityNo.addEventListener('change', function() {
            if (this.checked) {
                disabilityTypeGroup.style.display = 'none';
                disabilityYes.checked = false;
            }
        });
        
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Manejar cierre de sesión
    const logoutBtn = document.getElementById('logout');
    const clientLogoutBtn = document.getElementById('client-logout');
    
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (clientLogoutBtn) clientLogoutBtn.addEventListener('click', handleLogout);
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user) {
        // Redirigir según el rol
        if (user.role === 'admin' && !window.location.pathname.includes('admin.html')) {
            window.location.href = 'admin.html';
        } else if (user.role === 'client' && !window.location.pathname.includes('client.html')) {
            window.location.href = 'client.html';
        }
    } else {
        // Si no está autenticado y no está en login/register/index, redirigir a login
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('register.html') && 
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const user = db.findUserByEmail(email);
    
    if (user && user.password === password) {
        // Inicio de sesión exitoso
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirigir según el rol
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'client.html';
        }
    } else {
        alert('Correo electrónico o contraseña incorrectos');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Validaciones básicas
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (db.findUserByEmail(email)) {
        alert('Este correo electrónico ya está registrado');
        return;
    }
    
    // Obtener información sobre discapacidad
    const hasDisability = document.getElementById('disability-yes').checked;
    let disabilityType = null;
    
    if (hasDisability) {
        disabilityType = document.getElementById('disability-type').value;
        if (!disabilityType) {
            alert('Por favor seleccione el tipo de discapacidad');
            return;
        }
    }
    
    // Crear nuevo usuario
    const newUser = {
        name,
        email,
        password,
        phone,
        role: 'client',
        disability: hasDisability ? disabilityType : null
    };
    
    db.addUser(newUser);
    
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}