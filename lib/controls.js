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
      <div class="build-confirmation" modal inactive></div>
      <div class="build-output" modal active>
        <h3>Replacements are: </h3>
        <div class="token-replacements">
        ${
          [...picker.querySelectorAll(".tok-proxies")]
            .map(e => e.getAttribute("token"))
            .map(t => `
              <p class="token-header" id="${t}">
                ${t}
              </p>
              <p>→</p>
              <p id="${t}-replacement" replacing="${t}" class="replacement">None available</p>
            `).join('')
        }
        </div>
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
      // TODO prompt user when some tokens have not been replaced!
      let complete = [...picker.querySelectorAll(`.tok-proxies > [state="picked"]`)];
      let outputRoot = domRoot.querySelector(".build-output");
      openModal(outputRoot);
      console.log(complete);
      complete = complete.reduce((acc, e) => 
        ({
          ...acc,
          [e.getAttribute("token")]: {
            "id": e.getAttribute("id"),
            "team": e.getAttribute("team"),
            "edition": e.getAttribute("edition"),
          }
        }), {})
      outputRoot.querySelectorAll(".replacement")
        .forEach(e => {
          let original = e.getAttribute("replacing")
          if (!(original in complete)) {
            e.textContent = "None available";
            e.removeAttribute("filled");
            e.removeAttribute("team");
            e.removeAttribute("edition");
            return
          }
          let {id, team, edition} = complete[original];
          e.textContent = id
          e.setAttribute("team", team);
          e.setAttribute("edition", edition);
          e.setAttribute("filled", "");
        });

    });

  buildAvailabilityPicker(domRoot.querySelector(".tokens-avail"))
}
