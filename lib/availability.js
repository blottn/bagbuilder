import { chars } from './chars.js';
import { all, reminders } from './tokens.js';

console.log("listing chars");
console.log(all);
console.log(reminders);

export const buildAvailabilityPicker = (domRoot) => {
  domRoot.innerHTML = `
    <h3>Select which tokens you actually have:</h3>
    <div class="avail-chars" scroll>
    ${all.map((c) => `
      <p>${c}</p>
    `).join('')}
    </div>
  `;
}
