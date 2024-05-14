class Router {
    constructor() {
        this.routes = {};
        window.addEventListener('hashchange', this.loadCurrentRoute.bind(this));
        window.addEventListener('load', this.loadCurrentRoute.bind(this));
    }

    addRoute(hash, callback) {
        this.routes[hash] = callback;
    }

    navigate(hash) {
        window.location.hash = hash;
    }

    loadCurrentRoute() {
        let path = window.location.hash.slice(1);
        if (!path) {
            this.navigate('businesses'); // Directly navigate to 'businesses' if no hash is provided
            return;
        }
        const routeAction = this.routes[path];
        if (routeAction) {
            routeAction();
        } else {
            console.error('No route found for:', path);
            this.navigate('businesses'); // Navigate to 'businesses' as a fallback
        }
    }
}

export default Router;
