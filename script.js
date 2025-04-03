// Wacht tot het hele HTML document geladen is voordat we script uitvoeren
$(document).ready(function() {

    // --- Configuratie en Selectors (makkelijk aanpasbaar bovenaan) ---
    const form = $('#myForm');
    const naamInput = $('#naam');
    const voornaamInput = $('#voornaam');
    const emailInput = $('#email');
    const telInput = $('#tel');
    const aantalInput = $('#aantal');
    const opmerkingenInput = $('#opmerkingen');
    const fysiekRadio = $('#fysiek');
    const digitaalRadio = $('#digitaal');
    const attestCheckbox = $('#attest');

    const submitButton = $('#btnSubmit');
    const fakeSubmitButton = $('#fakeBtnSubmit');
    const fakeSubmitText = $('#txtFakeBtnSubmit');

    const bevestigingContainer = $('#containerBevestiging');
    const bevestigingTitel = $('#bevestigingTitel');
    const bevestigingMsg = $('#bevestigingMsg');
    const bevestigingOkButton = $('#btnOK');

    const errorBorderClass = 'error-border'; // CSS class voor rode rand

    // Toegestane karakters en Regex
    const charAantal = '0123456789';
    const charTel = '0123456789 ,.:/+';
    const nameRegex = /^[a-zA-Z éèëàùçÉÈËÀÙÇ'\s-]+$/; // Namen: letters, spaties, apostrof, streepje, accenten
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Standaard email check
    const basicCharsRegex = /^[a-zA-Z0-9 éèëàùçÉÈËÀÙÇ'@.\/_,:;?!€$%*()\s-]+$/; // Meer toegestaan voor opmerkingen

    // --- Functie: Input Valideren en Foutmelding Tonen/Verbergen ---
    // isValid: boolean, of de input geldig is
    // showErrors: boolean, of de rode rand/tekst getoond moet worden
    function validateInput(inputElement, isValid, showErrors, errorMessageSelector = 'span') {
        const label = inputElement.closest('label'); // Vind het bovenliggende label
        const errorMessage = label.find(errorMessageSelector); // Vind de span binnen dat label

        if (isValid) {
            inputElement.removeClass(errorBorderClass);
            if (errorMessage.length) {
                errorMessage.css('visibility', 'hidden');
            }
            return true;
        } else {
            // Alleen fout tonen als showErrors true is
            if (showErrors) {
                inputElement.addClass(errorBorderClass);
                if (errorMessage.length) {
                    errorMessage.css('visibility', 'visible');
                }
            }
            return false;
        }
    }

     // --- Functie: Scrollen naar een element ---
    function scrollToElement(element) {
        if (!element || element.length === 0) return;
        $('html, body').animate({
            scrollTop: element.offset().top - 80 // 80px ruimte boven het element
        }, 500);
    }


    // --- Functie: Formulier Valideren & Knop Status Instellen ---
    // Nieuwe parameter: showErrors (standaard true, maar false bij initiele check)
    function checkFormValidity(showErrors = true) {
        let isFormValid = true;

        // 1. Valideer Naam (verplicht)
        const isNaamValid = naamInput.val().trim().length > 0;
        validateInput(naamInput, isNaamValid, showErrors); // Geef showErrors door
        if (!isNaamValid) isFormValid = false;

        // 2. Valideer Aantal (verplicht & numeriek > 0)
        const aantalValue = aantalInput.val().trim();
        const isAantalValid = aantalValue.length > 0 && /^\d+$/.test(aantalValue) && parseInt(aantalValue, 10) > 0;
        // Selecteer de standaard span nu de inline style weg is
        validateInput(aantalInput, isAantalValid, showErrors, 'span'); // Geef showErrors door
        if (!isAantalValid) isFormValid = false;

        // 3. Valideer E-mail
        const emailValue = emailInput.val().trim();
        const isDigitaal = digitaalRadio.is(':checked');
        let isEmailFormatValid = true; // Checkt alleen format
        let isEmailRequirementMet = true; // Checkt of het verplicht is en ingevuld

        // Check format als er iets is ingevuld
        if (emailValue.length > 0) {
            isEmailFormatValid = emailRegex.test(emailValue);
        }

        // Check of het verplicht is (bij digitaal) en of het dan is ingevuld
        if (isDigitaal && emailValue.length === 0) {
            isEmailRequirementMet = false;
        }

        // E-mail is pas echt valide als EN het format klopt (indien ingevuld) EN aan de verplichting is voldaan
        const isEmailOverallValid = isEmailFormatValid && isEmailRequirementMet;
        validateInput(emailInput, isEmailOverallValid, showErrors); // Geef showErrors door
        if (!isEmailOverallValid) isFormValid = false;

        // Update e-mail placeholder
        emailInput.attr('placeholder', isDigitaal ? '@emaildomein.be' : ' ');

        // Update knop status
        if (isFormValid) {
            submitButton.css('display', 'block'); // Toon echte knop
            fakeSubmitButton.css('display', 'none'); // Verberg nep knop
            fakeSubmitText.css('display', 'none'); // Verberg tekst
        } else {
            submitButton.css('display', 'none'); // Verberg echte knop
            fakeSubmitButton.css('display', 'block'); // Toon nep knop
            // Toon fake tekst alleen als we ook fouten mogen tonen
            fakeSubmitText.css('display', showErrors ? 'block' : 'none');
        }

        return isFormValid; // Geeft true/false terug
    }

    // --- Event Handlers ---

    // Input validatie bij verlaten van veld (blur) - Toon dan pas individuele fout
    naamInput.on('blur', function() { checkFormValidity(true); });
    aantalInput.on('blur', function() { checkFormValidity(true); });
    emailInput.on('blur', function() { checkFormValidity(true); });
    // Keyup is optioneel, kan soms wat "nerveus" zijn
    // naamInput.on('keyup', function() { checkFormValidity(true); });
    // aantalInput.on('keyup', function() { checkFormValidity(true); });
    // emailInput.on('keyup', function() { checkFormValidity(true); });

    // Her-valideer knop status als de deelnamekeuze verandert (maar toon geen fouten direct)
    $('input[name="keuzeDeelname"]').on('change', function() {
        checkFormValidity(emailInput.val().trim().length > 0); // Toon email fout alleen als er al iets stond
    });

    // Karakterrestricties (keypress) - Voorkomt typen van ongeldige tekens
    naamInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!nameRegex.test(char) && e.which !== 8 && e.which !== 0) e.preventDefault();
    });
    voornaamInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!nameRegex.test(char) && e.which !== 8 && e.which !== 0) e.preventDefault();
    });
    aantalInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (charAantal.indexOf(char) < 0 && e.which !== 8 && e.which !== 0) e.preventDefault();
    });
    telInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (charTel.indexOf(char) < 0 && e.which !== 8 && e.which !== 0) e.preventDefault();
    });
    opmerkingenInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!basicCharsRegex.test(char) && e.which !== 8 && e.which !== 0 && e.which !== 13) e.preventDefault();
    });

    // Focus op velden: Verwijder rode rand direct bij klikken/focus
    $('input[type=text], input[type=email], textarea').on('focus', function() {
        $(this).removeClass(errorBorderClass);
        // Verberg ook direct de span als je begint te typen
        $(this).closest('label').find('span').css('visibility', 'hidden');
    });


    // Klik op de Fake Knop: Valideer opnieuw en scroll naar eerste fout
    fakeSubmitButton.on('click', function() {
        // Forceer validatie én toon fouten bij klik op fake knop
        checkFormValidity(true);

        // Vind het eerste element met een fout
        let firstErrorElement = form.find('.' + errorBorderClass).first();
        if (firstErrorElement.length) {
            scrollToElement(firstErrorElement);
        }
    });


    // --- Formulier Verzenden (Submit Event) ---
    form.on('submit', function(event) {
        event.preventDefault(); // Voorkom standaard browser submit!

        // Laatste validatiecheck, toon fouten indien nodig
        if (!checkFormValidity(true)) {
            // Vind en scroll naar de eerste fout
            let firstErrorElement = form.find('.' + errorBorderClass).first();
            if (firstErrorElement.length) {
                 scrollToElement(firstErrorElement);
            }
            return; // Stop de submit als het formulier niet geldig is
        }

        // === HIER BEGINT STAP 2: Data verzamelen en versturen ===
        console.log("Formulier is geldig en zou nu verzonden worden.");

        // 1. Data verzamelen
        const formData = {
            inschrijvingVoor: $('#top div:nth-child(1)').text().trim(),
            titel: $('#top div:nth-child(2)').text().trim(),
            datum: $('#top div:nth-child(4)').text().trim(),
            plaats: $('#top div:nth-child(5)').text().trim(),
            uur: $('#top div:nth-child(7)').text().trim(),
            adres: $('#top div:nth-child(8)').text().trim(),
            internBestand: $('#filenaam').text().trim(),
            checkAfzender: $('#checkafzender').text().trim(),
            naam: naamInput.val().trim(),
            voornaam: voornaamInput.val().trim(),
            email: emailInput.val().trim(),
            tel: telInput.val().trim(),
            deelname: $('input[name="keuzeDeelname"]:checked').val(),
            aantal: aantalInput.val().trim(),
            attest: attestCheckbox.is(':checked') ? 'ja' : 'nee',
            opmerkingen: opmerkingenInput.val().trim()
        };
        console.log("Te verzenden data:", formData);

        // 2. AJAX call (Voorbeeld - wordt pas echt ingevuld in Stap 2)
        /*
        $.ajax({ // Deze code is NOG STEEDS UITGESCHAKELD voor Stap 1
            type: 'POST',
            url: form.attr('action'), // Haal URL uit form action attribuut (nu '#')
            data: formData,
            beforeSend: function() {
                 // Optioneel: toon een laadindicator
                 submitButton.prop('disabled', true).css('opacity', '0.7');
            },
            success: function(response) {
                console.log("Server response:", response);
                bevestigingTitel.text(formData.titel || "Bevestiging");
                bevestigingMsg.html(response); // Toon server bericht
                bevestigingContainer.addClass('visible');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("AJAX Error:", textStatus, errorThrown);
                const errMsg = 'Inschrijving mislukt!<br>Kon de server niet bereiken.<br>Probeer later opnieuw.';
                bevestigingTitel.text("Fout");
                bevestigingMsg.html(errMsg);
                bevestigingContainer.addClass('visible');
            },
            complete: function() {
                 // Verberg laadindicator
                 submitButton.prop('disabled', false).css('opacity', '1');
            }
        });
        */

        // === TIJDELIJKE ACTIE VOOR STAP 1 ===
        // Simuleer een succesvolle verzending en toon de popup direct
        bevestigingTitel.text(formData.titel || "Inschrijving");
        bevestigingMsg.html("Bedankt voor uw inschrijving!<br>Uw gegevens zijn (normaal gezien) goed ontvangen.<br><br><i>(Dit is een testbericht - de data is nog niet echt verzonden.)</i>");
        bevestigingContainer.addClass('visible'); // Maak popup zichtbaar
    }); // Einde form.on('submit')


    // --- Pop-up Behandeling ---
    function closePopupAndResetForm() {
        bevestigingContainer.removeClass('visible'); // Verberg popup

        // Wacht even met resetten tot de animatie klaar is (optioneel)
        setTimeout(function() {
             // Reset het formulier
             form[0].reset(); // Standaard HTML form reset

             // Verwijder eventuele rode randen/foutmeldingen expliciet
             form.find('.' + errorBorderClass).removeClass(errorBorderClass);
             form.find('label span').css('visibility', 'hidden');

             // Zet de knoppen terug naar de beginstaat ZONDER fouten te tonen
             checkFormValidity(false);
        }, 300); // 300ms is de duur van de fade-out animatie
    }

    // Klik op OK knop in de popup
    bevestigingOkButton.on('click', closePopupAndResetForm);

    // Klik buiten de popup (op de overlay) om ook te sluiten
    bevestigingContainer.on('click', function(event) {
        if (event.target === this) {
            closePopupAndResetForm();
        }
    });


    // --- Initialisatie bij Laden Pagina ---
    function initializeForm() {
        // Zet de knoppen in de juiste beginstaat ZONDER fouten te tonen
        checkFormValidity(false);
    }

    initializeForm(); // Voer de initialisatie uit

}); // Einde $(document).ready