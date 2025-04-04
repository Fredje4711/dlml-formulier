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
                 console.log("Generator Script: Configuratie gelezen.");

                 // --- 3. Basis HTML Template String ---
                 let outputHTML = `<!DOCTYPE html>...</html>`; // Plaats hier de VOLLEDIGE outputHTML string uit het vorige antwoord

                 // --- 4. Voeg Dynamische Secties in ---
                 let dynamicHTML = '';
                 const createListItems = (text) => (text || '').split('\n').map(line => line.trim()).filter(line => line).map(line => `<div>${line.startsWith('•') ? '' : '• '}${line.replace(/^•\s*/, '')}</div>`).join('\n');

                 if (config.optFysiekDigitaal) {
                     dynamicHTML += `...`; // Plaats hier de F/D HTML structuur
                 }
                 if (config.optMoederdag) {
                     dynamicHTML += `\n${config.htmlMoederdag || '<!-- Moederdag HTML ontbreekt -->'}\n`;
                 }
                 outputHTML = outputHTML.replace('%%DYNAMIC_SECTIONS%%', dynamicHTML);

                 // --- 5. Zet de volledige HTML in de textarea ---
                 document.getElementById('output-code').value = outputHTML;
                 console.log("Generator Script: HTML generatie voltooid.");

                 // --- 6. Update Preview ---
                 const previewArea = document.getElementById('preview-area');
                 try {
                      previewArea.innerHTML = '<iframe id="preview-iframe" style="width: 100%; height: 600px; border: none;" title="Formulier Preview"></iframe>';
                      const iframe = document.getElementById('preview-iframe');
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                      iframeDoc.open();
                      // BELANGRIJK: Paden naar CSS/JS zijn nu relatief tov generator.html
                      const cssLink = `<link rel="stylesheet" href="style.css?t=${Date.now()}">`;
                      const fontLink = "<link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>";
                      const jqueryLink = `<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"><\/script>`;
                      const bodyContentMatch = outputHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                      const bodyContent = bodyContentMatch ? bodyContentMatch[1] : '';
                      const finalBodyContent = bodyContent.replace('<script src="script.js"></script>', jqueryLink + '<script src="script.js"></script>');
                      iframeDoc.write(`<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8">${cssLink}${fontLink}</head><body>${finalBodyContent}</body></html>`);
                      iframeDoc.close();
                      console.log("Generator Script: Preview bijgewerkt.");
                 } catch (e) {
                      console.error("Generator Script: Preview bijwerken mislukt:", e);
                      previewArea.innerHTML = `<p><i>Preview kon niet worden geladen. (${e.message})</i></p>`;
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