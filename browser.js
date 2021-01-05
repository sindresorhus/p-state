'use strict';

const marker = Symbol('marker');

module.exports.promiseStateAsync = async promise => {
	// eslint-disable-next-line promise/prefer-await-to-then
	if (!(typeof promise === 'object' && typeof promise.then === 'function')) {
		throw new TypeError(`Expected a promise, got ${typeof promise}`);
	}

	try {
		return await Promise.race([promise, marker]) === marker ? 'pending' : 'fulfilled';
	} catch {
		return 'rejected';
	}
};

module.exports.promiseStateSync = () => {
	throw new Error('This method is not available in the browser');
};
