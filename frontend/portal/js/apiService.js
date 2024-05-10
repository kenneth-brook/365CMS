class ApiService {
    constructor(token) {
        this.token = token;
        this.baseURL = 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/';
    }

    async fetch(url, options = {}) {
        // Conditionally add the Authorization header only if a token is present
        const headers = { ...options.headers };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        options.headers = headers;

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