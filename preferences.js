// TODO build a tool to help make preferences, can parse data like:
// village idiot: farmer but only with philo drunk else imp + poisoned

// Preferred mappings for characters
// Each character name maps to:
//  bag: A list of preferred character tokens that players will receive (eg "washerwoman")
//  reminders: A mapping of reminder tokens to preferred replacements (eg "tea party tonight" for hatter)
export let preferences = {
  "village_idiot": {
    bag: ["village_idiot", "farmer", "riot", "imp"],
    reminders: {
      "village_idiot_drunk": ["village_idiot_drunk", "philosopher_drunk"],
    }
  },
  "philosopher": {
    bag: ["philosopher", "pit_hag"],
    reminders: {
      "is_philo": ["is_philo", "is_alchemist"],
      "philosopher_drunk": ["philosopher_drunk", "village_idiot_drunk", "poisoned", "widow_poisoned"],
    }
  },
  "librarian": {
    bag: ["librarian", "washerwoman"],
    reminders: {
      "lib_wrong": ["lib_wrong", "inves_wrong", "ww_wrong"],
      "lib_out": ["lib_out", "inves_minion", "ww_townsfolk"],
    }
  }
}

export let flat_prefs = Object.entries(preferences)
  .map(([char, {bag, reminders}]) => ({[char]: bag, ...reminders}))
  .reduce((acc, next) => ({...acc, ...next}));
