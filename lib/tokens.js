import { chars } from './chars.js';

export const token = (str) => {
  return str.toLowerCase().replaceAll(' ', '');
}


// Example tokensFor washerwoman:
// [
//  {
//    "id":"washerwoman",
//    "team":"townsfolk",
//    "edition":"tb"
//  },
//  {
//    "id":"washerwoman_townsfolk",
//    "team":"townsfolk",
//    "edition":"tb"
//  },
//  {
//    "id":"washerwoman_wrong",
//    "team":"townsfolk",
//    "edition":"tb"
//  }
//]
export const tokensFor = (({id, team, reminders, remindersGlobal, edition, count}) => [
      ((count ?? 1) <= 1) ?
        [token(id)]
        :
        Array.from(Array(count).keys()).map(n => `${token(id)}_${n + 1}`),
      (reminders ?? []).concat(remindersGlobal ?? [])
        .map(r => `${token(id)}_${token(r)}`)
    ].flat(Infinity).map(id => ({
      id,
      team,
      edition,
    }))
);

export const all = chars.map(c => tokensFor(c).map(({id}) => id)).flat(Infinity);

export const reminders = chars.reduce((acc, {id, reminders, remindersGlobal}) => (
  {
    ...acc,
    [id]: [reminders?.map(r => `${id}_${token(r)}`) ?? [],
      remindersGlobal?.map(r => `${id}_${token(r)}`) ?? []].flat()
  }), {});

