export default (domRoot, picker) => {
  domRoot.innerHTML =`
    <div class="checkbox">
      <input id="hideunpreferred" type="checkbox" checked />
      <p>Hide Unpreffered?</p>
    </div>
    <button id="configureAvailable">Set available tokens</button>
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
}
