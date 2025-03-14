import { buildAvailabilityPicker } from "./availability.js";
import { openModal } from "./modal.js";

export default (domRoot, picker) => {
  domRoot.innerHTML =`
    <div class="buttons">
      <div class="checkbox">
        <input id="hideunpreferred" type="checkbox" checked />
        <p>Hide Unpreffered?</p>
      </div>
      <button id="configure-tokens">Set available tokens</button>
      <div class="tokens-avail" modal inactive>
      </div>
    </div>
    
    <div class="build-container">
      <img class="logo" src="./data/icon-large.png" />
      <p class="build">BUILD!</p>
      <div class="build-confirmation"></div>
      <div class="build-output" modal inactive>
        ${
          [...picker.querySelectorAll(".tok-proxies")]
            .map(e => e.getAttribute("token"))
            .map(t => `
            <p>
              ${t}
            </p>`).join('')
        }
      </div>
    </div>
    `;
  domRoot.querySelector("#hideunpreferred")
    .addEventListener("click", (evt) => {
      if (evt.target.checked) {
        picker.setAttribute("hideunpreferred", "")
      } else {
        picker.removeAttribute("hideunpreferred")
      }
   });

  domRoot.querySelector("#configure-tokens")
    .addEventListener("click", (evt) => {
      openModal(domRoot.querySelector(".tokens-avail"))
    });

  domRoot.querySelector(".logo")
    .addEventListener("click", (evt) => {
      let incomplete = [...picker.querySelectorAll(`.tok-proxies:not(:has([state="picked"]))`)]
      // TODO use incomplete to prompt user
      let complete = [...picker.querySelectorAll(`.tok-proxies > [state="picked"]`)];
      openModal(domRoot.querySelector(".build-output"))
    });

  buildAvailabilityPicker(domRoot.querySelector(".tokens-avail"))
}
