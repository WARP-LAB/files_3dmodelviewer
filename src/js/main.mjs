/**
 * SPDX-FileCopyrightText: WARP <development@warp.lv>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import App from './App/App.vue';

if (OCA.Viewer) {
  OCA.Viewer.registerHandler({
    id: 'files_3dmodelviewer',
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
