import { solveProxies } from './proxy.js';
import { chars } from './chars.js';
import { all } from './tokens.js';

import prefs from '../data/preferences.json' with {type: 'json'};

export function build(domRoot, script) {
  let toks = script.slice(1) // Remove metadata entry
    .map(({id}) => id);

  solveProxies(toks, prefs);

  domRoot.innerHTML = toks.map(tok => `
    <div class="tok-block">
      <p>${tok}</p>
      ${[...all].map(e => `<span>${e}</span>`)}
    </div>
  `).join('');
}
