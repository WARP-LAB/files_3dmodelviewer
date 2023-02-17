/**
 * SPDX-FileCopyrightText: WARP <development@warp.lv>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export const STORAGE_KEY = 'files_3dmodelviewer';
export const FACTORY_GUI_VALID_ENV = [
  {
    id: 'zbyg_studio003ldr',
    label: 'Studio 003 LDR',
  },
  {
    id: 'zbyg_studio004ldr',
    label: 'Studio 004 LDR',
  },
  {
    id: 'zbyg_studio005ldr',
    label: 'Studio 005 LDR',
  },
  {
    id: 'zbyg_studio006ldr',
    label: 'Studio 006 LDR',
  },
  {
    id: 'zbyg_studio008ldr',
    label: 'Studio 008 LDR',
  },
  {
    id: 'zbyg_studio011ldr',
    label: 'Studio 011 LDR',
  },
  {
    id: 'zbyg_studio013ldr',
    label: 'Studio 013 LDR',
  },
  {
    id: 'zbyg_studio018ldr',
    label: 'Studio 018 LDR',
  },
  {
    id: 'zbyg_studio022ldr',
    label: 'Studio 022 LDR',
  },
  {
    id: 'zbyg_studio023ldr',
    label: 'Studio 023 LDR',
  },
  {
    id: 'zbyg_studio024ldr',
    label: 'Studio 024 LDR',
  },
];

export const FACTORY_GUI_PARAMS = {
  ui: {
    pane: {
      expanded: true,
    },
    view: {
      expanded: true,
    },
    camera: {
      expanded: true,
    },
    environment: {
      expanded: true,
    },
    model: {
      expanded: true,
    },
  },
  values: {
    viewUp: 2,
    //
    camType: 1,
    camOrb: 1,
    //
    envId: 'zbyg_studio013ldr',
    envUseAsBg: true,
    envBgCol: {r: 250, g: 249, b: 246, a: 1},
    //
    modelEdgesShow: true,
    modelEdgesCol: {r: 10, g: 10, b: 10},
    modelEdgesAngle: 45,
  },
};

export const ENV_SUFFIXES_ORDER = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'];
