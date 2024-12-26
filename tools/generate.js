// Utility for generating preferences list
// Use as `deno run -A ./tools/generate.js ./preferences.human > preferences.json`

import { chars } from './data.js';


export function generate(text) {
  let o = text.split('\n')
    .filter(l => !l.startsWith('#')) // Comment indicator
    .filter(l => l.indexOf('->') != -1)
    .map(line => line.split(' -> '))
    .filter(([_, os]) => os !== '')
    .map(([i, os]) => ([i.trim(), os.split(' ')]))
    .reduce((acc, [k, vs]) => ({...acc, [k]: vs}), {})
  return o;
}
console.log(Deno.args);

let t = await Deno.readTextFile(Deno.args[0]);
console.log(generate(t));
