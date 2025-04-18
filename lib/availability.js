import { clearModals } from './modal.js';

import { chars } from './chars.js';
import { all, reminders, tokensFor } from './tokens.js';

export const buildAvailabilityPicker = (domRoot) => {
  let fullList = chars.map((c) => [
    `<p class="avail-char-tok" team="${c.team}" edition="${c.edition}">${c.id}</p>`,
    c.reminders.map((r) => `
      <p class="avail-char-tok team="${c.team}" edition="${c.edition}">
        ${c.id}_${r.toLowerCase()}
      </p>`)
    ])

  domRoot.innerHTML = `
    <div class="avail-chars-header">
      <h3>Select which tokens you actually have:</h3>
      <button class="avail-chars-close">X</button>
    </div>
    <div class="avail-chars-controls">
      <button class="avail-chars-toggle" targetSelector='[edition="tb"]'>Toggle <span class="script-name">Trouble Brewing<span></button>
      <button class="avail-chars-toggle" targetSelector='[edition="snv"]'>Toggle <span class="script-name">Sects & Violets<span></button>
      <button class="avail-chars-toggle" targetSelector='[edition="bmr"]'>Toggle <span class="script-name">Bad Moon Rising<span></button>
      <button class="avail-chars-toggle" targetSelector='[edition="kickstarter"]'>
        Toggle <span class="script-name">Kickstarter<span>
      </button>
      <button class="avail-chars-toggle" targetSelector='[edition="experimental"]'>
        Toggle <span class="script-name">Experimental<span>
        </button>
      <button class="avail-chars-toggle" targetSelector=".avail-char-tok">Toggle <span>All</span></button>
    </div>
    <div class="avail-chars" scroll sort="edition">
    ${chars.map((c) => tokensFor(c)
        .map(c => 
                  `<p class="avail-char-tok"
                      team="${c.team}"
                      edition="${c.edition}"
                      id="${c.id}">${c.id}</p>`
      )).flat(Infinity).join('')}
    </div>
  `;

  // close button
  domRoot.querySelector(".avail-chars-close")
    .addEventListener("click", () => {
      clearModals();
  });

  domRoot.querySelectorAll(".avail-char-tok").forEach((c) => {
    c.addEventListener("click", () => {
      c.toggleAttribute("available");
    });
  });


  const toggleByScript = (script) => {
    domRoot.querySelectorAll(`.avail-char-tok[edition="${script}"]`).forEach((c) => {
      c.toggleAttribute("available");
    });
  }

  domRoot.querySelectorAll(".avail-chars-toggle").forEach((btn) => {
    btn.addEventListener("click", (evt) => {
      let tgts = domRoot.querySelectorAll(btn.getAttribute("targetSelector"));
      domRoot.querySelectorAll(btn.getAttribute("targetSelector")).forEach((tok) => {
        tok.toggleAttribute("available");
      });
    });
  });


  // Init data
  // TODO auto enable from storage (historically what have people declared)
  toggleByScript("tb");
  toggleByScript("snv");
  toggleByScript("bmr");
}
