'use strict';
const {inspect} = require('util');

module.exports.promiseStateAsync = require('./browser').promiseStateAsync;

module.exports.promiseStateSync = promise => {
	// eslint-disable-next-line promise/prefer-await-to-then
	if (!(typeof promise === 'object' && typeof promise.then === 'function')) {
		throw new TypeError(`Expected a promise, got ${typeof promise}`);
	}

	const inspectedString = inspect(promise, {
		depth: 0,
		showProxy: false,
		maxStringLength: 0,
		breakLength: Infinity
	});

	if (inspectedString.startsWith('Promise { <pending>')) {
		return 'pending';
	}

	if (inspectedString.startsWith('Promise { <rejected>')) {
		return 'rejected';
	}

	return 'fulfilled';
};
