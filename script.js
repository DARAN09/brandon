// ======================================================
// INITIALISATION DU SITE
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Site chargé");

    // Avis clients
    loadReviews();

    const avisForm = document.getElementById("avis-form");

    if (avisForm) {
        avisForm.addEventListener("submit", addReview);
    }

    // Lightbox
    setupLightbox();

    // Formulaire de contact
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", handleContactForm);
    }

    // Boutons des tarifs
    setupPricingButtons();

});


// ======================================================
// AVIS CLIENTS
// ======================================================

function getStars(rating) {

    const fullStars = parseInt(rating);

    return "★".repeat(fullStars) +
           "☆".repeat(5 - fullStars);
}


function loadReviews() {

    const avisGrid = document.getElementById("avis-grid");

    if (!avisGrid) {
        return;
    }

    const savedReviews =
        JSON.parse(localStorage.getItem("avis")) || [];

    savedReviews.forEach(review => {

        createReviewCard(review, avisGrid);

    });

}


function createReviewCard(review, container) {

    const avisCard = document.createElement("div");

    avisCard.className = "avis-card";

    avisCard.innerHTML = `
        <div class="avis-stars">
            ${getStars(review.rating)}
        </div>

        <p class="avis-text">
            "${review.texte}"
        </p>

        <p class="avis-author">
            - ${review.nom}
        </p>
    `;

    container.appendChild(avisCard);

}


function addReview(event) {

    event.preventDefault();

    const nom =
        document.getElementById("avis-nom").value.trim();

    const rating =
        document.getElementById("avis-rating").value;

    const texte =
        document.getElementById("avis-texte").value.trim();

    const messageElement =
        document.getElementById("avis-message");

    const avisGrid =
        document.getElementById("avis-grid");


    // Validation
    if (!nom || !rating || !texte) {

        messageElement.textContent =
            "❌ Veuillez remplir tous les champs.";

        messageElement.style.color = "#e74c3c";

        return;
    }


    // Création de l'avis
    const newReview = {

        nom: nom,

        rating: rating,

        texte: texte,

        date: new Date().toLocaleDateString("fr-FR")

    };


    // Récupération des avis existants
    const reviews =
        JSON.parse(localStorage.getItem("avis")) || [];


    reviews.push(newReview);


    // Sauvegarde
    localStorage.setItem(
        "avis",
        JSON.stringify(reviews)
    );


    // Affichage immédiat
    createReviewCard(
        newReview,
        avisGrid
    );


    // Message
    messageElement.textContent =
        "✅ Merci pour votre avis !";

    messageElement.style.color =
        "#27ae60";


    // Réinitialisation
    document.getElementById("avis-form").reset();


    // Effacement du message
    setTimeout(() => {

        messageElement.textContent = "";

    }, 5000);

}


// ======================================================
// LIGHTBOX
// ======================================================

function setupLightbox() {

    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightbox-image");

    const lightboxCaption =
        document.getElementById("lightbox-caption");

    const lightboxClose =
        document.querySelector(".lightbox-close");

    const lightboxPrev =
        document.querySelector(".lightbox-prev");

    const lightboxNext =
        document.querySelector(".lightbox-next");

    const galleryImages =
        Array.from(
            document.querySelectorAll(".gallery-image")
        );


    // Vérification
    if (
        !lightbox ||
        !lightboxImage ||
        !lightboxClose ||
        galleryImages.length === 0
    ) {

        console.warn(
            "⚠️ Lightbox non disponible ou aucune image trouvée."
        );

        return;
    }


    let currentImageIndex = 0;


    // ------------------------------------------
    // OUVRIR UNE IMAGE
    // ------------------------------------------

    function openLightbox(index) {

        currentImageIndex = index;

        const image =
            galleryImages[currentImageIndex];

        lightboxImage.src = image.src;

        lightboxImage.alt = image.alt;


        if (lightboxCaption) {

            lightboxCaption.textContent =
                image.alt;

        }


        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    // ------------------------------------------
    // FERMER
    // ------------------------------------------

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

    }


    // ------------------------------------------
    // IMAGE SUIVANTE
    // ------------------------------------------

    function showNextImage() {

        currentImageIndex++;

        if (
            currentImageIndex >=
            galleryImages.length
        ) {

            currentImageIndex = 0;

        }

        openLightbox(currentImageIndex);

    }


    // ------------------------------------------
    // IMAGE PRÉCÉDENTE
    // ------------------------------------------

    function showPreviousImage() {

        currentImageIndex--;

        if (currentImageIndex < 0) {

            currentImageIndex =
                galleryImages.length - 1;

        }

        openLightbox(currentImageIndex);

    }


    // ------------------------------------------
    // CLIC SUR LES IMAGES
    // ------------------------------------------

    galleryImages.forEach((image, index) => {

        image.addEventListener("click", () => {

            openLightbox(index);

        });

    });


    // ------------------------------------------
    // BOUTON FERMER
    // ------------------------------------------

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );


    // ------------------------------------------
    // BOUTON PRÉCÉDENT
    // ------------------------------------------

    if (lightboxPrev) {

        lightboxPrev.addEventListener(
            "click",
            showPreviousImage
        );

    }


    // ------------------------------------------
    // BOUTON SUIVANT
    // ------------------------------------------

    if (lightboxNext) {

        lightboxNext.addEventListener(
            "click",
            showNextImage
        );

    }


    // ------------------------------------------
    // CLIC SUR LE FOND
    // ------------------------------------------

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });


    // ------------------------------------------
    // CLAVIER
    // ------------------------------------------

    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox.classList.contains("active")
            ) {

                return;

            }


            if (event.key === "Escape") {

                closeLightbox();

            }


            if (event.key === "ArrowRight") {

                showNextImage();

            }


            if (event.key === "ArrowLeft") {

                showPreviousImage();

            }

        }
    );

}


