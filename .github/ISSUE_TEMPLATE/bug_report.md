---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug, 0. Needs triage
assignees: ''

---

## Describe the bug

<!-- A clear and concise description of what the bug is. -->

## To Reproduce

Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected behavior

<!-- A clear and concise description of what you expected to happen. -->

## I have checked that the files are not corrupted

<!-- You must have tried opening it in a desktop app. Which and what is the result there? E.g., "When I import the file in question in Blender everything is fine". -->

Yes, using `<name it>`.

## Screenshots

<!-- If applicable, add screenshots to help explain your issue. -->

## Browser log

<!-- 
Open your console, reload your page and/or do the action leading to this issue and copy/paste the log in this thread.
-->

<details>
<summary>How to access your browser console (Click to expand)</summary>

### Chrome

1. Press either CTRL + SHIFT + I / CMD + ALT + I or F12 to open the Developer Tools.
2. Click the “console” tab.

### Safari

1. Press CMD + ALT + I to open the Web Inspector.
2. See Chrome’s step 2. (Chrome and Safari have pretty much identical dev tools.)

### IE

1. Press F12 to open the developer tools.
2. Click the “console” tab.

### Firefox

1. Press CTRL + SHIFT + K to open the Web console (COMMAND + SHIFT + K on Macs).
2. or, if Firebug is installed (recommended):
    1. Press F12 to open Firebug.
    2. Click on the “console” tab.

### Opera

1. Press CTRL + SHIFT + I to open Dragonfly.
2. Click on the “console” tab.

</details>

## Installation and configuration

### How the app was installed?
<!-- Leave one of the following -->
- Via app store.
- Manually. Downloading `files_3dmodelviewer.tar.gz` from releases and unzipping the directory.
- Manually. Cloning and building.

### App server configuration Parameters
<!--
Please chnage the statemet below, if `apps_path` key is explicitly set in `config/config.php`. If not set, leave as it is.
References
https://docs.nextcloud.com/server/latest/admin_manual/apps_management.html#using-custom-app-directories
https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/config_sample_php_parameters.html#apps
As well as in which `'path'` from those specified files_3dmodelviewer directory actually resides
-->
- `apps_path` parameter is not explicitly configured/customised in `config/config.php`

## Versions

### Nextcloud

- Version: <!-- e.g. 25.0.4 -->
- Webserver: <!--  e.g. Apache, nginx -->

### Desktop

<!-- please complete the following information if applicable -->

- OS: <!-- e.g. Ubuntu 22.04.2, macOS 10.15, Windows 11 -->
- Browser and version: <!--  e.g. Chrome 110.0.5481.77, Safari 16.3, Firefox 110.0, Edge 110 -->

### Handheld

<!-- please complete the following information if applicable -->

- Device: <!-- e.g. iPhone 14, Google Pixel 6a -->
- OS: <!-- e.g. iOS 16.3.1, Android 13 -->
- Browser and version: <!--  e.g. Chrome 110.0.5481.77, Safari 16.3, Firefox 110.0, Edge 110 -->

## Additional context

<!-- Add any other context about the issue. -->

<!-- Sometimes apps clash, it might help if you would issue command `php occ app:list` and paste output here, too -->
