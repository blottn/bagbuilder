// Utility for generating preferences list
// Use as `deno run -A ./tools/generate.js ./data/preferences.human > data/preferences.json`

import { chars } from '../lib/chars.js';

export function generate(text) {
  let o = text.split('\n')
    .filter(l => !l.startsWith('#')) // Comment indicator
    .filter(l => l.indexOf('->') != -1)
    .map(line => line.split(' -> '))
    .filter(([_, os]) => os !== '')
    .map(([i, os]) => ([i.trim(), os.split(' ')]))
    .reduce((acc, [k, vs]) => ({...acc, [k]: [k, ...vs]}), {})
  return o;
}

let t = await Deno.readTextFile(Deno.args[0]);
console.log(JSON.stringify(generate(t)));
