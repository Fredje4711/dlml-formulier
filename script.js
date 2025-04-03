// Wacht tot het hele HTML document geladen is voordat we script uitvoeren
$(document).ready(function() {

    // --- Configuratie en Selectors ---
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
    const errorBorderClass = 'error-border';

    // --- Regex en Karakter Sets ---
    const charAantal = '0123456789';
    const charTel = '0123456789 ,.:/+';
    const nameRegex = /^[a-zA-Z éèëàùçÉÈËÀÙÇ'\s-]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const basicCharsRegex = /^[a-zA-Z0-9 éèëàùçÉÈËÀÙÇ'@.\/_,:;?!€$%*()\s-]+$/;

    // --- Functie: Input Valideren ---
    function validateInput(inputElement, isValid, showErrors, errorMessageSelector = 'span') {
        const label = inputElement.closest('label');
        const errorMessage = label.find(errorMessageSelector);
        if (isValid) {
            inputElement.removeClass(errorBorderClass);
            if (errorMessage.length) errorMessage.css('visibility', 'hidden');
            return true;
        } else {
            if (showErrors) {
                inputElement.addClass(errorBorderClass);
                if (errorMessage.length) errorMessage.css('visibility', 'visible');
            }
            return false;
        }
    }

     // --- Functie: Scrollen ---
    function scrollToElement(element) {
        if (!element || element.length === 0) return;
        $('html, body').animate({ scrollTop: element.offset().top - 80 }, 500);
    }

    // --- Functie: Formulier Check & Knop Status ---
    function checkFormValidity(showErrors = true) {
        let isFormValid = true;
        const isNaamValid = naamInput.val().trim().length > 0;
        validateInput(naamInput, isNaamValid, showErrors);
        if (!isNaamValid) isFormValid = false;

        const aantalValue = aantalInput.val().trim();
        const isAantalValid = aantalValue.length > 0 && /^\d+$/.test(aantalValue) && parseInt(aantalValue, 10) > 0;
        validateInput(aantalInput, isAantalValid, showErrors, 'span');
        if (!isAantalValid) isFormValid = false;

        const emailValue = emailInput.val().trim();
        const isDigitaal = digitaalRadio.is(':checked');
        let isEmailFormatValid = (emailValue.length === 0) || emailRegex.test(emailValue); // Format ok als leeg, of indien ingevuld, correct format
        let isEmailRequirementMet = !isDigitaal || (isDigitaal && emailValue.length > 0); // Verplichting voldaan als niet digitaal, of indien digitaal, ingevuld
        const isEmailOverallValid = isEmailFormatValid && isEmailRequirementMet;
        validateInput(emailInput, isEmailOverallValid, showErrors);
        if (!isEmailOverallValid) isFormValid = false;

        emailInput.attr('placeholder', isDigitaal ? '@emaildomein.be' : ' ');

        // Update knop status
        if (isFormValid) {
            submitButton.css('display', 'block');
            fakeSubmitButton.css('display', 'none');
            fakeSubmitText.css('display', 'none');
        } else {
            submitButton.css('display', 'none');
            fakeSubmitButton.css('display', 'block');
            fakeSubmitText.css('display', showErrors ? 'block' : 'none');
        }
        return isFormValid;
    }

    // --- Event Handlers ---
    naamInput.on('blur', function() { checkFormValidity(true); });
    aantalInput.on('blur', function() { checkFormValidity(true); });
    emailInput.on('blur', function() { checkFormValidity(true); });
    $('input[name="keuzeDeelname"]').on('change', function() { checkFormValidity(emailInput.val().trim().length > 0); });

    naamInput.on('keypress', function(e) { const c=String.fromCharCode(e.which); if (!nameRegex.test(c) && e.which!==8 && e.which!==0) e.preventDefault(); });
    voornaamInput.on('keypress', function(e) { const c=String.fromCharCode(e.which); if (!nameRegex.test(c) && e.which!==8 && e.which!==0) e.preventDefault(); });
    aantalInput.on('keypress', function(e) { const c=String.fromCharCode(e.which); if (charAantal.indexOf(c) < 0 && e.which!==8 && e.which!==0) e.preventDefault(); });
    telInput.on('keypress', function(e) { const c=String.fromCharCode(e.which); if (charTel.indexOf(c) < 0 && e.which!==8 && e.which!==0) e.preventDefault(); });
    opmerkingenInput.on('keypress', function(e) { const c=String.fromCharCode(e.which); if (!basicCharsRegex.test(c) && e.which!==8 && e.which!==0 && e.which!==13) e.preventDefault(); });

    $('input[type=text], input[type=email], textarea').on('focus', function() {
        $(this).removeClass(errorBorderClass);
        $(this).closest('label').find('span').css('visibility', 'hidden');
    });

    fakeSubmitButton.on('click', function() {
        checkFormValidity(true);
        let firstErrorElement = form.find('.' + errorBorderClass).first();
        if (firstErrorElement.length) scrollToElement(firstErrorElement);
    });

    // --- Formulier Verzenden (Submit Event met FormSubmit) ---
    form.on('submit', function(event) {
        event.preventDefault(); // Houd AJAX actief!

        if (!checkFormValidity(true)) {
            let firstErrorElement = form.find('.' + errorBorderClass).first();
            if (firstErrorElement.length) scrollToElement(firstErrorElement);
            return;
        }

        console.log("Formulier is geldig, data verzamelen...");

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
            voornaam: voornaamInput.val().trim() || '-', // Stuur '-' als leeg
            email: emailInput.val().trim(),
            tel: telInput.val().trim() || '-', // Stuur '-' als leeg
            deelname: $('input[name="keuzeDeelname"]:checked').val(),
            aantal: aantalInput.val().trim(),
            attest: attestCheckbox.is(':checked') ? 'ja' : 'nee',
            opmerkingen: opmerkingenInput.val().trim() || '-', // Stuur '-' als leeg
            // FormSubmit specifieke velden
            _subject: `DLML Inschrijving: ${$('#top div:nth-child(2)').text().trim()}`, // Onderwerp e-mail
            // _next: "https://jouwwebsite.be/bedankt.html", // Optionele bedanktpagina
        };
        console.log("Te verzenden data naar FormSubmit:", formData);

        // 2. AJAX call naar FormSubmit
        $.ajax({
            method: 'POST',
            // ===>>> HIER STAAT JOUW E-MAILADRES <<<===
            url: 'https://formsubmit.co/ajax/diabetesligamiddenlimburg2024@gmail.com',
            dataType: 'json',
            accepts: 'application/json',
            data: formData,
            beforeSend: function() {
                 submitButton.prop('disabled', true).css('opacity', '0.6');
                 console.log("Verzenden naar FormSubmit...");
            },
            success: function(response) {
                console.log("FormSubmit Success:", response);
                bevestigingTitel.text("Inschrijving succesvol");
                bevestigingMsg.html("Bedankt voor uw inschrijving!<br>De gegevens zijn succesvol verzonden.");
                bevestigingContainer.addClass('visible');
                // Formulier wordt gereset via de OK knop handler
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("FormSubmit Error:", textStatus, errorThrown, jqXHR.responseText);
                let errorMsg = 'Het verzenden is mislukt.<br>';
                try { let r = JSON.parse(jqXHR.responseText); errorMsg += r.message || 'Controleer de gegevens.'; }
                catch (e) { errorMsg += 'Serverfout. Probeer later opnieuw.'; }
                bevestigingTitel.text("Fout bij verzenden");
                bevestigingMsg.html(errorMsg);
                bevestigingContainer.addClass('visible');
            },
            complete: function() {
                 submitButton.prop('disabled', false).css('opacity', '1');
                 console.log("FormSubmit request voltooid.");
            }
        });
    }); // Einde form.on('submit')


    // --- Pop-up Behandeling ---
    function closePopupAndResetForm() {
        bevestigingContainer.removeClass('visible');
        setTimeout(function() {
             form[0].reset();
             form.find('.' + errorBorderClass).removeClass(errorBorderClass);
             form.find('label span').css('visibility', 'hidden');
             checkFormValidity(false); // Update knop status ZONDER fouten te tonen
        }, 300);
    }
    bevestigingOkButton.on('click', closePopupAndResetForm);
    bevestigingContainer.on('click', function(e) { if (e.target === this) closePopupAndResetForm(); });

    // --- Initialisatie ---
    function initializeForm() {
        checkFormValidity(false); // Zet knoppen correct bij laden ZONDER fouten te tonen
    }
    initializeForm();

}); // Einde $(document).ready