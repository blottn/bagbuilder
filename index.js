import { build } from './lib/visualize.js';
import script from './data/charming_idiots.v6.json' with {type: 'json'};

let root = document.getElementById("root");
let { save, load } = build(root, script);
const debug = () => {
  console.log(save());
  setTimeout(debug, 1000);
};

const wait = (time) => new Promise((resolve) => {
    setTimeout(resolve, time)
});

await wait("3000")

let conf = {picked: {"villageidiot": ["farmer", "imp", "imp"]}, unavailable: {}}
load(conf);
debug();
