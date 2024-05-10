class ApiService {
    constructor(token) {
        this.token = token;
        this.baseURL = 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/';
    }

    async fetch(url, options = {}) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${this.token}`,
        };

        try {
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