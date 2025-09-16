import {inspect} from 'node:util';

function getPromiseState(promise) {
	if (!(promise && typeof promise === 'object' && typeof promise.then === 'function')) {
		throw new TypeError(`Expected a promise, got ${typeof promise}`);
	}

	const inspectedString = inspect(promise, {breakLength: Number.POSITIVE_INFINITY});

	if (inspectedString.includes('<pending>')) {
		return 'pending';
	}

	if (inspectedString.includes('<rejected>')) {
		return 'rejected';
	}

	return 'fulfilled';
}

export async function promiseStateAsync(promise) {
	// In Node.js, use util.inspect for inspection without attaching handlers
	return getPromiseState(promise);
}

export function promiseStateSync(promise) {
	return getPromiseState(promise);
}
