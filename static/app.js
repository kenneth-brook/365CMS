document.addEventListener('DOMContentLoaded', () => {
    const portInfoElement = document.getElementById('portInfo');

    fetch('/')
        .then(response => response.text())
        .then(data => {
            portInfoElement.textContent = `The server responded: ${data}`;
        })
        .catch(error => {
            console.error('Error fetching port information:', error);
            portInfoElement.textContent = 'Failed to load port information.';
        });
});
