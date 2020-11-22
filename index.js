'use strict';

const states = [
	'pending',
	'fulfilled',
	'rejected'
];

module.exports.promiseStateAsync = require('./browser').promiseStateAsync;

module.exports.promiseStateSync = promise => {
	// eslint-disable-next-line promise/prefer-await-to-then
	if (!(typeof promise === 'object' && typeof promise.then === 'function')) {
		throw new TypeError(`Expected a promise, got ${typeof promise}`);
	}

	try {
		// eslint-disable-next-line node/no-deprecated-api
		const [stateIndex] = process.binding('util').getPromiseDetails(promise);
		return states[stateIndex];
	} catch {
		const {inspect} = require('util');
		const inspectedString = inspect(promise);

		if (inspectedString.startsWith('Promise { <pending> ')) {
			return 'pending';
		}

		if (inspectedString.startsWith('Promise { <rejected> ')) {
			return 'rejected';
		}

		return 'fulfilled';
	}
};
