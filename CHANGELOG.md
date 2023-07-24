# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.12]

### Fixed

- Workaround for `simplexml_load_file` without much digging

## [0.0.11]

### Fixed

- Performance boost (disable VueJS reactivity)

## [0.0.10]

### Fixed

- Fixed version number

## [0.0.9]

### Changed

- Added support for Nextcloud 27 and future 28

## [0.0.8]

### Changed

- Added support for Nextcloud 26

## [0.0.7]

### Fixed

- CSP drastic fix for <https://github.com/WARP-LAB/files_3dmodelviewer/issues/5>

## [0.0.6]

### Added

- Support for custom app install paths as [described here](https://docs.nextcloud.com/server/latest/admin_manual/apps_management.html#using-custom-app-directories).

## [0.0.5]

### Added

- References to screenshots for app store.

## [0.0.4]

### Added

- FreeCAD icon (`fcstd` fyle type)
- Link to FreeCAD file references, that can be used to test the app

### Fixed

- Camera type loading from saved state

### Removed

- Dependencies that are not used, but were used when mocking the app

## [0.0.3]

### Fixed

- MIME nextcloud JSON for cases where it is empty, especially after app disable

### Changed

- Readme
- Default GUI state for first open, where all subpanels are in closed state

## [0.0.2]

### Changed

- Cleanup

## [0.0.1]

### Added

- Initial push.
