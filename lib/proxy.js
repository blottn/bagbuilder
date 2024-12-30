import { all } from './tokens.js';

export function solveProxies(toks, prefs, avail=all) {
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
  let perms = fastGenPerms(toks, prefs)
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

function getPrefs(tok, prefs) {
  if (!(tok in prefs))
    return [tok]
  return prefs[tok];
}

function fastGenPerms(tokens, preferences, prefixes=[]) {
  if (tokens.length == 0) {
    return [];
  }
  console.log(tokens, preferences, prefixes);
  let [curr, ...rest] = tokens;
  let prefs = preferences[curr];
  if (!(curr in preferences))
    prefs = [curr];

  if (prefixes.length == 0) {
    return fastGenPerms(rest, preferences, prefs.map(pref => ({[curr]: pref})));
  }

  if (tokens.length == 1) {
    return prefixes.map(prefix => {
      return prefs.map(p => {
        return {...prefix, [curr]: p};
      });
    }).flat();
  }

  console.log("Building new prefixes");
  let new_prefixes = prefs.map(pref => {
    return prefixes.map(prefix => {
      return {...prefix, [curr]: pref};
    });
  }).flat();

  console.log(new_prefixes);
}

function generatePerms(tokens, preferences) {
  if (toks.length == 0)
    return [];
  if (toks.length == 1) {
    return prefs[curr].map(replace => ({[curr]: replace}))
  }

  let perms = [];
  for (let i = 0; i < getPrefs(curr, prefs).length; i++) {
    perms = perms.concat(
      generatePerms(rest, prefs)
        .map(perm => ({[curr]: getPrefs(curr, prefs)[i], ...perm}))
    )
  }
  return perms;
}
