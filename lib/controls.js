export default (domRoot, picker) => {
  domRoot.innerHTML =`
    <input id="hideunpreferred" type="checkbox" checked>Hide Unpreffered?</input>
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
