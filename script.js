// Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const shoeImages = document.querySelectorAll('.shoe-image');

    // Open lightbox when clicking on shoe image
    shoeImages.forEach(function(image) {
        image.addEventListener('click', function() {
            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close lightbox when clicking X
    lightboxClose.addEventListener('click', function() {
        closeLightbox();
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
});

// Order form functionality
document.addEventListener('DOMContentLoaded', function() {
    const modelSelect = document.getElementById('model');
    const velicinaSelect = document.getElementById('velicina');
    const porukaTextarea = document.getElementById('poruka');
    const charCount = document.getElementById('char-count');
    const orderForm = document.getElementById('order-form');

    // Model sizes mapping
    const modelSizes = {
        'Gresca Blue': ['40', '41', '43', '44'],
        'Continental V2 Blue': ['41', '42', '44'],
        'G3 Profit Navy': ['45'],
        'Continental White': ['41'],
        'G3 Profit White': ['42', '44'],
        'Continental V2 White': ['46'],
        'Gresca Yellow': ['39', '40'],
        'Gresca Black': ['43']
    };

    // Update sizes dropdown when model changes
    modelSelect.addEventListener('change', function() {
        const selectedModel = this.value;
        velicinaSelect.innerHTML = '<option value="">-- Odaberi veličinu --</option>';
        
        if (selectedModel && modelSizes[selectedModel]) {
            velicinaSelect.disabled = false;
            modelSizes[selectedModel].forEach(function(size) {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                velicinaSelect.appendChild(option);
            });
        } else {
            velicinaSelect.disabled = true;
        }
    });

    // Character counter for message textarea
    porukaTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        charCount.textContent = currentLength;
        
        if (currentLength >= 500) {
            charCount.style.color = '#d32f2f';
        } else if (currentLength >= 450) {
            charCount.style.color = '#f57c00';
        } else {
            charCount.style.color = 'inherit';
        }
    });

    // Initialize EmailJS
    // Napomena: Trebate se registrirati na https://www.emailjs.com/ i dobiti svoje ključeve
    // Zamijenite 'YOUR_PUBLIC_KEY', 'YOUR_SERVICE_ID', i 'YOUR_TEMPLATE_ID' s vašim stvarnim vrijednostima
    (function(){
        emailjs.init({
            publicKey: "YOUR_PUBLIC_KEY", // Zamijenite s vašim EmailJS Public Key
        });
    })();

    // Form submission
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = orderForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Šalje se...';
        
        const formData = {
            ime: document.getElementById('ime').value,
            prezime: document.getElementById('prezime').value,
            email: document.getElementById('email').value,
            telefon: document.getElementById('telefon').value,
            model: document.getElementById('model').value,
            velicina: document.getElementById('velicina').value,
            poruka: document.getElementById('poruka').value
        };

        // Prepare email template parameters
        const templateParams = {
            to_email: 'antun.orsolic7@gmail.com',
            from_name: `${formData.ime} ${formData.prezime}`,
            from_email: formData.email,
            phone: formData.telefon,
            model: formData.model,
            velicina: formData.velicina,
            poruka: formData.poruka || 'Nema dodatne poruke',
            subject: `Narudžba: ${formData.model} - Veličina ${formData.velicina}`
        };

        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                // Success
                alert('Hvala na narudžbi! Vaša narudžba je uspješno poslana. Kontaktirat ćemo vas uskoro.');
                
                // Reset form
                orderForm.reset();
                velicinaSelect.disabled = true;
                charCount.textContent = '0';
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }, function(error) {
                // Error
                console.error('EmailJS Error:', error);
                alert('Greška pri slanju narudžbe. Molimo pokušajte ponovno ili nas kontaktirajte direktno na antun.orsolic7@gmail.com');
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
    });
});

