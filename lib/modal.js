export const clearModals = () => {
  document.querySelectorAll("[modal]")
    .forEach(e => e.setAttribute("inactive", ""));
}

export const openModal = (dom) => {
  clearModals();
  dom.removeAttribute("inactive");
}

export const initHandlers = () => {
  document.addEventListener("click", (evt) => {
    let targeted = [...document.querySelectorAll("[modal]")].filter(e => e.contains(evt.target))
    if (targeted.length == 0)
      clearModals();
  }, true);

  document.addEventListener("keydown", (evt) => {
    if (evt.keyCode == 27)
      clearModals();
  });
}
