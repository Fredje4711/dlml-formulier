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
             alert("Knop Geklikt - Start"); // Testpunt 0
             console.log("!!! Generate knop listener gestart !!!");
             try { // START try block

                 // --- Testpunt 1: Start config lezen ---
                 console.log("Stap 1: Start config lezen...");
                 const optFysiekDigitaalChecked = document.getElementById('gen-opt-fysiek-digitaal').checked;
                 const optEtenChecked = document.getElementById('gen-opt-eten').checked;
                 const optMoederdagChecked = document.getElementById('gen-opt-moederdag').checked;
                 const optAttestChecked = document.getElementById('gen-opt-attest').checked;
                 // alert("Stap 1a: Checkboxes gelezen"); // Optioneel

                 const config = {
                    pageTitle: document.getElementById('gen-page-title').value,
                    inschrijvingType: document.getElementById('gen-inschrijving-type').value,
                    activityTitle: document.getElementById('gen-activity-title').value,
                    activityDate: document.getElementById('gen-activity-date').value,
                    activityLocation: document.getElementById('gen-activity-location').value,
                    activityTime: document.getElementById('gen-activity-time').value,
                    activityAddress: document.getElementById('gen-activity-address').value,
                    filename: document.getElementById('gen-filename').value,
                    checkstring: document.getElementById('gen-checkstring').value,
                    labelNaam: document.getElementById('gen-label-naam').value,
                    labelVoornaam: document.getElementById('gen-label-voornaam').value,
                    labelEmail: document.getElementById('gen-label-email').value,
                    labelTel: document.getElementById('gen-label-tel').value,
                    labelAantal: document.getElementById('gen-label-aantal').value,
                    labelOpmerkingen: document.getElementById('gen-label-opmerkingen').value,
                    optFysiekDigitaal: optFysiekDigitaalChecked,
                    optEten: optEtenChecked,
                    optMoederdag: optMoederdagChecked,
                    optAttest: optAttestChecked,
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
                    textVerplicht: document.getElementById('gen-text-verplicht').value,
                    textEmailVerplicht: document.getElementById('gen-text-email-verplicht').value,
                    textFakeButton: document.getElementById('gen-text-fake-button').value
                 };
                 if (config.optEten && !config.labelAantalAct) { config.labelAantalAct = config.labelAantal; }
                 // alert("Stap 1b: Config object gemaakt"); // Optioneel

                 // --- Testpunt 2: Config gelezen ---
                 console.log("Stap 2: Config succesvol gelezen.");
                 // console.log(config); // Optioneel

                 // --- Testpunt 3: Start HTML Template ---
                 console.log("Stap 3: Start opbouw HTML template string...");
                 // ==================================================
                 // === VOLLEDIGE outputHTML TEMPLATE STRING START ===
                 // ==================================================
                 let outputHTML = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.pageTitle || 'Inschrijfformulier'}</title>
    <link rel="stylesheet" href="style.css">
    <meta name="Description" content="Inschrijfformulier voor DLML activiteit: ${config.activityTitle || ''}">
    <meta name="Author" content="Diabetes Liga Midden-Limburg">
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
</head>
<body>
    <div id="content">
        <div id="top">
            <div>${config.inschrijvingType || ''}</div>
            <div>${config.activityTitle || ''}</div>
            <div> </div>
            <div>${config.activityDate || ''}</div>
            <div>${config.activityLocation || ''}</div>
            <div> </div>
            <div>${config.activityTime || ''}</div>
            <div>${config.activityAddress || ''}</div>
            <div> </div>
        </div>
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
            <img id="logoDL" alt="Logo DLML" src="../site/image/DLML_ZBT.png"> <!-- Pas pad aan indien nodig! -->
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
    <script src="script.js"></script> <!-- Belangrijk: Zorg dat het ECHTE script.js ook wordt gegenereerd of beschikbaar is -->
