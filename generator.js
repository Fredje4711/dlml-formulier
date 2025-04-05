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
                 const config = { /* ... (config object opbouw zoals voorheen) ... */ };
                    // Kopieer hier de volledige 'config' object opbouw uit het vorige antwoord

                 // --- 3. Basis HTML Template String (met aangepaste marge onder tijd/adres) ---
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
        /* Extra CSS specifiek voor de header layout (Flexbox met !important) */
        #top { padding: 0 !important; background-color: #663ab7 !important; color: white !important; display: block !important; margin-bottom: -1px !important; }
        #top-flex { display: flex !important; flex-wrap: wrap !important; justify-content: space-between !important; align-items: center !important; width: 100% !important; padding: 15px 15px !important; box-sizing: border-box !important; text-align: center !important; font-family: 'Roboto', sans-serif !important; }
        #top-flex-center { flex-grow: 1; padding: 0 10px; margin-bottom: 10px; }
        #top-title-main { font-size: 28px; font-weight: bold; line-height: 1.1; margin-bottom: 5px; }
        #top-title-main span { font-size: 0.8em; font-weight: normal; margin-left: 10px; }
        #top-title-activity { font-size: 22px; line-height: 1.1; }
        #top-flex-left, #top-flex-right { font-size: 16px; line-height: 1.4 !important; min-width: 180px; padding-top: 5px; }
        #top-flex-left { text-align: left !important; }
        #top-flex-right { text-align: right !important; }
        /* NIEUW: Ruimte onder de laatste regel in L/R blokken */
        #top-flex-left > div:last-child,
        #top-flex-right > div:last-child {
             margin-bottom: 3px; /* Kleine marge onderaan */
        }


         /* Responsive aanpassing */
         @media (max-width: 700px) {
             #top-flex { flex-direction: column !important; align-items: center !important; padding: 10px !important; }
             #top-flex-left, #top-flex-right, #top-flex-center { width: 100% !important; text-align: center !important; min-width: unset !important; margin-bottom: 5px !important; padding: 0 !important; }
             #top-flex-center { order: 1; margin-bottom: 8px; }
             #top-flex-left { order: 2; }
             #top-flex-right { order: 3; }

             /* Styling voor de tekstregels *binnen* de blokken op MOBIEL */
             #top-flex-left > div,
             #top-flex-right > div {
                  margin-bottom: 1px !important; /* Compacte marge TUSSEN regels */
                  padding: 1px 0 !important;
                  line-height: 1.3 !important;
                  text-align: center !important;
             }
             /* NIEUW: Iets meer marge ONDER het blok op mobiel */
              #top-flex-left > div:last-child,
              #top-flex-right > div:last-child {
                  margin-bottom: 5px !important;
              }

             /* Titel styling aanpassen voor mobiel */
             #top-title-main { font-size: 22px; }
             #top-title-activity { font-size: 18px; }
         }
    </style>
</head>
<body>
    <div id="content">
         <!-- AANGEPASTE HEADER STRUCTUUR -->
         <div id="top">
             <div id="top-flex">
                  <div id="top-flex-left">
                      <div>${config.activityDatum || ''}</div>
                      <div>${config.activityUur || ''}</div>
                  </div>
                  <div id="top-flex-center">
                      <div id="top-title-main">${config.inschrijvingTitel || 'Inschrijving'} ${config.subtypeTitel ? `<span>${config.subtypeTitel}</span>` : ''}</div>
                      <div id="top-title-activity">${config.activityNaam || ''}</div>
                 </div>
                  <div id="top-flex-right">
                      <div>${config.activityPlaats || ''}</div>
                      <div>${config.activityAdres || ''}</div>
                  </div>
             </div>
         </div>
         <!-- EINDE AANGEPASTE HEADER STRUCTUUR -->

        <div id="filenaam" style="display:none;">${config.filename || ''}</div>
        <div id="checkafzender" style="display:none;">${config.checkstring || ''}</div>
        <form id="myForm" action="#" method="post" accept-charset="utf-8">
            <!-- ... rest van formulier ... -->
             %%DYNAMIC_SECTIONS%%
            <!-- ... rest van formulier ... -->
        </form>
        <!-- ... rest van pagina ... -->
    </div>
    <!-- ... script links ... -->
</body>
</html>`; // <<< Zorg dat de rest van de template hier correct volgt

                         // --- 4. Voeg Dynamische Secties in ---
                         let dynamicHTML = '';
                         // ... (Code voor F/D en Moederdag blijft hetzelfde) ...
                         outputHTML = outputHTML.replace('%%DYNAMIC_SECTIONS%%', dynamicHTML);

                         // --- 5. Zet HTML in Textarea ---
                         document.getElementById('output-code').value = outputHTML;
                         console.log("Generator Script: HTML generatie voltooid.");

                         // --- 6. Update Preview (Vereenvoudigd) ---
                         const previewArea = document.getElementById('preview-area');
                         // ... (Code voor preview blijft hetzelfde) ...

                     } catch (error) {
                         // ... (Error handling blijft hetzelfde) ...
                     } // EINDE try block generate
                 }); // EINDE btn-generate listener
             } else { /* ... */ }

             // Koppel Kopieer knop listener
             const copyButton = document.getElementById('btn-copy');
             if (copyButton) { /* ... */ } else { /* ... */ }

             // Koppel Download knop listener
             const downloadButton = document.getElementById('btn-download');
             if (downloadButton) { /* ... */ } else { /* ... */ }

             console.log("Generator Script: Initialisatie script voltooid.");

// EINDE VAN DOMContentLoaded listener
}); // <<< ZORG DAT DEZE CORRECT AFSLUIT