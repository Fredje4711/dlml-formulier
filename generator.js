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
                    // Sectie 1 (AANGEPAST)
                    inschrijvingTitel: document.getElementById('gen-inschrijving-titel').value,
                    subtypeTitel: document.getElementById('gen-subtype-titel').value,
                    activityNaam: document.getElementById('gen-activity-naam').value,
                    activityDatum: document.getElementById('gen-activity-datum').value, // Nieuwe ID
                    activityUur: document.getElementById('gen-activity-uur').value,     // Nieuwe ID
                    activityPlaats: document.getElementById('gen-activity-plaats').value, // Nieuwe ID
                    activityAdres: document.getElementById('gen-activity-adres').value, // Nieuwe ID
                    pageTitle: document.getElementById('gen-page-title').value, // Behoud deze
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

                 // --- 3. Basis HTML Template String (met aangepaste header en logo pad) ---
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
        /* Extra CSS specifiek voor de nieuwe header layout */
        #top-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr; /* Kolommen: links - midden - rechts */
            grid-template-rows: auto auto auto; /* Rijen voor titels, datum/plaats, uur/adres */
            gap: 2px 15px; /* Kleine verticale gap, grotere horizontale gap */
            width: 100%;
            text-align: center; /* Standaard centreren */
            padding: 15px 10px; /* Padding boven/onder */
            box-sizing: border-box; /* Voorkom dat padding breedte beinvloedt */
        }
        #top-title-main {
            grid-column: 1 / -1; /* Over alle kolommen */
            font-size: 28px;
            font-weight: bold;
            line-height: 1.1;
            margin-bottom: 5px;
        }
         /* Subtitel kleiner maken */
        #top-title-main span {
             font-size: 0.8em; /* Kleiner dan hoofdtitel */
             font-weight: normal;
             margin-left: 10px;
         }
        #top-title-activity {
             grid-column: 1 / -1; /* Over alle kolommen */
             font-size: 22px;
             line-height: 1.1;
             margin-bottom: 15px; /* Meer ruimte onder activiteit naam */
        }
        #top-date, #top-time { text-align: left; padding-left: 10px; } /* Links uitlijnen met padding */
        #top-location, #top-address { text-align: right; padding-right: 10px; } /* Rechts uitlijnen met padding */
        #top-date, #top-location, #top-time, #top-address {
             font-size: 16px;
             line-height: 1.3;
             align-self: center; /* Verticaal centreren in grid cel */
        }
    </style>
