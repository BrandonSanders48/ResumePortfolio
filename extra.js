// Contact form submission
document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'contactForm') {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        fetch('/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            const alertBox = document.getElementById('form-alert');
            alertBox.innerHTML = data.message;
            alertBox.className = data.success ? "alert alert-warning" : "alert alert-danger";
            alertBox.style.display = "block";
            if (data.success) {
                form.reset(); // clear the form on success
            }
        })
        .catch(err => {
            console.error('Error:', err);
            const alertBox = document.getElementById('form-alert');
            alertBox.innerHTML = "Unexpected error. Please try again.";
            alertBox.className = "alert alert-danger";
            alertBox.style.display = "block";
        });
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
});

// Load modal
document.addEventListener("DOMContentLoaded", function() {
    const modalEl = document.getElementById('hostingModal');
    const myModal = new bootstrap.Modal(modalEl);
    const storageKey = "modalLastClosed";
    const sixHours = 6 * 60 * 60 * 1000; // 6 hours in ms
    const lastClosed = localStorage.getItem(storageKey);
    const now = new Date().getTime();
    if (!lastClosed || now - lastClosed > sixHours) {
        myModal.show();
    }
    // When modal closes, update timestamp
    modalEl.addEventListener('hidden.bs.modal', function () {
        localStorage.setItem(storageKey, new Date().getTime());
    });
});