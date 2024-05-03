document.addEventListener("DOMContentLoaded", function () {
    fetch('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch server port information');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('portInfo').innerHTML = data;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('portInfo').innerHTML = 'Error: ' + error.message;
    });
});
