class ApiService {
  constructor() {
    this.baseURL = 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/';
  }

  async fetch(url, options = {}) {
    options.credentials = 'include';  // Ensure credentials are included in every request

    console.log(`Making request to: ${this.baseURL + url}`, options);

    try {
      const response = await fetch(this.baseURL + url, options);

      if (response.status === 401) {
        // Handle unauthorized response
        this.handleAuthError();
        throw new Error('Unauthorized');
      }

      const responseBody = await response.text();
      console.log('Response Body:', responseBody);

      try {
        return JSON.parse(responseBody);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', responseBody);
        throw jsonError;
      }
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

  async createBusiness(formData) {
    return this.fetch('form-submission', {
      method: 'POST',
      body: formData
    });
  }

  async submitEatForm(formData) {
    return this.fetch('eat-form-submission/eat-form-submission', { // Ensure correct path is used
      method: 'POST',
      body: formData
    });
  }

  async insertEatType(eatId, typeId) {
    return this.fetch('eat-form-submission/eat-eat-type', { // Ensure correct path is used
      method: 'POST',
      body: JSON.stringify({ eatId, typeId }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export default ApiService;
