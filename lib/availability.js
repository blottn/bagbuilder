import { chars } from './chars.js';
import { all, reminders } from './tokens.js';


export const buildAvailabilityPicker = (domRoot) => {
  domRoot.innerHTML = `
    <h3>Select which tokens you actually have:</h3>
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
      <button class="avail-chars-toggle" targetSelector=".avail-char-tok">Toggle <span>all</span></button>
    </div>
    <div class="avail-chars" scroll sort="edition">
    ${chars.map((c) => `
      <p class="avail-char-tok" team="${c.team}" edition="${c.edition}">${c.id}</p>
    `).join('')}
    </div>
  `;

  domRoot.querySelectorAll(".avail-char-tok").forEach((c) => {
    c.addEventListener("click", () => {
      c.toggleAttribute("available");
    });
  });


  const toggleByScript = (script) => {
    domRoot.querySelectorAll(`.avail-char-tok[edition="${script}"]`).forEach((c) => {
      c.click();
    });
  }

  domRoot.querySelectorAll(".avail-chars-toggle").forEach((btn) => {
    console.log(btn);
    btn.addEventListener("click", (evt) => {
      console.log("target:", evt.target);
      console.log(btn.getAttribute("targetSelector"));
      let tgts = domRoot.querySelectorAll(btn.getAttribute("targetSelector"));
      console.log(tgts);
      domRoot.querySelectorAll(btn.getAttribute("targetSelector")).forEach((tok) => {
        tok.click();
      });
    });
  });


  // Init data
  // TODO auto enable from storage (historically what have people declared)
  toggleByScript("tb");
  toggleByScript("snv");
  toggleByScript("bmr");

}
