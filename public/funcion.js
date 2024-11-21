// Realizar Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('https://dogzline-1.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contraseña: password })
    });
  
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Login exitoso');
    } else {
      alert('Error: ' + data.mensaje);
    }
  });
  
  // Crear un nuevo Usuario
  document.getElementById('create-user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    const role = document.getElementById('role').value;
    const token = localStorage.getItem('token');
  
    const response = await fetch('https://dogzline-1.onrender.com/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, contraseña: password, role })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Usuario creado con éxito');
    } else {
      alert('Error: ' + data.mensaje);
    }
  });
  
  // Función para cargar los usuarios con paginación
  async function loadUsuarios(page) {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://dogzline-1.onrender.com/api/usuarios?page=${page}&limit=10`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    const data = await response.json();
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    data.users.forEach(user => {
      usersList.innerHTML += `<div>${user.email}</div>`;
    });
  }
  
  // Buscar usuario por ID
  async function getUsuarioById() {
    const userId = document.getElementById('user-id').value;
    const token = localStorage.getItem('token');
    const response = await fetch(`https://dogzline-1.onrender.com/api/usuarios/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    const data = await response.json();
    const userDetails = document.getElementById('user-details');
    userDetails.innerHTML = `<div>Email: ${data.email}</div><div>Role: ${data.role}</div>`;
  }
  
  // Actualizar Usuario
  async function updateUsuario() {
    const userId = document.getElementById('update-user-id').value;
    const email = document.getElementById('update-email').value;
    const password = document.getElementById('update-password').value;
    const token = localStorage.getItem('token');
  
    const response = await fetch(`https://dogzline-1.onrender.com/api/usuarios/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email, contraseña: password })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Usuario actualizado');
    } else {
      alert('Error: ' + data.mensaje);
    }
  }
  
  // Eliminar Usuario
  async function deleteUsuario() {
    const userId = document.getElementById('delete-user-id').value;
    const token = localStorage.getItem('token');
  
    const response = await fetch(`https://dogzline-1.onrender.com/api/usuarios/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Usuario eliminado');
    } else {
      alert('Error: ' + data.mensaje);
    }
  }
  
  // **Funciones para Mascotas (Crear, Leer, Actualizar, Eliminar)**
  
  // Crear una nueva Mascota
  document.getElementById('create-pet-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const petName = document.getElementById('pet-name').value;
    const petAge = document.getElementById('pet-age').value;
    const petBreed = document.getElementById('pet-breed').value;
    const petSex = document.getElementById('pet-sex').value;
    const token = localStorage.getItem('token');
  
    const response = await fetch('https://dogzline-1.onrender.com/api/mascotas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombre: petName, edad: petAge, raza: petBreed, sexo: petSex })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Mascota creada con éxito');
    } else {
      alert('Error: ' + data.mensaje);
    }
  });
  
  // Función para cargar las Mascotas con paginación
  async function loadPets(page) {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://dogzline-1.onrender.com/api/mascotas?page=${page}&limit=10`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    const data = await response.json();
    const petsList = document.getElementById('pets-list');
    petsList.innerHTML = '';
    data.mascotas.forEach(pet => {
      petsList.innerHTML += `<div>${pet.nombre} - ${pet.raza}</div>`;
    });
  }
  
  // Buscar Mascota por ID
  async function getPetById() {
    const petId = document.getElementById('pet-id').value;
    const token = localStorage.getItem('token');
    const response = await fetch(`https://dogzline-1.onrender.com/api/mascotas/${petId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    const data = await response.json();
    const petDetails = document.getElementById('pet-details');
    petDetails.innerHTML = `<div>Nombre: ${data.nombre}</div><div>Edad: ${data.edad}</div><div>Raza: ${data.raza}</div><div>Sexo: ${data.sexo}</div>`;
  }
  
  // Actualizar Mascota
  async function updatePet() {
    const petId = document.getElementById('update-pet-id').value;
    const petName = document.getElementById('update-pet-name').value;
    const token = localStorage.getItem('token');
  
    const response = await fetch(`https://dogzline-1.onrender.com/api/mascotas/${petId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombre: petName })
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Mascota actualizada');
    } else {
      alert('Error: ' + data.mensaje);
    }
  }
  
  // Eliminar Mascota
  async function deletePet() {
    const petId = document.getElementById('delete-pet-id').value;
    const token = localStorage.getItem('token');
  
    const response = await fetch(`https://dogzline-1.onrender.com/api/mascotas/${petId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  
    const data = await response.json();
    if (response.ok) {
      alert('Mascota eliminada');
    } else {
      alert('Error: ' + data.mensaje);
    }
  }
  