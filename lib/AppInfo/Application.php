<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: WARP <development@warp.lv>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\Files3dModelViewer\AppInfo;
use OCA\Files3dModelViewer\Listener\AddCspEventListener;
use OCA\Files3dModelViewer\Listener\LoadViewerListener;
use OCA\Files3dModelViewer\Listener\LoadPublicViewerListener;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\Security\CSP\AddContentSecurityPolicyEvent;
use OCA\Viewer\Event\LoadViewer;

class Application extends App implements IBootstrap {

	public static function APP_ID() {
		$xml = simplexml_load_file(__DIR__ . '/../../appinfo/info.xml');
		return ($xml === false) ? null : (string)$xml->id;
	}

	public function __construct() {
		parent::__construct(self::APP_ID());
	}

	public function register(IRegistrationContext $context): void {
		$context->registerEventListener(LoadViewer::class, LoadViewerListener::class);
		$context->registerEventListener(BeforeTemplateRenderedEvent::class, LoadPublicViewerListener::class);
		$context->registerEventListener(AddContentSecurityPolicyEvent::class, AddCspEventListener::class);
	}

	public function boot(IBootContext $context): void {
		//
	}
}