</head>
<body>
    <div id="content">
        <div id="top"> <!-- Oude #top blijft als container voor achtergrondkleur -->
            <div id="top-grid"> <!-- Nieuwe grid container -->
                <div id="top-title-main">${config.inschrijvingTitel || 'Inschrijving'} ${config.subtypeTitel ? `<span>${config.subtypeTitel}</span>` : ''}</div>
                <div id="top-title-activity">${config.activityNaam || ''}</div>

                <div id="top-date">${config.activityDatum || ''}</div>
                <div></div> <!-- Lege cel in het midden -->
                <div id="top-location">${config.activityPlaats || ''}</div>

                <div id="top-time">${config.activityUur || ''}</div>
                <div></div> <!-- Lege cel in het midden -->
                <div id="top-address">${config.activityAdres || ''}</div>
            </div>
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
            <img id="logoDL" alt="Logo DLML" src="logo.png"> <!-- Pad aangepast naar logo.png -->
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

                         // --- 4. Voeg Dynamische Secties in ---
                         let dynamicHTML = '';
                         const createListItems = (text) => (text || '').split('\n').map(line => line.trim()).filter(line => line).map(line => `<div>${line.startsWith('•') ? '' : '• '}${line.replace(/^•\s*/, '')}</div>`).join('\n');

                         if (config.optFysiekDigitaal) {
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
                              let bodyContent = bodyContentMatch && bodyContentMatch[1] ? bodyContentMatch[1] : '<!-- Body inhoud niet gevonden -->';
                              bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '<!-- Script verwijderd voor preview -->');
                              iframeDoc.write(bodyContent);
                              iframeDoc.write('</body></html>');
                              iframeDoc.close();
                              console.log("Generator Script: Preview bijgewerkt (zonder scripts).");
                         } catch (e) {
                              console.error("Generator Script: Preview bijwerken mislukt:", e);
                              previewArea.innerHTML = `<p style="color:red;"><i>Preview kon niet worden geladen: ${e.message}. Code staat wel in het tekstvak hieronder.</i></p>`;
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
                copyButton.addEventListener('click', function() {
                    const outputCode = document.getElementById('output-code');
                     if (!outputCode.value || outputCode.value.startsWith('// Fout')) { alert("Genereer eerst de code succesvol!"); return; }
                    outputCode.select();
                    try {
                         const successful = document.execCommand('copy');
                         alert(successful ? "Code gekopieerd!" : "Kon niet automatisch kopiëren.");
                    } catch (err) { alert("Kon niet automatisch kopiëren."); }
                     if (window.getSelection) {window.getSelection().removeAllRanges();}
                     else if (document.selection) {document.selection.empty();}
                });
             } else { console.error("Generator Script: Knop 'btn-copy' niet gevonden!"); }

             // Koppel Download knop listener
             const downloadButton = document.getElementById('btn-download');
             if (downloadButton) {
                downloadButton.addEventListener('click', function() {
                    const code = document.getElementById('output-code').value;
                    if (!code || code.startsWith('// Fout')) { alert("Genereer eerst de code succesvol!"); return; }
                    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    const filenameBase = document.getElementById('gen-filename')?.value?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'formulier';
                    link.download = filenameBase + '_index.html';
                    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href);
                });
             } else { console.error("Generator Script: Knop 'btn-download' niet gevonden!"); }

             console.log("Generator Script: Initialisatie script voltooid.");
        // EINDE VAN DOMContentLoaded listener
        });
    ```

---

**3. `style.css` (Voor het gegenereerde formulier)**

```css
/* === Algemene Pagina Stijlen === */
html, body { /* ... (blijft hetzelfde) ... */ }
#content { /* ... (blijft hetzelfde) ... */ }

/* === Header Sectie (#top) === */
#top {
    /* Alleen achtergrond en basis padding hier */
    background-color: #663ab7; /* Paarse achtergrond */
    color: #ffffff; /* Witte tekst */
    padding: 0; /* Grid regelt padding */
    box-sizing: border-box;
}
/* Grid Styling (nu inline in de gegenereerde HTML, deze zijn niet meer nodig hier) */
/* #top-grid { ... } */
/* #top-title-main { ... } */
/* #top-title-activity { ... } */
/* etc... */

/* === Formulier Sectie (#myForm) === */
#myForm { /* ... (blijft hetzelfde) ... */ }
#myForm > *:not(#logoDL):not(#containerBevestiging) { /* ... (blijft hetzelfde) ... */ }
#myForm .inln { /* ... (blijft hetzelfde) ... */ }
#myForm .lnfd { /* ... (blijft hetzelfde) ... */ }

/* === Labels en Foutmeldingen === */
label { /* ... (blijft hetzelfde) ... */ }
label span { /* ... (blijft hetzelfde) ... */ }

/* === Input Velden en Textarea === */
input[type=text], input[type=email], textarea { /* ... (blijft hetzelfde) ... */ }
input[type=text]:focus, input[type=email]:focus, textarea:focus { /* ... (blijft hetzelfde) ... */ }
input::placeholder, textarea::placeholder { /* ... (blijft hetzelfde) ... */ }
#naam { max-width: 300px; }
#voornaam { max-width: 250px; }
#email { max-width: 350px; }
#tel { max-width: 250px; }
#aantal { max-width: 100px; }
textarea#opmerkingen { max-width: 100%; width: 400px; resize: none; min-height: 100px; }

