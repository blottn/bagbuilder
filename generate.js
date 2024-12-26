// Utility for generating preferences list
import { chars } from './data.js';

function tokenify(str) {
  return str.toLowerCase().replaceAll(/(?:[^a-z0-9]+)/g, '_');
}

// list all tokens is useful for when 
export function listAllTokens() {
  return chars.reduce((all, {name, reminders, team}) => {
    let tokened = tokenify(name);
    all[team].push(`tok:${tokened}`);
    all[team] = all[team].concat(
      reminders.map(r => `rem:${tokened}_${tokenify(r)}`)
    );
    return all;
  }, {
    "townsfolk": [],
    "outsider": [],
    "minion": [],
    "demon": [],
    "traveler": [],
  })
}

export function generate(text) {
  let o = text.split('\n')
    .filter(l => !l.startsWith('#')) // Comment indicator
    .filter(l => l.indexOf('->') != -1)
    .map(line => line.split(' -> '))
    .map(([i, os]) => ([i.trim(), os.split(' ')]))
  console.log(o);
}
let t = await Deno.readTextFile("preferences.human");
generate(t);

