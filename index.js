import picker from './lib/picker.js';
import controls from './lib/controls.js';

import script from './data/charming_idiots.v6.json' with {type: 'json'};
import prefs from './data/preferences.json' with {type: 'json'};

let pickerRoot = document.querySelector(".picker");
let { done, save, load } = picker(pickerRoot, script, prefs);

let controlsRoot = document.querySelector(".controls");
let ctrl = controls(controlsRoot, pickerRoot);

const wait = (time) => new Promise((resolve) => {
    setTimeout(resolve, time)
});

// await wait("3000")

let base = [{"from":"noble","to":"investigator"},{"from":"noble_seen","to":"investigator_minion"},{"from":"noble_seen2","to":"investigator_wrong"},{"from":"noble_seen3","to":"librarian_outsider"},{"from":"washerwoman","to":"washerwoman"},{"from":"washerwoman_townsfolk","to":"washerwoman_townsfolk"},{"from":"washerwoman_wrong","to":"washerwoman_wrong"},{"from":"pixie","to":"lunatic"},{"from":"pixie_mad","to":"lunatic_attack1"},{"from":"pixie_hasability","to":"lunatic_attack2"},{"from":"bountyhunter","to":"seamstress"},{"from":"bountyhunter_known","to":"librarian_wrong"},{"from":"empath","to":"empath"},{"from":"highpriestess","to":"oracle"},{"from":"preacher","to":"exorcist"},{"from":"preacher_atasermon","to":"exorcist_chosen"},{"from":"villageidiot","to":"imp"},{"from":"villageidiot","to":"imp"},{"from":"villageidiot","to":"imp"},{"from":"villageidiot_drunk","to":"drunk_drunk"},{"from":"snakecharmer","to":"snakecharmer"},{"from":"snakecharmer_poisoned","to":"snakecharmer_poisoned"},{"from":"towncrier","to":"towncrier"},{"from":"towncrier_minionsnotnominated","to":"towncrier_minionsnotnominated"},{"from":"towncrier_minionnominated","to":"towncrier_minionnominated"},{"from":"philosopher","to":"philosopher"},{"from":"philosopher_drunk","to":"philosopher_drunk"},{"from":"philosopher_isthephilosopher","to":"philosopher_isthephilosopher"},{"from":"cannibal","to":"undertaker"},{"from":"cannibal_poisoned","to":"minstrel_everyonedrunk"},{"from":"cannibal_lunch","to":"undertaker_executed"},{"from":"ravenkeeper","to":"ravenkeeper"},{"from":"recluse","to":"recluse"},{"from":"hatter","to":"barber"},{"from":"hatter_teapartytonight","to":"barber_haircutstonight"},{"from":"mutant","to":"mutant"},{"from":"puzzlemaster","to":"sweetheart"},{"from":"puzzlemaster_drunk","to":"sweetheart_drunk"},{"from":"puzzlemaster_guessused","to":"artist_noability"},{"from":"poisoner","to":"poisoner"},{"from":"poisoner_poisoned","to":"poisoner_poisoned"},{"from":"cerenovus","to":"cerenovus"},{"from":"cerenovus_mad","to":"cerenovus_mad"},{"from":"widow","to":"spy"},{"from":"widow_poisoned","to":"thief_negativevote"},{"from":"widow_knows","to":"butler_master"},{"from":"scarletwoman","to":"scarletwoman"},{"from":"scarletwoman_demon","to":"scarletwoman_demon"},{"from":"baron","to":"baron"},{"from":"lilmonsta"},{"from":"lilmonsta_isthedemon"},{"from":"lilmonsta_dead"},{"from":"ojo","to":"po"},{"from":"ojo_dead"},{"from":"legion"},{"from":"legion_dead"},{"from":"legion_abouttodie"}];

load(base);
