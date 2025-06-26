// Manejo de autenticación
console.log('auth.js cargado');
document.addEventListener('DOMContentLoaded', function() {
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

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: email,
                password: password
            })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('currentUser', JSON.stringify({ username: email, role: 'client' }));
            window.location.href = 'client.html';
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error(err);
        alert('Error al iniciar sesión');
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    const hasDisability = document.getElementById('disability-yes').checked;
    const disabilityType = hasDisability ? document.getElementById('disability-type').value : null;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: email,
                password: password,
                name,
                phone,
                role: 'client',
                disability: hasDisability ? disabilityType : null
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = 'login.html';
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error(err);
        alert('Error al registrar el usuario');
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}