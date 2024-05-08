const createBusinessToolbar = () => {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
        <input type="text" placeholder="Search businesses..." class="search-box">
        <select class="sort-dropdown">
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
        </select>
        <button class="sort-button">Sort</button>
        <button class="add-new">Add New Business</button>
    `;

    toolbar.querySelector('.add-new').addEventListener('click', () => {
        const contentArea = document.querySelector('.content-area');
        contentArea.innerHTML = getBusinessForm(); // Replace content with form

        // Attach form submit handler here if needed
        document.getElementById('business-form').addEventListener('submit', handleBusinessFormSubmit);
    });
    
    return toolbar;
};

const createEventsToolbar = () => {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
        <input type="text" placeholder="Search events..." class="search-box">
        <button class="add-new">Add New Event</button>
    `;
    return toolbar;
};

const createOfficeContentToolbar = () => {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
        <input type="text" placeholder="Search office content..." class="search-box">
        <button class="add-new">Add New Content</button>
    `;
    return toolbar;
};
