import { chars } from '../data.js';

function print({id, reminders}) {
  return ([
    id,
    reminders.map(r => r.replace(' ', ''))
      .map(r => r.toLowerCase())
      .map(r => id + '_' + r)
  ].flat()).map(t => t + ' -> ').join('\n')
}

let out = chars.filter(({team}) => team !== "traveler")
  .map(c => print(c)).join('\n');
console.log(out);

