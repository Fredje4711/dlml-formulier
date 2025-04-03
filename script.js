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

    // Toegestane karakters (uit origineel)
    const charAantal = '0123456789';
    const charTel = '0123456789 ,.:/+';
    const nameRegex = /^[a-zA-Z0-9 éèëàùçÉÈËÀÙÇ'\s-]+$/; // Iets uitgebreider voor namen
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Standaard email check
    const basicCharsRegex = /^[a-zA-Z0-9 éèëàùçÉÈËÀÙÇ'@.\/\s-]+$/; // Algemene check voor bv opmerkingen

    // --- Functie: Input Valideren en Foutmelding Tonen/Verbergen ---
    function validateInput(inputElement, isValid, errorMessageSelector = 'span') {
        const label = inputElement.closest('label'); // Vind het bijbehorende label
        const errorMessage = label.find(errorMessageSelector);

        if (isValid) {
            inputElement.removeClass(errorBorderClass);
            if (errorMessage.length) {
                errorMessage.css('visibility', 'hidden');
            }
            return true;
        } else {
            inputElement.addClass(errorBorderClass);
            if (errorMessage.length) {
                errorMessage.css('visibility', 'visible');
            }
            // Focus op het eerste invalide veld kan hier eventueel ook
            return false;
        }
    }

     // --- Functie: Scrollen naar een element ---
     // Verbeterde versie die ook rekening houdt met vaste headers etc.
    function scrollToElement(element) {
        if (!element || element.length === 0) return;

        $('html, body').animate({
            scrollTop: element.offset().top - 80 // 80px ruimte boven het element
        }, 500);
    }


    // --- Functie: Formulier Valideren & Knop Status Instellen ---
    function checkFormValidity() {
        let isFormValid = true;

        // 1. Valideer Naam (verplicht)
        const isNaamValid = naamInput.val().trim().length > 0;
        validateInput(naamInput, isNaamValid);
        if (!isNaamValid) isFormValid = false;

        // 2. Valideer Aantal (verplicht & numeriek)
        const aantalValue = aantalInput.val().trim();
        const isAantalValid = aantalValue.length > 0 && /^\d+$/.test(aantalValue) && parseInt(aantalValue, 10) > 0;
        validateInput(aantalInput, isAantalValid, 'span[style*="left:10px"]'); // Specifieke span selecteren
        if (!isAantalValid) isFormValid = false;

        // 3. Valideer E-mail (alleen verplicht bij digitaal, maar check format altijd indien ingevuld)
        const emailValue = emailInput.val().trim();
        const isDigitaal = digitaalRadio.is(':checked');
        let isEmailValid = true;

        if (isDigitaal) {
             // Verplicht bij digitaal EN moet geldig format zijn
             isEmailValid = emailValue.length > 0 && emailRegex.test(emailValue);
             emailInput.attr('placeholder', '@emaildomein.be'); // Zorg dat placeholder klopt
        } else {
             // Niet verplicht, maar ALS ingevuld, moet format geldig zijn
             if (emailValue.length > 0) {
                 isEmailValid = emailRegex.test(emailValue);
             } else {
                 isEmailValid = true; // Leeg is ok als niet digitaal
             }
             emailInput.attr('placeholder', ' '); // Lege placeholder
        }
        validateInput(emailInput, isEmailValid);
        if (!isEmailValid) isFormValid = false; // Ongeldig format is altijd fout

        // Update knop status
        if (isFormValid) {
            submitButton.css('display', 'block'); // Toon echte knop
            fakeSubmitButton.css('display', 'none'); // Verberg nep knop
            fakeSubmitText.css('display', 'none'); // Verberg tekst
        } else {
            submitButton.css('display', 'none'); // Verberg echte knop
            fakeSubmitButton.css('display', 'block'); // Toon nep knop
            fakeSubmitText.css('display', 'block'); // Toon tekst
        }

        return isFormValid; // Geeft true/false terug
    }

    // --- Event Handlers ---

    // Input validatie bij verlaten van veld (blur) en bij typen (keyup)
    naamInput.on('blur keyup', function() { checkFormValidity(); });
    aantalInput.on('blur keyup', function() { checkFormValidity(); });
    emailInput.on('blur keyup', function() { checkFormValidity(); });

    // Her-valideer als de deelnamekeuze verandert
    $('input[name="keuzeDeelname"]').on('change', function() {
        checkFormValidity();
    });

    // Karakterrestricties (keypress) - Voorkomt typen van ongeldige tekens
    naamInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!nameRegex.test(char) && e.which !== 8 /* backspace */ && e.which !== 0 /* control keys */) {
            e.preventDefault();
        }
    });
    voornaamInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (!nameRegex.test(char) && e.which !== 8 && e.which !== 0) {
            e.preventDefault();
        }
    });
    aantalInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (charAantal.indexOf(char) < 0 && e.which !== 8 && e.which !== 0) {
            e.preventDefault();
        }
    });
    telInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        if (charTel.indexOf(char) < 0 && e.which !== 8 && e.which !== 0) {
            e.preventDefault();
        }
    });
    // E-mail: Basis check, maar laat meeste tekens toe, validatie gebeurt achteraf
    // Opmerkingen: Basis check
    opmerkingenInput.on('keypress', function(e) {
        const char = String.fromCharCode(e.which);
        // Sta ook Enter toe (keycode 13)
        if (!basicCharsRegex.test(char) && e.which !== 8 && e.which !== 0 && e.which !== 13) {
             e.preventDefault();
        }
    });


    // Hoofdletter functie (keyup) - Uit origineel, kan eenvoudiger
    function capitalizeOnChange(inputElement) {
        let originalValue = inputElement.val();
        let cursorPosition = inputElement.prop("selectionStart"); // Huidige cursorpositie opslaan
        let newValue = originalValue.replace(/(?:^|\s|-)\S/g, function(a) { return a.toUpperCase(); });
        // Zet alleen om naar hoofdletters na spatie of aan begin
        // Verfijning nodig om ongewenste hoofdletters te voorkomen bij backspace etc.
        // Voor nu houden we het simpel, of we laten het weg.

         // inputElement.val(newValue);
         // inputElement.prop("selectionStart", cursorPosition); // Probeer cursorpositie te herstellen
         // inputElement.prop("selectionEnd", cursorPosition);
    }
    // We passen dit niet meer automatisch toe, kan irritant zijn.
    // naamInput.on('keyup', function() { capitalizeOnChange($(this)); });
    // voornaamInput.on('keyup', function() { capitalizeOnChange($(this)); });


    // Focus op velden: Verwijder rode rand direct bij klikken/focus
    $('input[type=text], input[type=email], textarea').on('focus', function() {
        $(this).removeClass(errorBorderClass);
        // Optioneel: verberg ook de span direct
        // $(this).closest('label').find('span').css('visibility', 'hidden');
    });


    // Klik op de Fake Knop: Valideer opnieuw en scroll naar eerste fout
    fakeSubmitButton.on('click', function() {
        // Forceer validatie van alle velden
         checkFormValidity(); // Zorgt dat alle rode randen/teksten correct zijn

        // Vind het eerste element met een fout
        let firstErrorElement = null;
        if (naamInput.hasClass(errorBorderClass)) {
            firstErrorElement = naamInput;
        } else if (aantalInput.hasClass(errorBorderClass)) {
            firstErrorElement = aantalInput;
        } else if (emailInput.hasClass(errorBorderClass)) {
            firstErrorElement = emailInput;
        }
        // Voeg hier andere verplichte velden toe indien nodig

        if (firstErrorElement) {
            scrollToElement(firstErrorElement);
        }
    });


    // --- Formulier Verzenden (Submit Event) ---
    form.on('submit', function(event) {
        event.preventDefault(); // Voorkom standaard browser submit!

        // Laatste validatiecheck
        if (!checkFormValidity()) {
            // Vind en scroll naar de eerste fout
            let firstErrorElement = form.find('.' + errorBorderClass).first();
            if (firstErrorElement.length) {
                 scrollToElement(firstErrorElement);
            }
            return; // Stop de submit als het formulier niet geldig is
        }

        // === HIER BEGINT STAP 2: Data verzamelen en versturen ===
        // Voor nu tonen we alleen de bevestiging en loggen we de data in de console

        console.log("Formulier is geldig en zou nu verzonden worden.");

        // 1. Data verzamelen
        const formData = {
            // Details van de activiteit (uit de #top div)
            inschrijvingVoor: $('#top div:nth-child(1)').text().trim(),
            titel: $('#top div:nth-child(2)').text().trim(),
            datum: $('#top div:nth-child(4)').text().trim(),
            plaats: $('#top div:nth-child(5)').text().trim(),
            uur: $('#top div:nth-child(7)').text().trim(),
            adres: $('#top div:nth-child(8)').text().trim(),
            // Verborgen data
            internBestand: $('#filenaam').text().trim(),
            checkAfzender: $('#checkafzender').text().trim(),
            // Formulier velden
            naam: naamInput.val().trim(),
            voornaam: voornaamInput.val().trim(),
            email: emailInput.val().trim(),
            tel: telInput.val().trim(),
            deelname: $('input[name="keuzeDeelname"]:checked').val(),
            aantal: aantalInput.val().trim(),
            attest: attestCheckbox.is(':checked') ? 'ja' : 'nee', // Stuur 'ja' of 'nee'
            opmerkingen: opmerkingenInput.val().trim()
        };

        // Log de verzamelde data naar de browser console (voor testen)
        console.log("Te verzenden data:", formData);

        // 2. AJAX call (Wordt ingevuld in Stap 2, afhankelijk van de gekozen backend)
        // Voorbeeld met $.ajax zoals in origineel, maar nu uitgeschakeld:
        /*
        $.ajax({
            type: 'POST',
            url: form.attr('action'), // Haal URL uit form action attribuut
            data: formData,
            success: function(response) {
                console.log("Server response:", response);
                // Toon succes bericht in popup
                bevestigingTitel.text(formData.titel); // Gebruik activiteit titel
                bevestigingMsg.html(response); // Toon server bericht (kan HTML bevatten)
                bevestigingContainer.addClass('visible'); // Maak popup zichtbaar
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("AJAX Error:", textStatus, errorThrown);
                // Toon foutbericht in popup
                const errMsg = 'Inschrijving mislukt!<br>Kon de server niet bereiken.<br>Probeer later opnieuw.';
                bevestigingTitel.text("Fout");
                bevestigingMsg.html(errMsg);
                bevestigingContainer.addClass('visible'); // Maak popup zichtbaar
            },
            complete: function() {
                // Code die altijd draait (na success of error)
                // Bijvoorbeeld knoppen verbergen (maar dat gebeurt al bij validity check)
                console.log("AJAX request voltooid.");
            }
        });
        */

        // === TIJDELIJKE ACTIE VOOR STAP 1 ===
        // Simuleer een succesvolle verzending en toon de popup direct
        bevestigingTitel.text(formData.titel || "Inschrijving"); // Gebruik titel of generieke tekst
        bevestigingMsg.html("Bedankt voor uw inschrijving!<br>Uw gegevens zijn (normaal gezien) goed ontvangen.<br><br><i>(Dit is een testbericht - de data is nog niet echt verzonden.)</i>"); // Tijdelijk bericht
        bevestigingContainer.addClass('visible'); // Maak popup zichtbaar

    }); // Einde form.on('submit')


    // --- Pop-up Behandeling ---

    // Klik op OK knop in de popup
    bevestigingOkButton.on('click', function() {
        bevestigingContainer.removeClass('visible'); // Verberg popup

        // Reset het formulier
        form[0].reset(); // Standaard HTML form reset (maakt velden leeg, zet radio/checkbox naar default)

        // Verwijder eventuele rode randen/foutmeldingen
        form.find('.' + errorBorderClass).removeClass(errorBorderClass);
        form.find('label span').css('visibility', 'hidden');

        // Zet de knoppen terug naar de beginstaat
        checkFormValidity(); // Dit controleert het (nu lege) formulier en toont de fake knop
    });

    // Klik buiten de popup (op de overlay) om ook te sluiten
    bevestigingContainer.on('click', function(event) {
        // Sluit alleen als direct op de container (overlay) geklikt wordt,
        // niet op de #bevestiging box zelf.
        if (event.target === this) {
            bevestigingOkButton.trigger('click'); // Simuleer klik op OK knop
        }
    });


    // --- Initialisatie bij Laden Pagina ---
    function initializeForm() {
        // Zet de titel van de popup alvast klaar (kan ook in submit event)
        // bevestigingTitel.text($('#top div:nth-child(2)').text().trim() || "Bevestiging");

        // Zorg dat de knoppen de juiste beginstatus hebben
        checkFormValidity();
    }

    initializeForm(); // Voer de initialisatie uit

}); // Einde $(document).ready