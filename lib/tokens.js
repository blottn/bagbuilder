import { chars } from './chars.js';

const token = (str) => {
  return str.toLowerCase().replaceAll(' ', '');
}

export const all = chars.map(c => (
  [Array.from(Array(c?.count ?? 1).keys()).map(_ => c.id),
    c.reminders?.map(r => `${c.id}_${token(r)}`) ?? [],
    c.remindersGlobal?.map(r => `${c.id}_${token(r)}`) ?? [],
  ])).flat(Infinity);

export const reminders = chars.reduce((acc, {id, reminders, remindersGlobal}) => (
  {
    ...acc,
    [id]: [reminders?.map(r => `${id}_${token(r)}`) ?? [],
      remindersGlobal?.map(r => `${id}_${token(r)}`) ?? []].flat()
  }), {});

