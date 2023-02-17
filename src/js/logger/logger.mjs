/**
 * SPDX-FileCopyrightText: WARP <development@warp.lv>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// NOTE:
// Don't like Nextcloud logger, but let us respect it :)
// Use Nextcloud logger for all build tiers, except development
// Meaning that built product will produce Nextcloud style logs, according to loglevel_frontend config param

/* global
  __TIER_DEVELOPMENT__
*/

'use strict';

import {getLoggerBuilder} from '@nextcloud/logger';
import {debugWarpCreate} from 'helpers/warp-debug.mjs'; // eslint-disable-line
// --------------------------------

// On dev we will use debug (WARP encapsulation), on other tiers Nextcloud logger
// Create proxy for Nextcloud case for debugWarpCreate
let debugsApp; // don't even create on nondev
const loggerRaw = getLoggerBuilder()
  .setApp('files_3dmodelviewer')
  .detectUser()
  .build();

// skip fast-safe-stringify stuff, this is frontend
const logproxy = new Proxy({}, {
  get (target, prop, receiver) {
    return function (...args) {
      if (__TIER_DEVELOPMENT__) {
        if (!debugsApp) debugsApp = debugWarpCreate('3DModelViewer');
        debugsApp.apply(debugsApp, [prop, ...args]);
      }
      else {
        // the issue with the logger, formatting when multiple args passed -> just spew string for now
        loggerRaw[prop](JSON.stringify(args));
      }
    };
  },
});

export default logproxy;
