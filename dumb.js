import { flat_prefs } from './preferences.js';

// Relies on all tokens having a preference & no 2 tokens having the same name
export function dumbProxy(script, available) {
  let flatscript = script.map(({name, reminders}) => [name, ...reminders]).flat()
  console.log(flatscript, available);
}
