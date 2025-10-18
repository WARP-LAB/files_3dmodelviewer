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

		$csp = new EmptyContentSecurityPolicy();
		$csp->allowEvalScript(); // DEPR: see NC sources
		$csp->allowEvalWasm();
		$csp->addAllowedScriptDomain("'self' ".$server_name);
		$csp->addAllowedStyleDomain("'self'");
		$csp->addAllowedFontDomain("'self'");
		$csp->addAllowedImageDomain("*");
		$csp->addAllowedConnectDomain("blob:");
		$csp->addAllowedFrameDomain("'self'");
		$event->addPolicy($csp);
	}
}
