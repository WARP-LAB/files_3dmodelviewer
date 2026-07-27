/**
 * SPDX-FileCopyrightText: WARP <development@warp.lv>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {
  APP_ID,
} from 'configuration/config.mjs'; // eslint-disable-line import/no-unresolved, n/no-missing-import
import App from 'App/App.vue'; // eslint-disable-line import/no-unresolved, n/no-missing-import

if (OCA.Viewer) {
  try {
    OCA.Viewer.registerHandler({
      id: APP_ID,
      group: '3d',
      canCompare: false,
      mimes: [
        'model/3dm-nospec',
        'model/3ds-nospec',
        'model/3mf',
        'model/amf',
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
  } catch (error) {
    if (error?.message?.includes('already registered') || error?.message?.includes('duplicate') || error?.message?.includes('same name')) {
      // eslint-ignore-line
    } else {
      console.error('error in registerHandler:', error);
    }
  }
}
