<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: WARP <development@warp.lv>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\Files3dModelViewer\Migration;

require \OC::$SERVERROOT . "/3rdparty/autoload.php";

use OCP\Migration\IOutput;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\ConsoleOutput;

class MimeTypeInstall extends MimeTypeBase
{
	public function getName()
	{
		return 'MIME types for Files3dModelViewer install';
	}

	private function inFileCache()
	{
		foreach(self::EXT_MIME_MAP as $ext => $mimes){
			// TODO: does NC DB structure can hold one mime for ext, so we should use just the first one from EXT_MIME_MAP, if multiple specified?
			// e.g. $mime = is_array($mimes) ? array_key_first($mimes) : $mimes;
			$mimes = is_array($mimes) ? $mimes : array($mimes);
			foreach($mimes as $mime) {
				$mimeTypeId = $this->mimeTypeLoader->getId($mime);
				$this->mimeTypeLoader->updateFilecache($ext, $mimeTypeId); // FIXME: see NC sources
			}
		}
	}

	private function inConfigFiles()
	{
		$configDir = \OC::$configDir;
		$mimetypemappingFile = $configDir . self::CUSTOM_MIMETYPEMAPPING;
		$mimetypealiasesFile = $configDir . self::CUSTOM_MIMETYPEALIASES;

		$this->appendToFileMapping($mimetypemappingFile, array_merge(self::EXT_MIME_MAP, self::EXT_ICON_EXTRA_MAP));

		// add MIME type aliases for icons, as values use extensions for now
		$this->appendToFileAliases($mimetypealiasesFile, array_merge(self::EXT_MIME_MAP, self::EXT_ICON_EXTRA_MAP));

		$this->updateJS->run(new StringInput(''), new ConsoleOutput());
	}

	private function inIcons()
	{
		$iconNames = array_keys(array_merge(self::EXT_MIME_MAP, self::EXT_ICON_EXTRA_MAP));

		foreach ($iconNames as $iconName)
		{
			$source = __DIR__ . '/../../img/icons-mime/gen.svg';
            $sourceSpec = __DIR__ . '/../../img/icons-mime/spec-' . $iconName . '.svg';
			if (file_exists($sourceSpec)) {
				$source = $sourceSpec;
			}
            $target = \OC::$SERVERROOT . '/core/img/filetypes/' . $iconName . '.svg';
            if (!file_exists($target) || md5_file($target) !== md5_file($source))
            {
                copy($source, $target);
            }
		}
	}

	public function run(IOutput $output)
	{
		$output->info('Installing MIME types...');
		$this->inFileCache();
		$this->inConfigFiles();
		$this->inIcons();
		$output->info('...done.');
	}
}
