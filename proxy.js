import { chars } from './data.js';
import { solveProxies } from './sat.js';
import { preferences } from './preferences.js';

//
// TODO do we even need to presort?
const no_chars = 10;
const no_reminders = 1000;
// Used to sort the list of characters so we can consume tokens in the best order
export function scoreProxy({name, reminders}, available) {
  let score = 0;
  if (!(name in preferences)) {
    return no_reminders;
  }
  let bag = preferences[name].bag.filter(c => available.bag.some(e => e === c));
  if (bag.length == 0) {
    score += no_chars;
  }

  let rems = reminders.map(r =>
    preferences[r].filter(p_r => available.reminders.some(e => e === p_r))
  );
  return 0;
}


// Generate a proxy for a character
export function proxy(character, available) {
  if (character.name in preferences) {
    let p = preferences[character.name]
    let bag = p.bag.filter(c => available.bag.some(e => e === c));
    let reminders = character.reminders.map(r =>
      p.reminders[r].filter(p_r => available.reminders.some(e => e === p_r))
    ) // For each reminder find the first available preferred reminder
    if (bag.length > 0 && reminders.every(r_avail => r_avail.length > 0)) {
      return {
        bag,
        reminders: reminders.map(r_avail => r_avail[0])
      };
    }
  }


  // If we don't have a preference we should use a random other character
  // with the following rules & priority:
  // 1. Same number of tokens (reminders and characters)
  // 2. Same alignment
  // If both are not possible, we should warn the storyteller TODO
  return { // For now just return the character
    bag: character.name,
    reminders: character.reminders
  }
}
// Attempt to proxy an entire script of characters given a list of available
// bag tokens and reminder tokens
// This function can fail to find a good solution or a solution at all and might
// error or warn as such.
// The return type is {
//  errors: []string_error,
//  warns: []string_warn,
//  token_mappings: {
//    script_token: bag_token,
//    script_reminder: grim_token,
//   }
//  }
//
// The algorithm is:
// # First put tokens in that map to their usual tokens
// # This in particular allows tokens which have their full set to
// # not have elements stolen by other tokens
// for char in script:
//    if char in availble:
//      token_mappings[char] = char;
//    for r in char.reminders:
//      if r in available:
//        token_mappings[r] = r;
// # Collect preferences
// for char in script:
//    if (char.name in token_mappings:
//    pref_bag = preferences[char].bag
//    pref_remin = preferences[char].remin
//
//  preserve_groupings indicates to only put original tokens
//  in bag if we have both the original bag token and original reminder tokens!
//  This shouldnt be preferred however since story tellers are better at handling
//  a mismatching reminder token than a player handling a mismatching bag token.
export function proxyScript(script, available, preserve_groupings = false) {
  let remaining = {bag: [...available.bag], reminders: [...available.reminders]};
  let mappings = {};

  let to_place = [...script];
  let placed = [];
  for (let i = 0; i < script.length; i++) {
    let char = script[i];
    if (remaining.bag.some(a => a === char.name) &&
      char.reminders.every(r => remaining.reminders.some(a => a === r))) {
      mappings[char.name] = char.name;
      // remove token
      remaining.bag.splice(remaining.bag.indexOf(char.name), 1)

      for (let j = 0; j < char.reminders.length; j++) {
        let r = char.reminders[j];
        mappings[r] = r;
        // remove reminder
        remaining.reminders.splice(remaining.reminders.indexOf(r), 1)
      }
      placed.push(i);
    }
  }
  placed.reverse().forEach(ind => to_place.splice(ind, 1))
  console.log("After removing complete token sets we have the following available tokens")
  console.log(JSON.stringify(remaining));
  console.log("Committed mappings:");
  console.log(JSON.stringify(mappings));
  console.log("Incomplete sets:");
  console.log(to_place);
  // we now only have chars that need 1 or more remappings
  // TODO at this point we could attempt to find complete remappings for chars
  // However I believe this ordering only fails to find complete remappings if both
  // 1. tokens preferences lists include incomplete token usages
  // 2. A char appears that uses an incomplete token set before a token which uses a complete token set
  // A token set is the bag token + reminder tokens for one char
  // eg washerwoman + rem:ww_townsfolk + rem:ww_wrong is a complete token set
  // 
  // random_remap are all characters which will receive a "randomly" assigned token
  let random_remap = {bag:[], reminders: []};
  for (let i = 0; i < to_place.length; i++) {
    let {name, reminders} = to_place[i];
    if (!(name in preferences)) {
      random_remap.push({name, reminders});
      continue;
    }
    let p = preferences[name];
    let bag = p.bag.filter(c => remaining.bag.some(e => e === c));
    if (bag.length == 0) {
      random_remap.bag.push(name);
    } else {
      mappings[name] = bag[0];
      remaining.bag.splice(remaining.bag.indexOf(bag[0]), 1); // consume token
    }

    let [mapped, no_pref, avail] = createPreferredMapping(name, reminders, remaining.reminders);
    remaining.reminders = avail;
  }

  return mappings;
}

// TODO force requests to have all reminders have a preference
function createPreferredMapping(name, to_map, avail) {
  console.log(`to_map: ${to_map}`);
  if (to_map.length == 0)
    return [{}, [], avail]; // nothing to do & Success
  if (!(name in preferences)) { // Character has no preferences, stop.
    return [{}, to_map, avail];
  }
  let {reminders} = preferences[name];
  let current;
  [current, ...to_map] = to_map;
  if (!(current in reminders)) { // This reminder has no preference, skip.
    let [mapped, unmapped, rest] = createPreferredMapping(name, to_map, avail);
    return [mapped, [current, ...unmapped], rest];
  }

  let best = reminders[current].filter(r => avail.some(e => e === r));

  console.log(`curr: ${current}, best: ${best}`);
  let mapped = {current: best};
  return [{}, [], avail];
}

let my_tokens = {
  bag: ["farmer", "philosopher"],
  reminders: ["philosopher_drunk", "is_philo"],
}

let complete_bag = {
  bag: ["village_idiot", "farmer", "farmer", "farmer", "librarian"],
  reminders: ["village_idiot_drunk", "lib_out", "inves_wrong"],
}

let script = [
  {
    name: "village_idiot",
    reminders: ["village_idiot_drunk"],
  },
  {
    name: "village_idiot",
    reminders: [],
  },
  {
    name: "village_idiot",
    reminders: [],
  },
  {
    name: "librarian",
    reminders: ["lib_out", "lib_wrong"],
  }
]

proxyScript(script, complete_bag);
