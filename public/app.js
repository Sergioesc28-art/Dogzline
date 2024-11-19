const apiBaseUrl = 'http://localhost:3000/api';  // Ajusta a la URL de tu API

// Función para manejar el login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contraseña').value;

    try {
        const response = await fetch(`${apiBaseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, contraseña })
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('token', token);  // Guardamos el token
            window.location.href = 'dashboard.html';  // Redirigir al dashboard
        } else {
            const { mensaje } = await response.json();
            alert(mensaje);
        }
    } catch (error) {
        console.error('Error en el login:', error);
        alert('Error en la solicitud de login');
    }
});

// Función para cargar datos del dashboard
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const usuariosResponse = await fetch(`${apiBaseUrl}/usuarios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const mascotasResponse = await fetch(`${apiBaseUrl}/mascotas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const usuariosData = await usuariosResponse.json();
        const mascotasData = await mascotasResponse.json();

        const usuariosList = document.getElementById('usuarios-list');
        const mascotasList = document.getElementById('mascotas-list');

        usuariosData.users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.email} (${user.role})`;
            usuariosList.appendChild(li);
        });

        mascotasData.mascotas.forEach(mascota => {
            const li = document.createElement('li');
            li.textContent = `${mascota.nombre} - ${mascota.raza}`;
            mascotasList.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar los datos');
    }

    // Lógica de logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});
