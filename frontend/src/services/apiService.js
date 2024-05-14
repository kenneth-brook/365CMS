class ApiService {
    constructor() {
        this.baseURL = 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/';
    }

    async fetch(url, options = {}) {
        options.credentials = 'include';  // Ensure credentials are included in every request

        try {
            console.log('address called: ' + this.baseURL + url)
            const response = await fetch(this.baseURL + url, options);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}

export default ApiService;