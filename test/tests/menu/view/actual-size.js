'use strict';

const { Application } = require('spectron');

const config = require('../../../config.json');
const {
	APP_PATH,
	IMAGE_ID,
	WAIT_UNTIL_TIMEOUT
} = config;

describe('View > Actual Size', function () {
	this.timeout(60000);

	beforeEach(function () {
		this.app = new Application({
			path: APP_PATH,
			env: {
				ELECTRON_ENABLE_LOGGING: true,
				ELECTRON_ENABLE_STACK_DUMPING: true,
				NEGATIVE_IGNORE_SETTINGS: false,
				NEGATIVE_SKIP_RESET_DIALOG: true,
				NEGATIVE_SETTINGS_PATH: '../test/fixtures/one-window-with-data-after-zoom.json',
				NEGATIVE_VERBOSE: true,
				NODE_ENV: 'development'
			}
		});

		return this.app.start();
	});

	afterEach(function () {
		if (this.app && this.app.isRunning()) {
			return this.app.stop();
		}
	});

	it('Should zoom to 0', function () {
		return this.app.client.waitUntilWindowLoaded()
			.then(() => this.app.electron.ipcRenderer.send('test-actual-size'))
			.then(() => {
				return this.app.client.waitUntil(() => {
					return this.app.client.selectorExecute(IMAGE_ID, (element) => element[0].getAttribute('data-zoom-level'))
						.then((zoomLevel) => zoomLevel === '1');
				}, WAIT_UNTIL_TIMEOUT);
			})
			.catch((err) => {
				return this.app.client.getMainProcessLogs()
					.then((logs) => {
						console.log('*** MAIN PROCESS LOGS ***');
						logs.forEach((log) => console.log(log));

						return this.app.client.getRenderProcessLogs();
					})
					.then((logs) => {
						console.log('*** RENDER PROCESS LOGS ***');
						logs.forEach((log) => console.log(log));

						throw err;
					});
			});
	});
});
