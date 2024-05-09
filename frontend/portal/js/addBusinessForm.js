function addBusinessForm() {
    const toolbar = document.getElementById('business');
    const toolArea = document.querySelector('.toolbar');
    const contentArea = document.querySelector('.content-area');
    toolArea.innerHTML = '';
    contentArea.innerHTML = '';
    contentArea.innerHTML = getBusinessForm();  // Inject the form HTML

    // Now that the form is added to the DOM, attach the event listener
    const toggle = document.getElementById('active-toggle');
    const statusSpan = document.getElementById('toggle-status');

    if (toggle && statusSpan) {
        toggle.addEventListener('change', function() {
            console.log("Toggle state changed.");
            if (this.checked) {
                statusSpan.textContent = "Active";
                statusSpan.style.color = "green";
            } else {
                statusSpan.textContent = "Inactive";
                statusSpan.style.color = "red";
            }
        });
    } else {
        console.error("Failed to initialize toggle functionality - elements not found.");
    }
}
