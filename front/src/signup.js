async function registerUser(username, password, birthdate) {
    try {
        const response = await fetch('http://localhost:8000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();
        console.log('Usuario registrado:', data);
        alert('Usuario registrado correctamente');
        window.location.href = "/login.html";
        return data;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario. Revisa la consola.');
    }
}

// Event listener para el botón
document.getElementById('signupButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const birthdate = document.getElementById('birthdate').value;

    if (!username || !password || !birthdate) {
        alert('Por favor, rellena todos los campos.');
        return;
    }

    registerUser(username, password, birthdate);
});
