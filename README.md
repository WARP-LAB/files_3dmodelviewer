<!--
SPDX-FileCopyrightText: WARP <development@warp.lv>
SPDX-License-Identifier: AGPL-3.0-or-later
-->

# 3D Model Viewer for Nextcloud

![3D Model Viewer](/src/img/screenshots/dist/1420x798.png?raw=true "GLTF and environment map")

## Visualise and explore 3D models

| Extension   | Type        | Notes       |
| ----------- | ----------- | ----------- |
| 3dm | Rhino | |
| 3ds | Autodesk 3D Studio | |
| 3mf | 3D Manufacturing Format | |
| bim | dotbim | |
| brep/brp | Boundary Representation | |
| dae | Collada | |
| fbx | Filmbox | |
| fcstd | FreeCAD Standard File Format | |
| glb | GL Transmission Format | binary |
| gltf | GL Transmission Format | separate and embedded |
| ifc | International Foundation Class | no XML or compressed |
| iges/igs | Initial Graphics Exchange Specification | |
| obj | Wavefront | with mtl and textures |
| off | Object File Format | |
| ply | Polygon File Format | |
| step/stp | Standard for Exchange of Product Model Data | |
| stl | Stereolithography Standard Tesselation/Triangle Language | ASCII and Binary |
| wrl | Virtual Reality Modeling Language | superseded by X3D |

Currently the only functionality is basic controls (orbit, pan, zoom), few options for view, camera, environment and model display. See [Development notes](#development-notes).

## Installation

### Nextcloud App Store

[3D Model Viewer](https://apps.nextcloud.com/apps/files_3dmodelviewer)

### Manually

#### Prebuilt

- Visit [releases](https://github.com/WARP-LAB/files_3dmodelviewer/releases)
- Download latest and unzip
- Place `files_3dmodelviewer` directory in `<nextcloud-root>/apps`
- Enable
  - through CLI `php occ app:enable files_3dmodelviewer`
  - or WEB GUI.

#### Build

- Clone this repo in `<nextcloud-root>/apps` && `cd <nextcloud-root>/apps/files_3dmodelviewer`
- Build
  - See [Building](#building)
- Enable
  - through CLI `php occ app:enable files_3dmodelviewer`
  - or WEB GUI.

## Development notes

- The skeleton of this project was created accordingly to [Generate app](https://apps.nextcloud.com/developer/apps/generate).
- A partial effort was made to follow [Coding style & general guidelines](https://docs.nextcloud.com/server/latest/developer_manual/getting_started/codingguidelines.html).
- Node dependency versions are managed through `npx ncu` as Nextcloud uses Vue2 and we need to hold back, see `.ncurc.js`
- Currently building of the project is left to Nextcloud proposed `make`. Given that the project is frontend centric it is subject to change - especially because of hot reload, see notes below.

### Design

Why? [v1r0x/files_3d](https://github.com/v1r0x/files_3d) was used before, however it lacked file support that was necessary for inhouse needs. After evaluating *status quo* it made more sense to make a new app and rely on well maintained and active engine under the hood.

Nextcloud docs on app building [exists](https://docs.nextcloud.com/server/latest/developer_manual/app_development/index.html), however one can truly start to understand what & how after diving into Nextcloud source. Ain't got time for that, therefore shortcuts were made by inspecting these great existing apps and how they have tackled it (especially Nextcloud offical and featured apps)

- [nextcloud/files](https://github.com/nextcloud/server/tree/master/apps/files)
- [nextcloud/viewer](https://github.com/nextcloud/viewer)
- [nextcloud/files_pdfviewer](https://github.com/nextcloud/files_pdfviewer)
- [pawelrojek/nextcloud-drawio](https://github.com/pawelrojek/nextcloud-drawio)
- [Loydl/nc-bpm-app](https://github.com/Loydl/nc-bpm-app)
- [v1r0x/files_3d](https://github.com/v1r0x/files_3d)

Currently this app taps *directly* in `nextcloud/viewer` modal, as it was less code lines to mock it up. However after getting to understand how apps tap into Nextcloud the idea is to use the same approach as `nextcloud/files_pdfviewer`, which is good ol iframe.

- Allows to clearly separate the viewport and its logic from Nextcloud, only bridging what's necessary.
- Nextcloud global CSS space bites, app CSS injection order is unspecified etc. Pain, that can be avoided.
- Ability to develop outside actual running Nextcloud instance.
- No need to stick to Vue 2 if FE engine is to be used. React camp here, but if Vue was chosen, then at least Vue 3.
- Easier management for hot reloading without which feature full GUI development would be a nightmare.

### Test models

No test files in repo.
This loader has been tested by exports provided by various types Blender, Fusion 360, Solidworks, ArchiCAD. There are issues that needs to be addressed in *engine*.

Additionally browse through these files:

- [KhronosGroup/glTF-Sample-Models](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0) glTF up to spec
- [google/draco](https://github.com/google/draco/tree/master/testdata) glTF up to spec
- [Sketchfab/glTF](https://sketchfab.com/features/gltf)
- [Voron](https://github.com/VoronDesign)
- [kovacsv/Online3DViewer](https://github.com/kovacsv/Online3DViewer/tree/master/test/testfiles)

### Todo

- Evaluate *engine*, dependencies that are used to convert each viewable file type to GL buffers. Current *engine* is [online-3d-viewer](https://www.npmjs.com/package/online-3d-viewer) as a fast drop in to handle multiple types. Props to the author!
- Make a decision on whether iframe is used or not, as that affects *lot* of things, including backend (routes, controller).
- App settings in `settings/admin`.
- Implement object convert/export, albeit in Nextcloud context one would do that in a full fledged desktop app.
- Animated models
- Create control GUI and features by *borrowing* ideas from online HTML5 viewers, especially CAD centric features
  - [Autodesk Viewer](https://viewer.autodesk.com/)
  - [Autodesk Fusion 360 View](https://myhub.autodesk360.com/)
  - [Online 3D Viewer](https://3dviewer.net/)

## Building

### Dependencies

- POSIX preferred
- make
- whichcd
- php
- composer
- node (preferred via nvm)
- npm
- tar
- curl

### Prefligth

```sh
nvm use
npm install
```

### Building for prod

```sh
make
```

### Building for dev static

```sh
make dev
```

### Building for dev w/ hotreload

Currently NA, see dev notes above.
