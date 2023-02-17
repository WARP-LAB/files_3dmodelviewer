<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: WARP <development@warp.lv>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\Files3dModelViewer\Migration;

require \OC::$SERVERROOT . "/3rdparty/autoload.php";

use OCP\Migration\IOutput;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\ConsoleOutput;

class MimeTypeUninstall extends MimeTypeBase
{
	public function getName()
	{
		return 'MIME types for Files3dModelViewer uninstall';
	}

	private function inFileCache()
	{
		// NOTE: force back to downloadable type in cache, what else?
		$mimeTypeId = $this->mimeTypeLoader->getId('application/octet-stream');
		foreach(array_keys(self::EXT_MIME_MAP) as $ext){
			$this->mimeTypeLoader->updateFilecache($ext, $mimeTypeId); // FIXME: see NC sources
		}
	}

	private function inConfigFiles()
	{
		$configDir = \OC::$configDir;
		$mimetypemappingFile = $configDir . self::CUSTOM_MIMETYPEMAPPING;
		$mimetypealiasesFile = $configDir . self::CUSTOM_MIMETYPEALIASES;

		$this->removeFromFileMapping($mimetypemappingFile, array_merge(self::EXT_MIME_MAP, self::EXT_ICON_EXTRA_MAP));

		$this->removeFromFileAliases($mimetypealiasesFile, array_merge(self::EXT_MIME_MAP, self::EXT_ICON_EXTRA_MAP));

		$this->updateJS->run(new StringInput(''), new ConsoleOutput());
	}

	private function inIcons()
	{
		// on uninstall leave the icons
	}

	public function run(IOutput $output)
	{
		$output->info('Uninstalling MIME types...');
		$this->inFileCache();
		$this->inConfigFiles();
		$this->inIcons();
		$output->info('...done.');
	}

}
