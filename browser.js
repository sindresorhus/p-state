'use strict';

module.exports.promiseStateAsync = async promise => {
	// eslint-disable-next-line promise/prefer-await-to-then
	if (!(typeof promise === 'object' && typeof promise.then === 'function')) {
		throw new TypeError(`Expected a promise, got ${typeof promise}`);
	}

	const marker = Symbol('marker');

	try {
		return await Promise.race([promise, marker]) === marker ? 'pending' : 'fulfilled';
	} catch {
		return 'rejected';
	}
};

module.exports.promiseStateSync = () => {
	throw new Error('This method is not available in the browser');
};
