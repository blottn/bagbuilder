import { chars } from './chars.js';
import { all, reminders } from './tokens.js';

import prefs from '../data/preferences.json' with {type: 'json'};

export function build(domRoot, script) {
  let toks = script.slice(1) // Remove metadata entry
    .map(({id}) => id)
    .map(id => [id, ...reminders[id]])
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
  
  const render = () => {
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
          // Helper for deduplication massive selectors
          const transit = (e, from, to) => { // 
            let p = e.getAttribute("proxy");
            domRoot.querySelectorAll(`:nth-child(1 of [proxy="${p}"][state="${from}"])`)
              .forEach(x => x.setAttribute("state", to));
          }
          // shift click => toggle availability
          // regular click => toggle picked choice
          if (evt.shiftKey) {
            if (el.getAttribute("state") === "available") {
              transit(el, "available", "unavailable");
            } else if (el.getAttribute("state") === "unavailable") {
              transit(el, "unavailable", "available");
            }
          } else {
            if (el.getAttribute("state") === "available") {
              let toFree = domRoot.querySelectorAll(`[state="picked"][token="${token}"]`)
              toFree.forEach(x => transit(x, "inuse", "available"));
              toFree.forEach(x => x.setAttribute("state", "available"));

              transit(el, "available", "inuse")
              domRoot.querySelector(`[token="${token}"][state="inuse"][proxy="${el.getAttribute("proxy")}"]`).setAttribute("state", "picked");
            } else if (el.getAttribute("state") === "picked") {
              transit(el, "inuse", "available");
              el.setAttribute("state", "available");
            }
          }
        }
      })
    });
    domRoot.querySelectorAll(":nth-child(1 of .proxy)")
      .forEach(p => p.click());
  }
  render();
}
