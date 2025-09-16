export async function promiseStateAsync(promise) {
	if (!(promise && typeof promise === 'object' && typeof promise.then === 'function')) {
		throw new TypeError(`Expected a promise, got ${typeof promise}`);
	}

	let isSettled = false;
	let state = 'pending';

	promise.then(
		() => {
			isSettled = true;
			state = 'fulfilled';
		},
		error => {
			isSettled = true;
			state = 'rejected';
			throw error; // Rethrow so unhandled rejection still fires
		},
	);

	// Wait for handlers to run (need to flush microtask queue)
	await Promise.resolve();
	await Promise.resolve();

	return isSettled ? state : 'pending';
}

export function promiseStateSync(_promise) {
	throw new Error('This method is not available in the browser');
}
