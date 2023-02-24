/**
 * SPDX-FileCopyrightText: WARP <development@warp.lv>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/* global
  __TIER_DEVELOPMENT__
*/

import {
  v4 as uuidv4,
} from 'uuid';

import {
  subscribe,
  unsubscribe,
} from '@nextcloud/event-bus';

import {
  generateFilePath,
} from '@nextcloud/router';

import {
  APP_ID,
  STORAGE_KEY,
  FACTORY_GUI_VALID_ENV,
  FACTORY_GUI_PARAMS,
  ENV_SUFFIXES_ORDER,
} from 'configuration/config.mjs'; // eslint-disable-line import/no-unresolved, n/no-missing-import

import {
  fetchFileFromUrl,
  objectsHaveSameKeysDeep,
  addInlineStyle,
  clampf,
} from 'helpers/warp-helpers.mjs'; // eslint-disable-line import/no-unresolved, n/no-missing-import

import * as OV from 'online-3d-viewer';
import {Pane} from 'tweakpane';
import logger from 'logger/logger.mjs'; // eslint-disable-line import/no-unresolved, n/no-missing-import

// ----------------

export default {
  name: 'App',
  // props: {},
  // computed: {},
  data () {
    return {
      forceRecompute: 0,
      uuid: `uuid-${uuidv4()}`,
      sidebarWidth: document.querySelector('aside.app-sidebar')?.offsetWidth || 0,
      isSidebarShown: false,
      domElApp: null,
      domElContainerCanvas: null,
      domElContainerFloatGui: null,
      domElContainerLoading: null,
      viewerObj: null,
      guiPane: null,
      guiParams: null,
    };
  },
  watch: {
    active (val, old) {
      if (val === true && old === false) {
        this.construct();
      }
      else if (val === false && old === true) {
        this.destruct();
      }
    },
    isSidebarShown () {
      setTimeout(this.updateHeightWidth, 100);
    },
  },
  // NOTE: Vue 2 Lifecycle Hooks
  // beforeCreate () {},
  created () {
    subscribe('files:sidebar:opened', this.handleAppSidebarOpen);
    subscribe('files:sidebar:closed', this.handleAppSidebarClose);
    window.addEventListener('resize', this.handleWindowResize);
  },
  // beforeMount () {},
  mounted () {
    this.doneLoading(); // NC viewer
    this.updateHeightWidth(); // NC viewer
    this.$nextTick(() => {
      this.$el.focus();
      this.construct();
    });
  },
  // beforeUpdate () {},
  updated () {
    this.$nextTick(() => {
      this.setViewerWidthOnSidebar();
    });
  },
  // activated () {},
  // deactivated () {},
  beforeDestroy () {
    this.destruct();
  },
  destroyed () {
    unsubscribe('files:sidebar:opened', this.handleAppSidebarOpen);
    unsubscribe('files:sidebar:closed', this.handleAppSidebarClose);
    window.removeEventListener('resize', this.handleWindowResize);
  },
  errorCaptured (error) {
    logger.error('errorCaptured', error?.name, error?.message, error);
  },
  methods: {
    handleWindowResize () {
      // NOTE: issue is that on window resize sidebar changes size
      // TODO: debounce
      const domElSidebar = document.querySelector('aside.app-sidebar');
      if (domElSidebar) {
        this.sidebarWidth = domElSidebar.offsetWidth;
      }
      this.redrawAfterSidebarTransition();
    },
    handleAppSidebarOpen () {
      this.handleAppSidebarToggle(true);
    },
    handleAppSidebarClose () {
      this.handleAppSidebarToggle(false);
    },
    handleAppSidebarToggle (state) {
      if (state) {
        this.isSidebarShown = true;
        const domElSidebar = document.querySelector('aside.app-sidebar');
        if (domElSidebar) {
          this.sidebarWidth = domElSidebar.offsetWidth;
        }
        this.redrawAfterSidebarTransition();
      }
      else {
        this.isSidebarShown = false;
        this.trapElements = [];
        this.redrawAfterSidebarTransition();
      }
    },
    redrawAfterSidebarTransition () {
      setTimeout(() => {
        this.$nextTick(() => {
          this.forceRecompute++;
          this.setViewerWidthOnSidebar();
        });
      }, 110);
    },
    setViewerWidthOnSidebar () {
      this.viewerObj?.Resize();
    },
    paramsLoad () {
      this.guiParams = {...FACTORY_GUI_PARAMS};
      try {
        const savedParams = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!objectsHaveSameKeysDeep(FACTORY_GUI_PARAMS, savedParams)) {
          throw new Error('Schema does not match, probably some update, will not migrate, just reset.');
        }
        this.guiParams = {...savedParams};
      }
      catch (error) {
        logger.error('error fetching states from storage', error?.name, error);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(FACTORY_GUI_PARAMS));
      }
    },
    paramsSave () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.guiParams));
    },
    destruct () {
      this.guiPane?.dispose();
      this.guiPane = null;

      if (this.viewerObj) {
        this.viewerObj.Destroy();
        this.viewerObj = null;
      }
      this.domElContainerCanvas?.replaceChildren();
      this.domElContainerFloatGui?.replaceChildren();
      this.domElContainerCanvas = null;
      this.domElContainerFloatGui = null;
      this.domElContainerLoading = null;
      if (this.domElApp) {
        this.domElApp.style.display = 'none';
      }
    },
    async construct () {
      // NOTE: disable swipe, as we are using mouse to navigate scene and it might trigger lef/righ prev/next file
      this.disableSwipe();
      this.setViewerWidthOnSidebar();

      this.domElApp = document.getElementById(this.uuid);
      if (!this.domElApp) {
        return;
      }
      if (!this.active) {
        this.destruct();
        return;
      }
      this.domElApp.style.display = 'block';

      this.domElContainerCanvas = this.domElApp.querySelector(`.${this.$style.containCanvas}`);
      this.domElContainerFloatGui = this.domElApp.querySelector(`.${this.$style.containFloatGui}`);

      this.domElContainerLoading = document.createElement('div');
      const domElSpinner = document.createElement('div');
      addInlineStyle(domElSpinner, {
        backgroundImage: `url('${generateFilePath(APP_ID, '', 'img/app.svg')}')`,
      });
      this.domElContainerLoading.appendChild(domElSpinner);
      this.domElContainerCanvas.appendChild(this.domElContainerLoading);

      const modelFetchUrl = this.source || this.davPath;
      const modelBasenameFs = this.basename;
      const modelBasenameEnc = encodeURIComponent(modelBasenameFs);
      const modelExt = this.basename.split('.').pop();
      const modelMime = this.mime;

      logger.debug('modelFetchUrl', modelFetchUrl);
      logger.debug('modelBasenameFs', modelBasenameFs);
      logger.debug('modelBasenameEnc', modelBasenameEnc);
      logger.debug('modelExt', modelExt);
      logger.debug('modelMime', modelMime);

      let fileModel;
      let filesToPass = [];

      try {
        fileModel = await fetchFileFromUrl(modelFetchUrl, modelBasenameFs, modelMime);
      }
      catch (error) {
        logger.error('error fetching object', error?.name, error);
        this.destruct();
        return;
      }

      filesToPass.push(fileModel);

      // NOTE: parsing multifile models needed here
      // TODO: bring this out and atomise
      if (modelExt === 'gltf') {
        const gltfTxt = await fileModel.text();
        try {
          const gltfJson = JSON.parse(gltfTxt);
          for (const buffer of gltfJson.buffers) {
            if (!buffer.uri) continue;
            const gltfBinFetchUrl = modelFetchUrl.replace(modelBasenameFs, buffer.uri);
            const gltfBinFile = await fetchFileFromUrl(gltfBinFetchUrl, buffer.uri, 'application/octet-stream');
            filesToPass.push(gltfBinFile);
          }
          for (const image of gltfJson.images) {
            if (!image.uri) continue;
            const gltfTexFetchUrl = modelFetchUrl.replace(modelBasenameFs, image.uri);
            const gltfTexFile = await fetchFileFromUrl(gltfTexFetchUrl, image.uri);
            filesToPass.push(gltfTexFile);
          }
        }
        catch (error) {
          logger.error('error loading gltf', error?.name, error);
        }
      }

      if (modelExt === 'obj') {
        // TODO: differentiate between public and authorised case
        // TODO: there is no reason why obj files could not reference mtl files that are ABOVE in the file tree and same for textures referenced in mtl files, look at that

        // Load all .mtl files referenced in .obj
        let mtlFilesLoaded = [];
        let texFilesLoaded = [];

        // parse obj file and find all referenced .mtl files
        const objTxt = await fileModel.text();
        const mtlRelativePathWithBasenameFss = [
          ...new Set(
            [
              ...objTxt.matchAll(
                /^\s*mtllib[^\S\r\n]+(.*?)$/gm,
              ),
            ].map((capture) => capture[1]),
          ),
        ];
        // construct fetch data for mtl
        const objMtlFetchData = [];
        for (const mtlRelativePathWithBasenameFs of mtlRelativePathWithBasenameFss) {
          // FIXME: for public paths split between `path` and `file` query params, construct the canonically correct URI
          const mtlFetchUrl = modelFetchUrl.replace(modelBasenameEnc, encodeURIComponent(mtlRelativePathWithBasenameFs));
          objMtlFetchData.push({
            url: mtlFetchUrl,
            name: mtlRelativePathWithBasenameFs,
            type: 'model/mtl',
          });
        }
        // try fetching all mtl files and read info blobs
        try {
          const mtlFilesToPassRes = await Promise.allSettled( // eslint-disable-line
            objMtlFetchData.map((mtl) => {
              return fetchFileFromUrl(mtl.url, mtl.name, mtl.type);
            }),
          );
          mtlFilesLoaded = mtlFilesToPassRes.filter((o) => o.status === 'fulfilled').map((s) => s.value);
          filesToPass = [...filesToPass, ...mtlFilesLoaded];
        }
        catch (error) {
          logger.error('error loading obj materials', error?.name, error);
        }

        // parse all mtl files and find all referenced texture files
        const texRelativePathWithBasenameFssAcc = [];
        for (const mtlFile of mtlFilesLoaded) {
          const mtlTxt = await mtlFile.text();
          texRelativePathWithBasenameFssAcc.push(
            ...[
              ...mtlTxt.matchAll(
                /^\s*map_[A-Za-z0-9_]+[^\S\r\n]+(.*?)$/gm,
              ),
            ].map((capture) => capture[1]),
          );
        }
        const texRelativePathWithBasenameFss = [...new Set(texRelativePathWithBasenameFssAcc)];

        // construct fetch data for tex
        const objTexFetchData = [];
        for (const texRelativePathWithBasenameFs of texRelativePathWithBasenameFss) {
          // FIXME: for public paths split between `path` and `file` query params, construct the canonically correct URI
          // FIXME: tex relative to model or mtl?!?!
          const texFetchUrl = modelFetchUrl.replace(modelBasenameEnc, encodeURIComponent(texRelativePathWithBasenameFs));
          objTexFetchData.push({
            url: texFetchUrl,
            name: texRelativePathWithBasenameFs,
          });
        }
        try {
          const texFilesToPassRes = await Promise.allSettled( // eslint-disable-line
            objTexFetchData.map((tex) => {
              return fetchFileFromUrl(tex.url, tex.name);
            }),
          );
          texFilesLoaded = texFilesToPassRes.filter((o) => o.status === 'fulfilled').map((s) => s.value);
          filesToPass = [...filesToPass, ...texFilesLoaded];
        }
        catch (error) {
          logger.error('error loading obj textures', error?.name, error);
        }
      }

      logger.debug('will load model and extra fles', filesToPass);

      this.paramsLoad();

      // assuming that installed under apps/, not some custom path enabled by "apps_paths" key in config.php
      OV.SetExternalLibLocation(generateFilePath(APP_ID, '', 'js/libs'));
      // https://kovacsv.github.io/Online3DViewer/Function_Init3DViewerFromFileList.html
      // retuns EmbeddedViewer
      this.viewerObj = OV.Init3DViewerFromFileList(
        this.domElContainerCanvas,
        filesToPass,
        {
          cameraMode: this.guiParams.values.camType,
          environmentSettings: new OV.EnvironmentSettings(
            ENV_SUFFIXES_ORDER.map((sfx) => {
              return generateFilePath(APP_ID, '', `img/envmaps/${this.guiParams.values.envId}/${sfx}.png`);
            }),
            this.guiParams.values.envUseAsBg,
          ),
          backgroundColor: new OV.RGBAColor(
            this.guiParams.values.envBgCol.r,
            this.guiParams.values.envBgCol.g,
            this.guiParams.values.envBgCol.b,
            clampf(this.guiParams.values.envBgCol.a * 255, 0, 255),
          ),
          edgeSettings: new OV.EdgeSettings(
            this.guiParams.values.modelEdgesShow,
            new OV.RGBColor(this.guiParams.values.modelEdgesCol.r, this.guiParams.values.modelEdgesCol.g, this.guiParams.values.modelEdgesCol.b),
            this.guiParams.values.modelEdgesAngle,
          ),
          onModelLoaded: (ev) => {
            if (this.domElContainerLoading) this.domElContainerLoading.remove();
            logger.debug(`model ${this.basename} loaded in container ${this.uuid}`);
            this.setViewerWidthOnSidebar();
            this.initGui();
            // FIXME: ? https://github.com/nextcloud/viewer/issues/1550
          },
        },
      );
    },
    initGui () {

      // apply settings to object, that are not available in constructor
      this.viewerObj?.GetViewer().SetUpVector(this.guiParams.values.viewUp);
      this.viewerObj?.GetViewer().SetCameraMode(this.guiParams.values.camType);
      this.viewerObj?.GetViewer().SetFixUpVector(this.guiParams.values.camOrb === 1);
      this.viewerObj?.GetViewer().FitSphereToWindow(
        this.viewerObj?.GetViewer().GetBoundingSphere((meshUserData) => true),
        true,
      );

      // --------------------------------
      this.guiPane = new Pane({
        container: this.domElContainerFloatGui,
        title: '3D Model Viewer',
        expanded: this.guiParams.ui.pane.expanded,
      })
        .on('fold', (ev) => {
          this.guiParams.ui.pane.expanded = ev.expanded;
          this.paramsSave();
        });

      // --------------------------------
      const f1 = this.guiPane.addFolder({
        title: 'View',
        expanded: this.guiParams.ui.view.expanded,
      })
        .on('fold', (ev) => {
          this.guiParams.ui.view.expanded = ev.expanded;
          this.paramsSave();
        });
      // NOTE: user might browse through multiple files with same axis convention, set these nonvolatile
      f1.addBlade({
        view: 'list',
        label: 'Up vector',
        options: [
          {text: 'X', value: 1},
          {text: 'Y', value: 2},
          {text: 'Z', value: 3},
        ],
        value: this.guiParams.values.viewUp,
      })
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values.viewUp = ev.value;
          this.viewerObj?.GetViewer().SetUpVector(this.guiParams.values.viewUp);
          this.paramsSave();
        });
      f1.addButton({title: 'Flip up'})
        .on('click', (ev) => {
          this.viewerObj?.GetViewer().FlipUpVector();
        });

      // --------------------------------
      const f2 = this.guiPane.addFolder({
        title: 'Camera',
        expanded: this.guiParams.ui.camera.expanded,
      })
        .on('fold', (ev) => {
          this.guiParams.ui.camera.expanded = ev.expanded;
          this.paramsSave();
        });
      f2.addButton({title: 'Zoom to fit'})
        .on('click', (ev) => {
          this.viewerObj?.GetViewer().FitSphereToWindow(
            this.viewerObj?.GetViewer().GetBoundingSphere((meshUserData) => true),
            true,
          );
        });
      f2.addBlade({
        view: 'list',
        label: 'Camera type',
        options: [
          {text: 'Perspective', value: 1},
          {text: 'Ortographic', value: 2},
        ],
        value: this.guiParams.values.camType,
      })
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values.camType = ev.value;
          this.viewerObj?.GetViewer().SetCameraMode(this.guiParams.values.camType);
          this.paramsSave();
        });
      f2.addBlade({
        view: 'list',
        label: 'Orbit type',
        options: [
          {text: 'Fixed up', value: 1},
          {text: 'Free', value: 2},
        ],
        value: this.guiParams.values.camOrb,
      })
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values.camOrb = ev.value;
          this.viewerObj?.GetViewer().SetFixUpVector(this.guiParams.values.camOrb === 1);
          this.paramsSave();
        });

      // --------------------------------
      const validatedEnvId = (vId) => {
        return FACTORY_GUI_VALID_ENV.some((env) => env.id === vId) ? vId : FACTORY_GUI_VALID_ENV[0].id;
      };
      const updateEnvironment = () => {
        this.viewerObj?.GetViewer().SetEnvironmentMapSettings(
          new OV.EnvironmentSettings(
            ENV_SUFFIXES_ORDER.map((sfx) => {
              return generateFilePath(APP_ID, '', `img/envmaps/${this.guiParams.values.envId}/${sfx}.png`);
            }),
            this.guiParams.values.envUseAsBg,
          ),
        );
        this.paramsSave();
      };
      const f3 = this.guiPane.addFolder({
        title: 'Environment',
        expanded: this.guiParams.ui.environment.expanded,
      })
        .on('fold', (ev) => {
          this.guiParams.ui.environment.expanded = ev.expanded;
          this.paramsSave();
        });
      f3.addBlade({
        view: 'list',
        label: 'Environment texture',
        options: FACTORY_GUI_VALID_ENV.reduce((acc, curr) => {
          return [...acc, {
            text: curr.label,
            value: curr.id,
          }];
        }, []),
        value: this.guiParams.values.envId,
      })
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values.envId = validatedEnvId(ev.value);
          updateEnvironment();
        });
      f3.addInput(this.guiParams.values, 'envUseAsBg', {label: 'Environment background'})
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values[ev.presetKey] = ev.value;
          updateEnvironment();
        });
      f3.addInput(this.guiParams.values, 'envBgCol', {label: 'Background color'})
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values[ev.presetKey] = ev.value;
          this.viewerObj?.GetViewer().SetBackgroundColor(
            new OV.RGBAColor(
              this.guiParams.values.envBgCol.r,
              this.guiParams.values.envBgCol.g,
              this.guiParams.values.envBgCol.b,
              clampf(this.guiParams.values.envBgCol.a * 255, 0, 255),
            ),
          );
          updateEnvironment();
        });

      // --------------------------------
      const updateEdges = () => {
        this.viewerObj?.GetViewer().SetEdgeSettings(
          new OV.EdgeSettings(
            this.guiParams.values.modelEdgesShow,
            new OV.RGBColor(this.guiParams.values.modelEdgesCol.r, this.guiParams.values.modelEdgesCol.g, this.guiParams.values.modelEdgesCol.b),
            this.guiParams.values.modelEdgesAngle,
          ),
        );
        this.paramsSave();
      };
      const f4 = this.guiPane.addFolder({
        title: 'Model',
        expanded: this.guiParams.ui.model.expanded,
      })
        .on('fold', (ev) => {
          this.guiParams.ui.model.expanded = ev.expanded;
          this.paramsSave();
        });
      f4.addInput(this.guiParams.values, 'modelEdgesShow', {label: 'Show edges'})
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values[ev.presetKey] = ev.value;
          updateEdges();
        });
      f4.addInput(this.guiParams.values, 'modelEdgesCol', {label: 'Edge color'})
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values[ev.presetKey] = ev.value;
          updateEdges();
        });
      f4.addInput(this.guiParams.values, 'modelEdgesAngle', {label: 'Edge threshold °', min: 0, max: 135})
        .on('change', (ev) => {
          if (!ev.last) return;
          this.guiParams.values[ev.presetKey] = ev.value;
          updateEdges();
        });

      if (__TIER_DEVELOPMENT__) {
        this.guiPane.on('change', (ev) => {
          logger.debug(`changed: ${JSON.stringify(ev.presetKey)} ${JSON.stringify(ev.value)} ${JSON.stringify(ev.last)}`);
        });
      }
    },
  },
};
