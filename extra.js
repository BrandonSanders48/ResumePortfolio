// Contact form submission
document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'contactForm') {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const btnOriginal = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending…';
        const formData = new FormData(form);
        fetch('/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            const alertBox = document.getElementById('form-alert');
            alertBox.innerHTML = data.message;
            alertBox.className = data.success ? 'form-alert-success' : 'form-alert-error';
            alertBox.style.display = 'block';
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            if (data.success) {
                form.reset();
            }
        })
        .catch(err => {
            console.error('Error:', err);
            const alertBox = document.getElementById('form-alert');
            alertBox.innerHTML = 'Unexpected error. Please try again.';
            alertBox.className = 'form-alert-error';
            alertBox.style.display = 'block';
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        })
        .finally(() => {
            btn.disabled = false;
            btn.textContent = btnOriginal;
        });
    }
});

// Custom modal logic (no Bootstrap)
document.addEventListener('DOMContentLoaded', function () {
    const modalEl   = document.getElementById('hostingModal');
    const backdrop  = document.getElementById('modalBackdrop');
    const closeBtn  = document.getElementById('modalClose');
    const closeBtnF = document.getElementById('modalCloseBtn');

    const storageKey = 'modalLastShown';
    const sixHours   = 6 * 60 * 60 * 1000;
    const lastShown  = localStorage.getItem(storageKey);
    const now        = new Date().getTime();

    function closeModal() {
        if (modalEl) modalEl.style.display = 'none';
        localStorage.setItem(storageKey, new Date().getTime());
    }

    if (modalEl && (!lastShown || now - parseInt(lastShown, 10) > sixHours)) {
        modalEl.style.display = 'flex';
    }

    if (backdrop)  backdrop.addEventListener('click',  closeModal);
    if (closeBtn)  closeBtn.addEventListener('click',  closeModal);
    if (closeBtnF) closeBtnF.addEventListener('click', closeModal);
});
