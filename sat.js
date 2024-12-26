// SAT - boolean satisfiability of a preference set & script & available tokens
import { flat_prefs } from './preferences.js';

export function solveProxies(toks, prefs, avail) {
  let search = [];
  avail = avail.reduce((acc, tok) => {
    if (!(tok in acc))
      acc[tok] = 0;
    acc[tok] += 1;
    return acc;
  }, {});
  let filt = {}; // only the tokens which we are interested in
  for (let [k, v] of Object.entries(prefs)) {
    if (toks.some(t => t === k)) {
      filt[k] = v.map((tok, weight) => ({tok, weight}))
        .filter(({tok, weight}) => tok in avail); // Only the ones we have
    }
  }
  let perms = generatePerms(toks, prefs)
  perms = perms.map(perm => ({perm, heur: valueOf(perm, prefs)}))
  perms = perms.filter(({perm}) => {
    return Object.entries(
      Object.values(perm)
      .reduce((acc, t) => {
        if (!(t in acc))
          acc[t] = 0;
        acc[t] += 1;
        return acc;
      }, {})).every(([char, count]) => avail[char] >= count)
  });
  perms.sort((a, b) => a.heur - b.heur);
  return perms;
}
// This is the heuristic for a particular solution
// All items of mappings must have a preference
function valueOf(mappings, prefs) {
  let value = 0;
  for (let [name, mapping] of Object.entries(mappings)) {
    let v = prefs[name].indexOf(mapping);
    if (v == -1) {
      // Randomised mappings are worth 30:
      // 30 perfect mappings OR
      // the 30th preference of 1 token
      // this informs how hard to try to find a good mapping
      v = 30;
    }
    value += v;
  }
  return value;
}

function generatePerms(toks, prefs) {
  let [curr, ...rest] = toks;
  if (toks.length == 0)
    return [];
  if (toks.length == 1)
    return prefs[curr].map(replace => ({[curr]: replace}))

  let perms = [];
  for (let i = 0; i < prefs[curr].length; i++) {
    perms = perms.concat(
      generatePerms(rest, prefs)
        .map(perm => ({[curr]: prefs[curr][i], ...perm}))
    )
  }
  return perms;
}
