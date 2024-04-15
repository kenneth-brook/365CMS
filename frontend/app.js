document.addEventListener("DOMContentLoaded", function () {
    // Make API call to fetch server port information
    fetch('https://p70bluj1kf.execute-api.us-east-1.amazonaws.com/')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch server port information');
        }
        return response.text();
    })
    .then(data => {
        // Update the content of the h1 element with the response data
        document.getElementById('portInfo').innerHTML = data;
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        document.getElementById('portInfo').innerHTML = 'Error: ' + error.message;
    });
});
