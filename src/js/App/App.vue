<!--
SPDX-FileCopyrightText: WARP <development@warp.lv>
SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    :class="$style.containApp"
    :id="`${uuid}`"
    :style="{width: isSidebarShown ? `calc(100% - ${sidebarWidth}px)` : null }"
  >
    <section
      :class="$style.containCanvas"
    />
    <aside
      :class="$style.containFloatGui"
      class="warp-scoper__gui"
    />
  </div>
</template>

<script
  src="./App.mjs"
></script>

<style
  lang="scss"
  src="./App.global.scss"
></style>

<style
  module
  lang="scss"
  src="./App.module.scss"
></style>

