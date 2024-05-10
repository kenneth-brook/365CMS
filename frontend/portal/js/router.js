// router.js
class Router {
    constructor() {
        this.routes = {};
        window.onpopstate = this.loadCurrentRoute.bind(this); // Handle browser navigation
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    navigate(path) {
        history.pushState({}, '', path);
        this.loadCurrentRoute();
    }

    loadCurrentRoute() {
        const path = window.location.pathname;
        const routeAction = this.routes[path];
        if (routeAction) {
            routeAction();
        } else {
            console.error('No route found for:', path);
        }
    }
}

export default Router;
