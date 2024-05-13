class Router {
    constructor() {
        this.routes = {};
        // Listen to hash change as well as load event to handle direct URL access or reloads
        window.addEventListener('hashchange', this.loadCurrentRoute.bind(this));
        window.addEventListener('load', this.loadCurrentRoute.bind(this));
    }

    addRoute(hash, callback) {
        // The hash should not include the '#' symbol; it's cleaner to manage it internally here
        this.routes[hash] = callback;
    }

    navigate(hash) {
        // Changes the hash part of the URL programmatically
        window.location.hash = hash;
    }

    loadCurrentRoute() {
        const path = window.location.hash.slice(1); // Remove the '#' part
        const routeAction = this.routes[path];
        if (routeAction) {
            routeAction();
        } else {
            console.error('No route found for:', path);
            // Handle loading a default tab or showing an error page
        }
    }
}

export default Router;
