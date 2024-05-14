import { createBusinessToolbar } from '../../common/toolbars.js';

class ListBusinesses {
    constructor() {
        this.container = document.createElement('div');
    }

    render() {
        this.container.innerHTML = `<div>All businesses listed here with options to edit or delete each entry.</div>`;
        
        // Create and append the toolbar
        const toolbar = createBusinessToolbar();
        this.container.prepend(toolbar);

        // Add more complex rendering and event listeners here
        return this.container;
    }
}

export default ListBusinesses;
