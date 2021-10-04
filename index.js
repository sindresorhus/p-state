import {inspect} from 'node:util';

export {promiseStateAsync} from './browser.js';

export function promiseStateSync(promise) {
	// eslint-disable-next-line promise/prefer-await-to-then
	if (!(typeof promise === 'object' && typeof promise.then === 'function')) {
		throw new TypeError(`Expected a promise, got ${typeof promise}`);
	}

	const inspectedString = inspect(promise, {
		depth: 0,
		showProxy: false,
		maxStringLength: 0,
		breakLength: Number.POSITIVE_INFINITY,
	});

	if (inspectedString.startsWith('Promise { <pending>')) {
		return 'pending';
	}

	if (inspectedString.startsWith('Promise { <rejected>')) {
		return 'rejected';
	}

	return 'fulfilled';
}
