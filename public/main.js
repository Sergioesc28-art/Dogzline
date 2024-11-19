// Función para manejar el inicio de sesión
async function iniciarSesion(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();

        if (response.ok) {
            // Guardar el token en el almacenamiento local
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');
            // Redirigir al usuario a una página de bienvenida o dashboard
            window.location.href = 'index.html';
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema con el inicio de sesión');
    }
}

// Añadir el evento al formulario de inicio de sesión
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', iniciarSesion);
}
