/**
 * SPDX-FileCopyrightText: WARP <development@warp.lv>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* global
  __WARP_DEBUG__,
  localStorage,
*/

import DebugWarpSuperBrowserOnly from 'debug/src/browser.js';

const WARP_NAMESPACE = 'WARP';
const debugWarpSuperSt = new DebugWarpSuperBrowserOnly(WARP_NAMESPACE);

function debugWarpCreate (extendNs, enableAuto = true) {
  if (enableAuto) {
    debugEnableWarpForNamespace(extendNs);
  }
  else {
    // debugDisableWarpForNamespace(extendNs);
  }
  return debugWarpSuperSt.extend(extendNs);
}

function debugWarpGetEnabled () {
  const allEnabled = DebugWarpSuperBrowserOnly.disable().split(',');
  DebugWarpSuperBrowserOnly.enable(allEnabled.join(','));
  return allEnabled;
}

function debugDisableSuper () {
  DebugWarpSuperBrowserOnly.disable();
}

function debugClear () {
  debugDisableSuper();
  try {
    localStorage.removeItem('debug');
  }
  catch (error) {
    //
  }
}

function debugDisableWarp () {
  debugDisableWarpForNamespace('*');
}

function debugEnableWarpForNamespace (ns) {
  if (!(typeof __WARP_DEBUG__ !== 'undefined' && __WARP_DEBUG__ === true)) {
    return;
  }
  const nsToManage = `${WARP_NAMESPACE}:${ns}`;
  let newListArrAll = [];
  const newListStrAll = DebugWarpSuperBrowserOnly.disable();
  if (newListStrAll) {
    newListArrAll = newListStrAll.split(',');
  }
  newListArrAll.push(nsToManage);
  const newListArrUniqClean = [...new Set(newListArrAll)].filter((ne) => ne);
  DebugWarpSuperBrowserOnly.enable(newListArrUniqClean.join(','));
}

function debugDisableWarpForNamespace (ns) {
  const nsToManage = `${WARP_NAMESPACE}:${ns}`;
  let newListArrAll = DebugWarpSuperBrowserOnly.disable().split(',');
  newListArrAll = newListArrAll.filter((nsStr) => {
    const shouldKeepAsDiffersExact = (nsStr !== nsToManage);
    const shouldKeepAsDiffersRegex = !(new RegExp('^' + nsToManage.replace(/\*/g, '.*') + '$').test(nsStr));
    return (shouldKeepAsDiffersExact && shouldKeepAsDiffersRegex);
  });
  const newListArrUniqClean = [...new Set(newListArrAll)].filter((ne) => ne);
  DebugWarpSuperBrowserOnly.enable(newListArrUniqClean.join(','));
}

export {
  debugEnableWarpForNamespace,
  debugDisableWarpForNamespace,
  debugDisableSuper,
  debugClear,
  debugDisableWarp,
  debugWarpGetEnabled,
  debugWarpCreate,
};