/* === Deelname Sectie (Grid Layout) === */
#deelname { /* ... (blijft hetzelfde) ... */ }
#deelname > div:first-child { /* ... (blijft hetzelfde) ... */ }
#deelname div:has(input[type="radio"]) { /* ... (blijft hetzelfde) ... */ }
#deelname input[type="radio"] { /* ... (blijft hetzelfde) ... */ }
#deelname label.inln { /* ... (blijft hetzelfde) ... */ }
#deelname .info-header { /* ... (blijft hetzelfde) ... */ }
#deelname div:not(:first-child):not(:has(input)):not(:has(label)):not(.info-header) { /* ... (blijft hetzelfde) ... */ }

/* === Attest Checkbox === */
label[for="attest"] { /* ... (blijft hetzelfde) ... */ }
#attest { /* ... (blijft hetzelfde) ... */ }

/* === Knoppen === */
#btnSubmit, #fakeBtnSubmit { /* ... (blijft hetzelfde) ... */ }
#btnSubmit { /* ... (blijft hetzelfde) ... */ }
#btnSubmit:hover { /* ... (blijft hetzelfde) ... */ }
#fakeBtnSubmit { /* ... (blijft hetzelfde) ... */ }
#txtFakeBtnSubmit { /* ... (blijft hetzelfde) ... */ }
#txtVerplicht { /* ... (blijft hetzelfde) ... */ }

/* === Logo === */
#logoDL {
    display: block;
    position: absolute;
    top: 20px;
    right: 25px;
    width: 150px; /* Pas breedte aan indien nodig */
    height: auto;
}

/* === Bevestiging Pop-up === */
#containerBevestiging { /* ... (blijft hetzelfde) ... */ }
#containerBevestiging.visible { /* ... (blijft hetzelfde) ... */ }
#bevestiging { /* ... (blijft hetzelfde) ... */ }
#bevestiging:hover { /* ... (blijft hetzelfde) ... */ }
#bevestigingTitel { /* ... (blijft hetzelfde) ... */ }
#bevestigingMsg { /* ... (blijft hetzelfde) ... */ }
#bevestiging #btnOK { /* ... (blijft hetzelfde) ... */ }
#bevestiging #btnOK:hover { /* ... (blijft hetzelfde) ... */ }

/* === Helper Classes === */
.error-border { /* ... (blijft hetzelfde) ... */ }

/* === Responsive Aanpassingen === */
@media (max-width: 700px) {
    #content { width: 98%; margin: 10px auto; }
    /* Pas op met grid in header op mobiel, kan anders nodig zijn */
    #top-grid { grid-template-columns: 1fr 1fr; text-align: center; gap: 5px; padding: 10px; } /* Simpeler grid */
    #top-title-main, #top-title-activity { grid-column: 1 / -1; } /* Titels over volle breedte */
    #top-date, #top-time { text-align: left; padding-left: 5px; grid-column: 1 / 2; }
    #top-location, #top-address { text-align: right; padding-right: 5px; grid-column: 2 / 3; }
    #top-grid > div:nth-child(4) ~ div:nth-child(odd) { /* Plaats/Adres op volgende rij */
       /* grid-row: 3; */ /* Kan complex worden, check layout */
    }

    #myForm { /* ... (blijft hetzelfde) ... */ }
    #logoDL { /* ... (blijft hetzelfde) ... */ }
    input[type=text], input[type=email], textarea, #naam, #voornaam, #email, #tel, #aantal, textarea#opmerkingen { max-width: 100%; width: 100%; }
    #deelname { grid-template-columns: 25px auto; column-gap: 5px; padding: 10px; }
    #deelname > div:first-child, #deelname .info-header, #deelname div:not(:first-child):not(:has(input)):not(:has(label)):not(.info-header) { grid-column: 1 / -1; padding-left: 0; }
    #deelname div:has(input[type="radio"]) { padding-left: 0; }
    #btnSubmit, #fakeBtnSubmit { width: 100%; box-sizing: border-box; }
    #bevestiging { width: 90%; min-width: unset; }
    #bevestigingTitel { font-size: 16px; margin-bottom: 15px; }
    #bevestigingMsg { font-size: 15px; padding: 0 15px 20px 15px; }
    #bevestiging #btnOK { width: 80%; padding: 10px 15px; }
}