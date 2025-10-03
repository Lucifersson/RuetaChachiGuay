async function loginUser(username, password) {
    try {
        const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();
        console.log('Usuario logueado:', data);
        alert('Login exitoso');
        // Aquí podrías redirigir al usuario, por ejemplo:
        // window.location.href = "/dashboard.html";

        const token = data["token"];
        if (token) {
            window.location.href = `/index.html?token=${token}`
        }

        return data;
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Revisa la consola.');
    }
}

// Event listener para el botón
document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Por favor, rellena todos los campos.');
        return;
    }

    loginUser(username, password);
});
