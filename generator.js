// === generator.js ===

// Functie definitie BOVENAAN
function toggleSubOptions(divId, show) {
    try {
        const subOptionsDiv = document.getElementById(divId);
        if (subOptionsDiv) {
            subOptionsDiv.style.display = show ? 'block' : 'none';
        }
    } catch(e) {
         console.error(`[toggleSubOptions] Fout:`, e);
    }
}

// Wacht tot de DOM volledig geladen is
document.addEventListener('DOMContentLoaded', () => {
     console.log("Generator Script: DOM geladen, initialisatie...");

     // Initialiseer sub-opties EN voeg listeners toe
     try {
         function setupOptionToggle(checkboxId, subDivId) {
             const checkbox = document.getElementById(checkboxId);
             if (!checkbox) { return; }
             const subDiv = document.getElementById(subDivId);
             if (!subDiv) { return; }
             toggleSubOptions(subDivId, checkbox.checked);
             checkbox.addEventListener('change', function() {
                 toggleSubOptions(subDivId, this.checked);
             });
         }
         setupOptionToggle('gen-opt-fysiek-digitaal', 'sub-fysiek-digitaal');
         setupOptionToggle('gen-opt-eten', 'sub-eten');
         setupOptionToggle('gen-opt-moederdag', 'sub-moederdag');
         setupOptionToggle('gen-opt-attest', 'sub-attest');
         console.log("Generator Script: Setup toggles voltooid.");

     } catch (error) {
         console.error("Generator Script: Fout bij initialiseren sub-opties:", error);
     }

     // Koppel de generate knop listener
     const generateButton = document.getElementById('btn-generate');
     if (generateButton) {
         generateButton.addEventListener('click', function() { // START generate listener
             console.log("Generator Script: Start generatie...");
             try { // START try block
                 // --- 1. Lees Checkbox statussen EERST ---
                 const optFysiekDigitaalChecked = document.getElementById('gen-opt-fysiek-digitaal').checked;
                 const optEtenChecked = document.getElementById('gen-opt-eten').checked;
                 const optMoederdagChecked = document.getElementById('gen-opt-moederdag').checked;
                 const optAttestChecked = document.getElementById('gen-opt-attest').checked;

                 // --- 2. Lees alle andere waarden en bouw config object ---
                 const config = {
                    // Sectie 1
                    inschrijvingTitel: document.getElementById('gen-inschrijving-titel').value,
                    subtypeTitel: document.getElementById('gen-subtype-titel').value,
                    activityNaam: document.getElementById('gen-activity-naam').value,
                    activityDatum: document.getElementById('gen-activity-datum').value,
                    activityUur: document.getElementById('gen-activity-uur').value,
                    activityPlaats: document.getElementById('gen-activity-plaats').value,
                    activityAdres: document.getElementById('gen-activity-adres').value,
                    pageTitle: document.getElementById('gen-page-title').value,
                    filename: document.getElementById('gen-filename').value,
                    checkstring: document.getElementById('gen-checkstring').value,
                    // Sectie 2
                    labelNaam: document.getElementById('gen-label-naam').value,
                    labelVoornaam: document.getElementById('gen-label-voornaam').value,
                    labelEmail: document.getElementById('gen-label-email').value,
                    labelTel: document.getElementById('gen-label-tel').value,
                    labelAantal: document.getElementById('gen-label-aantal').value,
                    labelOpmerkingen: document.getElementById('gen-label-opmerkingen').value,
                    // Sectie 3 Checkboxes
                    optFysiekDigitaal: optFysiekDigitaalChecked,
                    optEten: optEtenChecked,
                    optMoederdag: optMoederdagChecked,
                    optAttest: optAttestChecked,
                    // Sectie 3 Sub-opties
                    labelFysiek: optFysiekDigitaalChecked ? document.getElementById('gen-label-fysiek').value : '',
                    labelDigitaal: optFysiekDigitaalChecked ? document.getElementById('gen-label-digitaal').value : '',
                    textFysiek: optFysiekDigitaalChecked ? document.getElementById('gen-text-fysiek').value : '',
                    textDigitaal: optFysiekDigitaalChecked ? document.getElementById('gen-text-digitaal').value : '',
                    labelAantalAct: optEtenChecked ? document.getElementById('gen-label-aantal-act').value : '',
                    textAantalAct: optEtenChecked ? document.getElementById('gen-text-aantal-act').value : '',
                    labelEten: optEtenChecked ? document.getElementById('gen-label-eten').value : '',
                    textEten: optEtenChecked ? document.getElementById('gen-text-eten').value : '',
                    htmlMoederdag: optMoederdagChecked ? document.getElementById('gen-html-moederdag').value : '',
                    textAttest: optAttestChecked ? document.getElementById('gen-text-attest').value : '',
                    // Sectie 4
                    textVerplicht: document.getElementById('gen-text-verplicht').value,
                    textEmailVerplicht: document.getElementById('gen-text-email-verplicht').value,
                    textFakeButton: document.getElementById('gen-text-fake-button').value
                 };
                 if (config.optEten && !config.labelAantalAct) { config.labelAantalAct = config.labelAantal; }
                 console.log("Generator Script: Configuratie gelezen.");

                 // --- 3. Basis HTML Template String (met VEREENVOUDIGDE Flexbox Header!) ---
                 let outputHTML = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.pageTitle || 'Inschrijfformulier'}</title>
    <link rel="stylesheet" href="style.css">
    <meta name="Description" content="Inschrijfformulier voor DLML activiteit: ${config.activityNaam || ''}">
    <meta name="Author" content="Diabetes Liga Midden-Limburg">
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
    <style>
        /* Extra CSS specifiek voor de VEREENVOUDIGDE header layout (Flexbox) */
        #top-test {
            background-color: #663ab7; /* Paars */
            color: white;
            padding: 15px; /* Padding rondom */
            display: flex;
            flex-wrap: wrap; /* Wrap op kleinere schermen */
            justify-content: space-between; /* Ruimte tussen links/midden/rechts */
            align-items: flex-start; /* Begin bovenaan, laat items zelf hoogte bepalen */
            font-family: 'Roboto', sans-serif;
            text-align: center; /* Standaard centreren */
            box-sizing: border-box;
            margin-bottom: -1px; /* Overlap met border myForm */
        }
        #top-test-center { /* Middelste kolom voor titels */
             flex-grow: 1; /* Neemt beschikbare ruimte */
             padding: 0 10px; /* Ruimte naast titels */
             margin-bottom: 10px; /* Ruimte onder titels */
        }
        #top-title-main { font-size: 28px; font-weight: bold; line-height: 1.1; margin-bottom: 5px; }
        #top-title-main span { font-size: 0.8em; font-weight: normal; margin-left: 10px; }
        #top-title-activity { font-size: 22px; line-height: 1.1; }

        #top-test-left, #top-test-right { /* Linker en rechter kolommen */
            font-size: 16px;
            line-height: 1.4; /* Belangrijk voor hoogte */
            padding-top: 5px; /* Kleine ruimte boven tekst */
             min-width: 200px; /* Voorkom te smal worden */
        }
        #top-test-left { text-align: left; }
        #top-test-right { text-align: right; }

         /* Responsive aanpassing */
         @media (max-width: 700px) {
             #top-test { justify-content: center; } /* Centreer alles op mobiel */
             #top-test-left, #top-test-right, #top-test-center {
                  width: 100%;
                  text-align: center !important; /* Forceer centreren */
                  min-width: unset;
             }
              #top-test-left { order: 2; } /* Datum/tijd na titels */
              #top-test-center { order: 1; } /* Titels eerst */
              #top-test-right { order: 3; } /* Locatie/adres laatst */
         }
    </style>
</head>
<body>
    <div id="content">
        <!-- VEREENVOUDIGDE HEADER HTML -->
        <div id="top-test">
             <div id="top-test-left">
                 <div>${config.activityDatum || ''}</div>
                 <div>${config.activityUur || ''}</div>
             </div>
             <div id="top-test-center">
                 <div id="top-title-main">${config.inschrijvingTitel || 'Inschrijving'} ${config.subtypeTitel ? `<span>${config.subtypeTitel}</span>` : ''}</div>
                 <div id="top-title-activity">${config.activityNaam || ''}</div>
            </div>
             <div id="top-test-right">
                 <div>${config.activityPlaats || ''}</div>
                 <div>${config.activityAdres || ''}</div>
             </div>
        </div>
        <!-- EINDE VEREENVOUDIGDE HEADER HTML -->

        <div id="filenaam" style="display:none;">${config.filename || ''}</div>
        <div id="checkafzender" style="display:none;">${config.checkstring || ''}</div>
        <form id="myForm" action="#" method="post" accept-charset="utf-8">
            <label class="lnfd" for="naam">
                ${config.labelNaam || 'Naam (*)'}
                <span> gelieve uw naam in te vullen! </span><br>
                <input type="text" id="naam" name="naam" size="30" placeholder="Naam">
            </label>
            <label class="lnfd" for="voornaam">
                ${config.labelVoornaam || 'Voornaam'}<br>
                <input type="text" id="voornaam" name="voornaam" size="25" placeholder="Voornaam">
            </label>
            <label for="email">
                 ${config.labelEmail || 'E-mail (**)'}
                 <span> gelieve uw e-mail te noteren! </span><br>
                 <input class="lnfd" type="text" id="email" name="email" size="40" placeholder="@emaildomein.be">
            </label>
            <label for="tel">
                 ${config.labelTel || 'Tel/GSM'}<br>
                 <input class="lnfd" type="text" id="tel" name="tel" size="25" placeholder="Telefoonnummer">
            </label>
            %%DYNAMIC_SECTIONS%%
             ${!config.optMoederdag ? `
             <label for="aantal">
                  ${config.optEten ? (config.labelAantalAct || config.labelAantal) : (config.labelAantal || 'Aantal deelnemers (*)')}
                  <span> gelieve het aantal deelnemers te vermelden! </span><br>
                  <input class="lnfd" type="text" id="aantal" name="aantal" size="8" value="" placeholder="Aantal">
                  ${config.optEten && config.textAantalAct ? `<span style="display: block; font-weight: normal; font-size: 14px; margin-top: -10px; margin-bottom: 10px;">${config.textAantalAct.replace(/\n/g, '<br>')}</span>` : ''}
             </label>
             ` : ''}
             ${config.optEten ? `
             <label for="eten_input">
                 ${config.labelEten || 'Extra optie'}<br>
                 <input class="lnfd" type="text" id="eten_input" name="eten_details" size="30" placeholder="Aantal of details">
                 ${config.textEten ? `<span style="display: block; font-weight: normal; font-size: 14px; margin-top: -10px; margin-bottom: 10px;">${config.textEten.replace(/\n/g, '<br>')}</span>` : ''}
             </label>
             ` : ''}
            ${config.optAttest ? `
            <label class="lnfd" for="attest">
                <input id="attest" name="attest" type="checkbox" value="ja"> ${config.textAttest || 'Wenst een deelname-attest'}
            </label>
            ` : ''}
            <label for="opmerkingen">${config.labelOpmerkingen || 'Opmerkingen'}</label>
            <textarea class="lnfd" id="opmerkingen" name="opmerkingen" cols="35" rows="6"></textarea>
            <button class="lnfd" id="btnSubmit" type="submit">Inschrijven</button>
            <button id="fakeBtnSubmit" type="button">Inschrijven</button>
            <div class="lnfd" id="txtFakeBtnSubmit">${config.textFakeButton || 'Gelieve alle verplichte velden in te vullen'}</div>
            <div id="txtVerplicht">
                ${config.textVerplicht || '(*) velden zijn verplicht'}<br>
                 ${config.optFysiekDigitaal ? (config.textEmailVerplicht || '(**) verplicht voor digitale deelname') + '<br>' : ''}
            </div>
            <div style="width:100%; height:1px; margin-bottom: 0;"> </div>
            <img id="logoDL" alt="Logo DLML" src="logo.png"> <!-- Pad naar logo.png -->
            <div id="containerBevestiging">
                <div id="bevestiging">
                    <div id="bevestigingTitel"> </div>
                    <div id="bevestigingMsg">Inschrijving wordt verwerkt...</div>
                    <div id="btnOK">Ok</div>
                </div>
            </div>
        </form>
        <div style="width:100%; height:25px;"> </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="script.js"></script> <!-- Het ECHTE script.js -->
</body>
</html>`;

                         // --- 4. Voeg Dynamische Secties in ---
                         let dynamicHTML = '';
                         const createListItems = (text) => (text || '').split('\n').map(line => line.trim()).filter(line => line).map(line => `<div>${line.startsWith('•') ? '' : '• '}${line.replace(/^•\s*/, '')}</div>`).join('\n');

                         if (config.optFysiekDigitaal) {
                            dynamicHTML += `...`; // F/D HTML blok (hetzelfde als voorheen)
                         }
                         if (config.optMoederdag) {
                             dynamicHTML += `\n${config.htmlMoederdag || '<!-- Moederdag HTML ontbreekt -->'}\n`;
                         }
                         outputHTML = outputHTML.replace('%%DYNAMIC_SECTIONS%%', dynamicHTML);

                         // --- 5. Zet de volledige HTML in de textarea ---
                         document.getElementById('output-code').value = outputHTML;
                         console.log("Generator Script: HTML generatie voltooid.");

                         // --- 6. Update Preview (Vereenvoudigd) ---
                         const previewArea = document.getElementById('preview-area');
                         try {
                              previewArea.innerHTML = '<iframe id="preview-iframe" style="width: 100%; height: 600px; border: none;" title="Formulier Preview"></iframe>';
                              const iframe = document.getElementById('preview-iframe');
                              if (!iframe) throw new Error("Kon preview iframe niet vinden.");
                              const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                              if (!iframeDoc) throw new Error("Kon geen toegang krijgen tot iframe document.");
                              iframeDoc.open();
                              iframeDoc.write('<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8">');
                              iframeDoc.write(`<link rel="stylesheet" href="style.css?t=${Date.now()}">`);
                              iframeDoc.write("<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>");
                              iframeDoc.write('</head><body>');
                              const bodyContentMatch = outputHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                              let bodyContent = bodyContentMatch && bodyContentMatch[1] ? bodyContentMatch[1] : '';
                              bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, ''); // Verwijder scripts
                              iframeDoc.write(bodyContent);
                              iframeDoc.write('</body></html>');
                              iframeDoc.close();
                              console.log("Generator Script: Preview bijgewerkt (zonder scripts).");
                         } catch (e) {
                              console.error("Generator Script: Preview bijwerken mislukt:", e);
                              previewArea.innerHTML = `<p style="color:red;"><i>Preview kon niet worden geladen: ${e.message}.</i></p>`;
                         }
                     } catch (error) {
                         console.error("Generator Script: Fout tijdens genereren:", error);
                         alert(`Fout tijdens genereren: ${error.message}.`);
                         document.getElementById('output-code').value = `// Fout:\n// ${error}\n// ${error.stack}`;
                         document.getElementById('preview-area').innerHTML = `<p style="color: red;">Fout: ${error.message}.</p>`;
                     } // EINDE try block generate
                 }); // EINDE btn-generate listener
             } else { console.error("Generator Script: Knop 'btn-generate' niet gevonden!"); }

             // Koppel Kopieer knop listener
             const copyButton = document.getElementById('btn-copy');
             if (copyButton) {
                copyButton.addEventListener('click', function() { /* ... kopieer logica ... */ });
             } else { console.error("Generator Script: Knop 'btn-copy' niet gevonden!"); }

             // Koppel Download knop listener
             const downloadButton = document.getElementById('btn-download');
             if (downloadButton) {
                downloadButton.addEventListener('click', function() { /* ... download logica ... */ });
             } else { console.error("Generator Script: Knop 'btn-download' niet gevonden!"); }

             console.log("Generator Script: Initialisatie script voltooid.");

    // EINDE VAN DOMContentLoaded listener
    });