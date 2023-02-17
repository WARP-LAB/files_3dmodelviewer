/**
 * SPDX-FileCopyrightText: WARP <development@warp.lv> and interwebs
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export function objectsHaveSameKeysShallow (...objects) {
  const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}

const isObject = (object) => {
  return object != null && typeof object === 'object';
};

export const objectsHaveSameKeysDeep = (o1, o2) => {
  const ok1 = Object.keys(o1).sort(([a], [b]) => a.localeCompare(b));
  const ok2 = Object.keys(o2).sort(([a], [b]) => a.localeCompare(b));
  if (ok1.length !== ok2.length) return false;

  for (const key of ok1) {
    const ov1 = o1[key];
    const ov2 = o2[key];
    const isObjects = isObject(ov1) && isObject(ov2);
    if (
      (isObjects && !objectsHaveSameKeysDeep(ov1, ov2))
      || (!isObjects && !(key in o2 && key in o2))
    ) {
      return false;
    }
  }
  return true;
};

export async function fetchFileFromUrl (url, name, defaultType = 'text/plain') {
  const response = await fetch(url);
  if (!response.ok) {
    // return Promise.reject(new Error(response.statusText));
    // for this project just throw
    throw new Error(`${response?.url} ${response?.status} ${response?.statusText}`);
  }
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

export const addInlineStyle = (node, styles) => Object.keys(styles).forEach((key) => node.style[key] = styles[key]); // eslint-disable-line no-return-assign
export const clampf = (num, min, max) => { return num <= min ? min : num >= max ? max : num; }; // eslint-disable-line brace-style
export const clampi = (num, min, max) => { return num <= min ? parseInt(min) : num >= max ? parseInt(max) : parseInt(num); }; // eslint-disable-line brace-style
