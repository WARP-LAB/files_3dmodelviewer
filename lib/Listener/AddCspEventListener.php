<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: WARP <development@warp.lv>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\Files3dModelViewer\Listener;

use OCP\AppFramework\Http\EmptyContentSecurityPolicy;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;

class AddCspEventListener implements IEventListener {

	public function handle(Event $event): void {
		if (!($event instanceof AddContentSecurityPolicyEvent)) {
			return;
		}

		$server_name = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : '';

		// https://github.com/kovacsv/Online3DViewer/blob/master/source/engine/import/importerutils.js now uses CDN
		$csp = new EmptyContentSecurityPolicy();
		$csp->allowEvalWasm();
		$csp->addAllowedWorkerSrcDomain('blob:');
		$csp->addAllowedScriptDomain('blob:');
		$csp->addAllowedScriptDomain("'self' https://cdn.jsdelivr.net ".$server_name);
		$csp->addAllowedScriptDomain("'unsafe-eval'");
		$csp->addAllowedScriptDomain("'wasm-unsafe-eval'");
		$csp->addAllowedStyleDomain("'self'");
		$csp->addAllowedFontDomain("'self'");
		$csp->addAllowedImageDomain("*");
		$csp->addAllowedConnectDomain("blob: https://cdn.jsdelivr.net");
		$csp->addAllowedConnectDomain('data:');
		$csp->addAllowedFrameDomain("'self'");
		$event->addPolicy($csp);
	}
}
