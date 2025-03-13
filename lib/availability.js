import { chars } from './chars.js';
import { all, reminders } from './tokens.js';


export const buildAvailabilityPicker = (domRoot) => {
  domRoot.innerHTML = `
    <h3>Select which tokens you actually have:</h3>
    <div class="avail-chars" scroll sort="edition">
    ${chars.map((c) => `
      <p class="avail-char-tok" team="${c.team}" edition="${c.edition}">${c.id}</p>
    `).join('')}
    </div>
  `;

  domRoot.querySelectorAll(".avail-char-tok").forEach((c) => {
    console.log(c);
    c.addEventListener("click", () => {
      c.toggleAttribute("available");
    });
  });
}
