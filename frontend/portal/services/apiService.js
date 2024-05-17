class ApiService {
    constructor() {
      this.baseURL = 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/';
    }
  
    async fetch(url, options = {}) {
      options.credentials = 'include';  // Ensure credentials are included in every request
  
      try {
        console.log('address called: ' + this.baseURL + url);
        const response = await fetch(this.baseURL + url, options);
  
        if (response.status === 401) {
          // Handle unauthorized response
          this.handleAuthError();
          throw new Error('Unauthorized');
        }
  
        if (!response.ok) {
          const errorResponse = await response.text(); // Capture response text for more details
          console.error('Response not OK:', response.status, response.statusText, errorResponse);
          throw new Error('Network response was not ok. Status: ' + response.status + ' ' + response.statusText + ' - ' + errorResponse);
      }
  
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    handleAuthError() {
      // Clear any stored authentication data
      document.cookie = 'token=; Max-Age=0; path=/; domain=' + window.location.hostname;
      // Redirect to login page
      window.location.href = '../';
    }
  }
  
  export default ApiService;