</body>
</html>`;
                 // ================================================
                 // === VOLLEDIGE outputHTML TEMPLATE STRING EINDE ===
                 // ================================================
                 // alert("Stap 3a: Basis HTML string klaar"); // Optioneel

                 // --- Testpunt 4: Start Dynamic Sections ---
                 console.log("Stap 4: Start samenstellen dynamische secties...");
                 let dynamicHTML = '';
                 const createListItems = (text) => (text || '').split('\n').map(line => line.trim()).filter(line => line).map(line => `<div>${line.startsWith('•') ? '' : '• '}${line.replace(/^•\s*/, '')}</div>`).join('\n');

                 if (config.optFysiekDigitaal) {
                     console.log("Stap 4a: F/D sectie toevoegen...");
                     // ==================================
                     // === Fysiek/Digitaal HTML START ===
                     // ==================================
                     dynamicHTML += `
                         <div id="deelname">
                             <div>Deelname</div>
                              <div><input class="inln" id="fysiek" type="radio" value="fysiek" name="keuzeDeelname" checked="checked"><label class="inln" for="fysiek">${config.labelFysiek || 'Fysiek'}</label></div>
                              <div><input class="inln" id="digitaal" type="radio" value="digitaal" name="keuzeDeelname"><label class="inln" for="digitaal">${config.labelDigitaal || 'Digitaal'}</label></div>
                             <div class="info-header">Fysieke deelname:</div>
                             ${createListItems(config.textFysiek)}
                             <div class="info-header">Digitale deelname:</div>
                              ${createListItems(config.textDigitaal)}
                         </div>`;
                     // ================================
                     // === Fysiek/Digitaal HTML EINDE ===
                     // ================================
                 }
                 if (config.optMoederdag) {
                     console.log("Stap 4b: Moederdag sectie toevoegen...");
                     dynamicHTML += `\n${config.htmlMoederdag || '<!-- Moederdag HTML ontbreekt -->'}\n`;
                 }
                 // alert("Stap 4c: Dynamic HTML klaar"); // Optioneel

                 // --- Testpunt 5: Vervang Dynamic Sections ---
                 console.log("Stap 5: Vervang %%DYNAMIC_SECTIONS%% placeholder...");
                 outputHTML = outputHTML.replace('%%DYNAMIC_SECTIONS%%', dynamicHTML);
                 // alert("Stap 5a: Placeholder vervangen"); // Optioneel

                 // --- Testpunt 6: Zet HTML in Textarea ---
                 console.log("Stap 6: Zet HTML in output-code textarea...");
                 document.getElementById('output-code').value = outputHTML;
                 alert("Stap 6 Voltooid: Code zou nu in textarea moeten staan!"); // <<< BELANGRIJKE ALERT HIER

                 // --- Testpunt 7: Start Preview Update ---
                 console.log("Stap 7: Start preview update...");
                 const previewArea = document.getElementById('preview-area');
                 try { // Start try voor preview
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
                     let bodyContent = bodyContentMatch && bodyContentMatch[1] ? bodyContentMatch[1] : '<!-- Body inhoud niet gevonden -->';
                     bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '<!-- Script verwijderd voor preview -->');
                     iframeDoc.write(bodyContent);
                     iframeDoc.write('</body></html>');
                     iframeDoc.close();
                     console.log("Stap 7a: Preview succesvol bijgewerkt.");
                     alert("Stap 7 Voltooid: Preview zou nu zichtbaar moeten zijn!"); // <<< TWEEDE BELANGRIJKE ALERT

                 } catch (e) { // Catch specifiek voor preview
                      console.error("Stap 7b: Preview bijwerken mislukt:", e);
                      previewArea.innerHTML = `<p style="color:red;"><i>Preview Fout: ${e.message}.</i></p>`;
                      alert("Fout tijdens bijwerken preview. Code staat wel in textarea.");
                 } // Einde try-catch voor preview

                 console.log("Einde 'Genereer' knop listener succesvol bereikt.");

             } catch (error) { // <<< START catch block voor HELE generatie
                 console.error("!!! Fout tijdens genereren:", error);
                 alert(`!!! Fout opgetreden: ${error.message}. Zie console (F12).`);
                 document.getElementById('output-code').value = `// Fout:\n// ${error}\n// ${error.stack}`; // Toon stack trace voor debuggen
                 document.getElementById('preview-area').innerHTML = `<p style="color: red;">Fout: ${error.message}.</p>`;
             } // <<< EINDE catch block voor HELE generatie
         }); // <<< EINDE btn-generate listener
     } else {
         console.error("Generator Script: Knop 'btn-generate' niet gevonden!");
     }

     // Koppel Kopieer knop listener
     const copyButton = document.getElementById('btn-copy');
     if (copyButton) {
        copyButton.addEventListener('click', function() {
            const outputCode = document.getElementById('output-code');
             if (!outputCode.value || outputCode.value.startsWith('// Fout')) {
                 alert("Genereer eerst de code succesvol!");
                 return;
             }
            outputCode.select();
            try {
                 const successful = document.execCommand('copy');
                 alert(successful ? "Code gekopieerd!" : "Kon niet automatisch kopiëren. Selecteer en kopieer handmatig (Ctrl+C).");
            } catch (err) {
                 alert("Kon niet automatisch kopiëren. Selecteer en kopieer handmatig (Ctrl+C).");
            }
             if (window.getSelection) {window.getSelection().removeAllRanges();}
             else if (document.selection) {document.selection.empty();}
        });
     } else { console.error("Generator Script: Knop 'btn-copy' niet gevonden!"); }

     // Koppel Download knop listener
     const downloadButton = document.getElementById('btn-download');
     if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            const code = document.getElementById('output-code').value;
            if (!code || code.startsWith('// Fout')) {
                alert("Genereer eerst de code succesvol!");
                return;
            }
            const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            const filenameBase = document.getElementById('gen-filename')?.value?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'formulier';
            link.download = filenameBase + '_index.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        });
     } else { console.error("Generator Script: Knop 'btn-download' niet gevonden!"); }

     console.log("Generator Script: Initialisatie script voltooid.");

// EINDE VAN DOMContentLoaded listener
});