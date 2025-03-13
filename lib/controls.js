import { buildAvailabilityPicker } from "./availability.js";

export default (domRoot, picker) => {
  domRoot.innerHTML =`
    <div class="checkbox">
      <input id="hideunpreferred" type="checkbox" checked />
      <p>Hide Unpreffered?</p>
    </div>
    <button id="configure-tokens">Set available tokens</button>
    <div id="tokens-avail" card active>
    </div>
    <button id="button">Build</button>
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
      domRoot.querySelector("#tokens-avail")
        .setAttribute("active", "")
    });

  buildAvailabilityPicker(domRoot.querySelector("#tokens-avail"))
}
