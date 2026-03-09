// Simple API client with cookie-based session and CSRF support
const API = {
  BASE_URL: window.location.origin + '/api',

  // helper to read CSRF token from cookie set by Spring
  csrfToken() {
    const match = document.cookie.match('XSRF-TOKEN=([^;]+)');
    return match ? decodeURIComponent(match[1]) : null;
  },

  async ensureCSRFToken() {
    try {
      const response = await fetch(window.location.origin + '/csrf', {
        credentials: 'include',
        method: 'GET'
      });
      if (response.ok) {
        const data = await response.json();
        console.log('CSRF token ensured');
      }
    } catch (e) {
      console.warn('Failed to fetch CSRF token:', e);
    }
  },

  async request(method, endpoint, data = null) {
    const options = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const token = this.csrfToken();
    if (token) {
      options.headers['X-XSRF-TOKEN'] = token;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, options);
      if (!response.ok) {
        let errorText;
        try {
          const errJson = await response.json();
          errorText = errJson.message || JSON.stringify(errJson);
        } catch (e) {
          errorText = await response.text();
        }
        throw new Error(errorText || `HTTP Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Auth endpoints
  async login(username, password) {
    await this.ensureCSRFToken();

    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const token = this.csrfToken();
    if (token) {
      options.headers['X-XSRF-TOKEN'] = token;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/login`, {
        ...options,
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        let errorText;
        try {
          const errJson = await response.json();
          errorText = errJson.message || JSON.stringify(errJson);
        } catch (e) {
          errorText = await response.text();
        }
        throw new Error(errorText || `HTTP Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  async register(userData) {
    await this.ensureCSRFToken();
    return this.request('POST', '/register', userData);
  },

  logout() {
    const token = this.csrfToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['X-XSRF-TOKEN'] = token;

    return fetch(window.location.origin + '/logout', {
      method: 'POST',
      credentials: 'include',
      headers
    }).finally(() => {
      localStorage.removeItem('currentUser');
      window.location.href = '/login.html';
    });
  },

  // Asset endpoints
  getAssets() {
    return this.request('GET', '/assets');
  },

  getAsset(id) {
    return this.request('GET', `/assets/${id}`);
  },

  deleteAsset(id) {
    return this.request('DELETE', `/assets/${id}`);
  },

  onboardApplication(onboardingData) {
    return this.request('POST', '/onboard', onboardingData);
  },

  // User endpoints
  getCurrentUser() {
    return this.request('GET', '/users/me');
  },

  getProfile() {
    return this.request('GET', '/profile');
  },

  updateProfile(userData) {
    return this.request('PUT', '/users/me', userData);
  },

  getUsers() {
    return this.request('GET', '/users');
  }
};

// Utils
const Utils = {
  showAlert(message, type = 'info', elementId = 'alert') {
    const alertEl = document.getElementById(elementId);
    if (alertEl) {
      alertEl.textContent = message;
      alertEl.className = `alert show alert-${type}`;
      if (type === 'success' || type === 'info') {
        setTimeout(() => alertEl.classList.remove('show'), 5000);
      }
    }
  },

  hideAlert(elementId = 'alert') {
    const alertEl = document.getElementById(elementId);
    if (alertEl) {
      alertEl.classList.remove('show');
    }
  },

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  },

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('currentUser');
  },

  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  getCurrentUser() {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
  },

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  redirectIfNotAuthenticated() {
    if (!this.isAuthenticated()) {
      window.location.href = '/login.html';
    }
  }
};

// Initialize app: attempt to load current user from server
// this will set sessionStorage so Utils.isAuthenticated() works
document.addEventListener('DOMContentLoaded', async function () {
  try {
    // hit /csrf to make sure cookie is set before any POST requests
    await fetch(window.location.origin + '/csrf', { credentials: 'include' });
  } catch (ignored) { }

  try {
    const user = await API.getCurrentUser();
    Utils.setCurrentUser(user);
  } catch (e) {
    // ignore; user not logged in or unable to fetch
    console.debug('no existing session', e);
  }
});
