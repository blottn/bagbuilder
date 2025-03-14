import { chars } from './chars.js';
import { all, reminders } from './tokens.js';

const rater = (prefs) => {
  return (t, x) => { // Lower = better
    let v = (prefs[t] ?? [t]).indexOf(x)
    if (v >= 0)
      return v;
    
    v = prefs[t]?.length ?? 1;

    if (t.includes("_") !== x.includes("_"))
      v += 100; // TODO move this to just order statements in css
    return v;
  }
}

const addAvailListener = (domRoot, availabilityRoot) => {
  const obs = new MutationObserver((mutations) => {
    mutations.forEach(({target}) => {
      if (!target.classList.contains("avail-char-tok"))
        return
      let avail = target.hasAttribute("available")
      let id = target.getAttribute("id");
      console.log(id, avail);
    });
  });
  obs.observe(availabilityRoot, {attributes: true, subtree: true, childList: true});
}

// Builds a picker dom from a given domRoot
// Additional parameters:
// availabilityRoot:
//  A dom element underneath of which is .avail-char-token annotated elements,
//  will be used to create a mutationobserver which detects available tokens
// script:
//  An offficial format script array, giving needed token results
// prefs:
//  A map from token => ordered list of preferred replacements (most to least)
export default (domRoot, availabilityRoot, script, prefs) => {
  let toks = script.slice(1) // Remove metadata entry
    .map(({id}) => id)
    .map(tokenId => [
      ...Array.from(Array(chars.filter(({id}) => id === tokenId)[0]?.count ?? 1)).map(e => tokenId),
      ...reminders[tokenId]
    ])
    .flat()

  let available_tok = all;

  const rate = rater(prefs);
  
  domRoot.innerHTML = `
    <div id="tokens" class="tokens">
      ${toks.map(tok => `
        <div class="tok-block" token="${tok}">
          <p class="tok-header">${tok}</p>
          <div class="tok-proxies" token="${tok}">
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
    </div>`;

  addAvailListener(domRoot, availabilityRoot)
  
  // Setup click listeners
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

  
  const done = () => {
    let incomplete = [...domRoot.querySelectorAll(`.tok-block:not(:has(.proxy[state="picked"])`)];
    if (incomplete.length == 0) {
      return {mappings: [], ok: false}
    }
    return {mappings: save(), ok: true}
  }

  const save = () => {
    return [...domRoot.querySelectorAll(".tok-block[token]")]
      .map(e => [e.getAttribute(["token"]), e])
      .map(([from, e]) => ({
        from,
        to: e.querySelector(`[state="picked"]`)?.getAttribute("proxy")
      }))
  }

  // Bootstrap the contents with some mapped and unavailable tokens
  const load = (picks) => {
    picks.forEach(({from, to}) => {
      domRoot.querySelector(`.tok-block[token="${from}"]:not(:has(.proxy[state="picked"])) .proxy[state="available"][proxy="${to}"]`)?.click();
    });
  }

  return {done, save, load};
}
