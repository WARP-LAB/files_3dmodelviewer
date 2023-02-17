<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: WARP <development@warp.lv>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\Files3dModelViewer\Migration;

use OCP\Files\IMimeTypeLoader;
use OCP\Migration\IRepairStep;
use OC\Core\Command\Maintenance\Mimetype\UpdateJS;

abstract class MimeTypeBase implements IRepairStep
{
	const CUSTOM_MIMETYPEMAPPING = 'mimetypemapping.json';
	const CUSTOM_MIMETYPEALIASES = 'mimetypealiases.json';
	// https://www.iana.org/assignments/media-types/media-types.xhtml
	// https://technical.buildingsmart.org/standards/ifc/ifc-formats/
	const EXT_MIME_MAP = array(
		'3dm' => ['model/3dm-nospec'],
		'3ds' => ['model/3ds-nospec'],
		'3mf' => ['model/3mf'],
		'bim' => ['model/bim-nospec'],
		'brp' => ['model/brep-nospec'],
		'brep' => ['model/brep-nospec'],
		'dae' => ['model/vnd.collada+xml'],
		'fbx' => ['model/fbx-nospec'],
		'fcstd' => ['model/fcstd-nospec'],
		'glb' => ['model/gltf-binary'],
		'gltf' => ['model/gltf+json'],
		'ifc' => ['application/x-step'],
		'igs' => ['model/iges'],
		'iges' => ['model/iges'],
		'obj' => ['model/obj'],
		'off' => ['model/off-nospec'],
		'ply' => ['model/ply-nospec', 'model/vnd.ply'],
		'stp' => ['model/step'],
		'step' => ['model/step'],
		'stl' => ['model/stl', 'application/sla'],
		'wrl' => ['model/vrml'],
		// 'gcode' => ['text/x-gcode'], // !!!
	);

	// files that will not be previewed by this, but icons might be handy
	const EXT_ICON_EXTRA_MAP = array(
		'mtl' => ['model/mtl'], // we could use text mime, enabling editing it in the browser
	);

	protected $mimeTypeLoader;
	protected $updateJS;

	public function __construct(IMimeTypeLoader $mimeTypeLoader, UpdateJS $updateJS)
	{
		$this->mimeTypeLoader = $mimeTypeLoader;
		$this->updateJS = $updateJS;
	}

	protected function appendToFileMapping(string $filename, array $data) {
		$obj = [];
		if (file_exists($filename)) {
			$content = file_get_contents($filename);
			$obj = json_decode($content, true);
			if (JSON_ERROR_NONE !== json_last_error()) {
				$obj = [];
			}
		}
		foreach ($data as $ext => $mimes) {
			$obj[$ext] = $mimes;
		}
		$mask = empty($obj) ? JSON_FORCE_OBJECT|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES : JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES;
		file_put_contents($filename, json_encode($obj, $mask));
	}

	protected function removeFromFileMapping(string $filename, array $data) {
		$obj = [];
		if (file_exists($filename)) {
			$content = file_get_contents($filename);
			$obj = json_decode($content, true);
			if (JSON_ERROR_NONE !== json_last_error()) {
				$obj = [];
			}
		}
		foreach ($data as $ext => $mimes) {
			unset($obj[$ext]);
		}
		$mask = empty($obj) ? JSON_FORCE_OBJECT|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES : JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES;
		file_put_contents($filename, json_encode($obj, $mask));
	}

	protected function appendToFileAliases(string $filename, array $data) {
		$obj = [];
		if (file_exists($filename)) {
			$content = file_get_contents($filename);
			$obj = json_decode($content, true);
			if (JSON_ERROR_NONE !== json_last_error()) {
				$obj = [];
			}
		}
		foreach ($data as $ext => $mimes) {
			foreach ($mimes as $mime) {
				$obj[$mime] = $ext;
			}
		}
		$mask = empty($obj) ? JSON_FORCE_OBJECT|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES : JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES;
		file_put_contents($filename, json_encode($obj, $mask));
	}

	protected function removeFromFileAliases(string $filename, array $data) {
		$obj = [];
		if (file_exists($filename)) {
			$content = file_get_contents($filename);
			$obj = json_decode($content, true);
			if (JSON_ERROR_NONE !== json_last_error()) {
				$obj = [];
			}
		}
		foreach ($data as $ext => $mimes) {
			foreach ($mimes as $mime) {
				unset($obj[$mime]);
			}
		}
		$mask = empty($obj) ? JSON_FORCE_OBJECT|JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES : JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES;
		file_put_contents($filename, json_encode($obj, $mask));
	}
}
