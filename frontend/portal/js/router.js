const routes = {
    '#businesses': renderBusinesses,
    '#events': renderEvents,
    '#office-content': renderOfficeContent
};

function router() {
    const hash = window.location.hash; // Get the current hash
    if (routes[hash]) {
        routes[hash](); // Run the handler for the current route
    } else if (hash === '' || hash === '#') {
        // Default route (if there's no hash or just '#', go to businesses)
        routes['#businesses']();
    } else {
        // Handle unknown route
        document.getElementById('content').innerHTML = '<h1>404 Not Found</h1>';
    }
}

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('popstate', router);
window.addEventListener('hashchange', router);