'use strict';

const states = [
	'pending',
	'fulfilled',
	'rejected'
];

module.exports.promiseStateAsync = async promise => {
	const marker = Symbol('marker');

	try {
		return await Promise.race([promise, marker]) === marker ? 'pending' : 'fulfilled';
	} catch {
		return 'rejected';
	}
};

module.exports.promiseStateSync = promise => {
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
