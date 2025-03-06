import { decompressScript } from "./creynolds-script-tool/src/encoding.js";

export const loadScript = () => {
  let res = loadPrefs()
  if (res.length == 0) {
    return {};
  }
  cacheScript(res[0]);
  return res[0];
}


// LoadPrefs tries to find a script by checking:
// 1. url query "creynolds" for a creynolds script tool share link
// 2. url query "scriptJSON" a json encoded script directly in the URL
// 3. In local storage under "script" a cached script
const loadPrefs = () => {
  return [
    loadCreynolds(),
    loadScriptJSON(),
    loadStorage(),
  ].filter((x) => x !== null);
}

const loadCreynolds = () => {
  let params = new URLSearchParams(document.location.search);
  let s = params.get("creynolds");
  if (s == null)
    return null;
  if (s === '')
    return null;
  return JSON.parse(decompressScript(s).toJSON());
}

const loadScriptJSON = () => {
  let params = new URLSearchParams(document.location.search);
  let s = params.get("bagbuilder-script");
  if (s == null)
    return null;
  if (s === '')
    return null;
  return JSON.parse(window.atob(s));
}


export const scriptKey = "bagbuilder-script";
const cacheScript = (script) => {
  localStorage.setItem(scriptKey, JSON.stringify(script));
}

const loadStorage = () => {
  let s = localStorage.getItem(scriptKey);
  if (s == undefined)
    return null;
  return JSON.parse(s);
}
