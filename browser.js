const marker = Symbol('marker');

export async function promiseStateAsync(promise) {
	if (!(typeof promise === 'object' && typeof promise.then === 'function')) {
		throw new TypeError(`Expected a promise, got ${typeof promise}`);
	}

	// Ensure unhandled rejections don't get swallowed.
	await new Promise(resolve => {
		if (typeof setImmediate === 'function') {
			setImmediate(resolve);
		} else {
			setTimeout(resolve);
		}
	});

	try {
		return await Promise.race([promise, marker]) === marker ? 'pending' : 'fulfilled';
	} catch {
		return 'rejected';
	}
}

export function promiseStateSync() {
	throw new Error('This method is not available in the browser');
}
