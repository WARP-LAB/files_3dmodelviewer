/**
 * SPDX-FileCopyrightText: WARP <development@warp.lv>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {
  APP_ID,
} from 'configuration/config.mjs'; // eslint-disable-line import/no-unresolved, n/no-missing-import
import App from 'App/App.vue'; // eslint-disable-line import/no-unresolved, n/no-missing-import

if (OCA.Viewer) {
  OCA.Viewer.registerHandler({
    id: APP_ID,
    group: '3d',
    mimes: [
      'model/3dm-nospec',
      'model/3ds-nospec',
      'model/3mf',
      'model/bim-nospec',
      'model/brep-nospec',
      'model/vnd.collada+xml',
      'model/fbx-nospec',
      'model/fcstd-nospec',
      'model/gltf-binary',
      'model/gltf+json',
      'application/x-step',
      'model/iges',
      'model/obj',
      'model/off-nospec',
      'model/ply-nospec', 'model/vnd.ply',
      'model/step',
      'model/stl', 'application/sla',
      'model/vrml',
      // TODO: 'text/x-gcode',
    ],
    component: App,
  });
}
