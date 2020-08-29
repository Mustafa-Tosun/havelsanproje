/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"etimaden/havelsan-proje/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});