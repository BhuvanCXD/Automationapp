const API = {
    async request(url, options = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        options.headers = { ...defaultHeaders, ...options.headers };

        try {
            const response = await fetch(url, options);

            if (response.status === 401 && !url.includes('/api/login')) {
                window.location.href = '/login.html';
                return null;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(url) {
        return this.request(url, { method: 'GET' });
    },

    post(url, body) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    logout() {
        return fetch('/logout', { method: 'POST' })
            .then(() => window.location.href = '/login.html');
    }
};

window.API = API;
