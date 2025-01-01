import { chars } from './chars.js';
import { all, reminders } from './tokens.js';

import prefs from '../data/preferences.json' with {type: 'json'};

export function build(domRoot, script) {
  let toks = script.slice(1) // Remove metadata entry
    .map(({id}) => id)
    .map(tokenId => [
      ...Array.from(Array(chars.filter(({id}) => id === tokenId)[0]?.count ?? 1)).map(e => tokenId),
      ...reminders[tokenId]
    ])
    .flat()

  let available_tokens = all;

  const rate = (t, x) => { // Lower = better
    let v = (prefs[t] ?? [t]).indexOf(x)
    if (v >= 0)
      return v;
    
    v = prefs[t]?.length ?? 1;

    if (t.includes("_") !== x.includes("_"))
      v += 100; // TODO move this to just order statements in css
    return v;
  }
  
  domRoot.innerHTML = `
    <div id="tokens">
      ${toks.map(tok => `
        <div class="tok-block" token="${tok}">
          <p class="tok-header">${tok}</p>
          <div class="tok-proxies">
            ${
              [...all].sort((t1, t2) => rate(tok, t1) - rate(tok, t2))
                .map((e, idx) => {
                  return `
                  <p class="proxy"
                      state="available"
                      ${(prefs[tok] ?? [tok]).indexOf(e) == -1 ? "" : "preferred"}
                      ${e.includes("_") ? "reminder" : ""}
                      token="${tok}"
                      proxy="${e}">
                    ${e}
                    </p>`;
                }).join('')
            }
          </div>
        </div>`).join('')
      }
    </div>
    <div>
      <button id="commit">COMMIT</button>
    </div>`;
  // TODO toggle pick the first item of each
  domRoot.querySelectorAll(".tok-block").forEach(block => {
    block.querySelectorAll(".proxy").forEach(el => {
      let token = el.getAttribute("token")
      el.onclick = (evt) => {
        // Most updates just require changing the state of this node and 1 instance in all other blocks
        let oldState = el.getAttribute("state");
        let updateOthers = (from, to, proxy=el.getAttribute("proxy")) => {
          [...domRoot.querySelectorAll(":has(> [proxy])")]
            .filter(b => b !== el.parentNode)
            .forEach(b => b.querySelector(`[proxy="${proxy}"][state="${from}"]`)
                            .setAttribute("state", to));
        }
        if (evt.shiftKey) {
          switch(el.getAttribute("state")) {
            case "available":
              el.setAttribute("state", "unavailable");
              return updateOthers("available", "unavailable");
            case "unavailable":
              el.setAttribute("state", "available");
              return updateOthers("unavailable", "available");
          }
        } else {
          switch(el.getAttribute("state")) {
            case "picked":
              el.setAttribute("state", "available");
              return updateOthers("inuse", "available");
            case "available":
              el.setAttribute("state", "picked");
              updateOthers("available", "inuse");
              return [...domRoot.querySelectorAll(`[state="picked"]`)]
                .filter(e => e.parentNode === el.parentNode)
                .filter(e => e !== el)
                .forEach(e => {
                  e.setAttribute("state", "available");
                  updateOthers("inuse", "available", e.getAttribute("proxy"));
                })
          }
        }
      }
    })
  });
  
  domRoot.querySelectorAll(":nth-child(1 of .proxy)")
    .forEach(p => p.click());

  const save = () => {
    
  }

  // Bootstrap the contents with some mapped and unavailable tokens
  const load = ({picked, unavailable}) => {
    domRoot.querySelectorAll(":has(> [proxy])")
      .forEach(block => {
        Object.entries(picked)
      })
  }

  const listenForUpdate = () => {

  }

  return {save, load, listenForUpdate};
}
