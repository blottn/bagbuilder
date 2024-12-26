import { build } from './lib/visualize.js';
import script from './data/charming_idiots.v6.json' with {type: 'json'};

let root = document.getElementById("root");
build(root, script);
