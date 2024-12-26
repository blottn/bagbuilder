import { chars } from './data.js';
import { dumbProxy } from './dumb.js';

let seed = 4;
function random() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

let tb = chars.filter(({edition}) => edition === "tb")
  .filter(({team}) => team !== "traveler")
  .map(({name, reminders}) => [
    name.toLowerCase(),
    ...reminders.map(r => `${name.toLowerCase()}_${r.toLowerCase()}`)
  ]).flat()

let random_subset = tb.filter(() => random() > 0.5)

console.log(random_subset);