// ======================================================
// BOUTONS DES TARIFS
// ======================================================

function setupPricingButtons() {

    const pricingButtons =
        document.querySelectorAll(
            ".pricing-card .btn"
        );

    const prestationSelect =
        document.getElementById(
            "contact-prestation"
        );


    pricingButtons.forEach(button => {

        button.addEventListener("click", () => {

            const prestation =
                button.dataset.prestation;


            // Sélection automatique
            if (prestationSelect && prestation) {

                prestationSelect.value =
                    prestation;

            }


            // Aller au formulaire
            const contactSection =
                document.getElementById("contact");

            if (contactSection) {

                contactSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

}


// ======================================================
// FORMULAIRE DE CONTACT
// ======================================================

function handleContactForm(event) {

    event.preventDefault();


    const nom =
        document.getElementById(
            "contact-nom"
        ).value.trim();


    const email =
        document.getElementById(
            "contact-email"
        ).value.trim();


    const message =
        document.getElementById(
            "contact-message"
        ).value.trim();


    const prestationElement =
        document.getElementById(
            "contact-prestation"
        );


    const prestation =
        prestationElement
            ? prestationElement.value
            : "";


    const messageElement =
        document.getElementById(
            "contact-message-response"
        );


    const form =
        document.getElementById(
            "contact-form"
        );


    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!nom || !email || !message) {

        messageElement.textContent =
            "❌ Veuillez remplir tous les champs obligatoires.";

        messageElement.style.color =
            "#e74c3c";

        return;

    }


    // Vérification simple de l'adresse email
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

        messageElement.textContent =
            "❌ Veuillez entrer une adresse email valide.";

        messageElement.style.color =
            "#e74c3c";

        return;

    }


    // ------------------------------------------
    // VÉRIFICATION EMAILJS
    // ------------------------------------------

    if (
        typeof emailjs === "undefined"
    ) {

        messageElement.textContent =
            "❌ Le service d'envoi n'est pas disponible.";

        messageElement.style.color =
            "#e74c3c";

        console.error(
            "EmailJS n'est pas chargé."
        );

        return;

    }


    // ------------------------------------------
    // DONNÉES ENVOYÉES
    // ------------------------------------------

    const templateParams = {

        nom: nom,

        email: email,

        prestation: prestation,

        message: message,

        date: new Date().toLocaleString(
            "fr-FR"
        )

    };


    // ------------------------------------------
    // ENVOI EMAILJS
    // ------------------------------------------

    messageElement.textContent =
        "⏳ Envoi de votre message...";

    messageElement.style.color =
        "#666";


    emailjs
        .send(
            "service_60tdm77",
            "template_38y95cp",
            templateParams
        )

        .then(() => {

            // SUCCÈS
            messageElement.textContent =
                "✅ Votre message a bien été envoyé. Merci !";

            messageElement.style.color =
                "#27ae60";


            form.reset();


            setTimeout(() => {

                messageElement.textContent = "";

            }, 6000);

        })

        .catch(error => {

            // ERREUR
            console.error(
                "❌ Erreur EmailJS :",
                error
            );


            messageElement.textContent =
                "❌ Impossible d'envoyer le message. Veuillez réessayer.";

            messageElement.style.color =
                "#e74c3c";

        });

}
