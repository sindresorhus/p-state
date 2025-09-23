import process from 'node:process';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import delay from 'delay';
import {promiseStateAsync, promiseStateSync} from './index.js';

test('promiseStateAsync', async () => {
	const pendingPromise = new Promise(() => {});
	const fulfilledPromise = Promise.resolve();
	const rejectedPromise = Promise.reject(new Error('fixture'));

	assert.equal(await promiseStateAsync(pendingPromise), 'pending');
	assert.equal(await promiseStateAsync(fulfilledPromise), 'fulfilled');
	assert.equal(await promiseStateAsync(rejectedPromise), 'rejected');

	rejectedPromise.catch(() => {}); // Prevent unhandled rejection
});

test('promiseStateAsync - does not affect unhandled rejection', async () => {
	// Handle unhandled rejection temporarily for this test
	const originalHandler = process.listeners('unhandledRejection');
	process.removeAllListeners('unhandledRejection');

	let unhandledRejectionOccurred = false;
	const handler = () => {
		unhandledRejectionOccurred = true;
	};

	process.once('unhandledRejection', handler);

	const fixture = Promise.reject(new Error('fixture'));
	await promiseStateAsync(fixture);

	// Wait for the event to fire
	await new Promise(resolve => {
		setTimeout(resolve, 10);
	});

	assert.ok(unhandledRejectionOccurred, 'Unhandled rejection should have occurred');

	// Clean up and restore original handlers
	fixture.catch(() => {});
	for (const listener of originalHandler) {
		process.on('unhandledRejection', listener);
	}
});

test('promiseStateAsync - state resolves before promise', async () => {
	const delayedPromise = delay(50);
	assert.equal(await promiseStateAsync(delayedPromise), 'pending');
	await delayedPromise;
	assert.equal(await promiseStateAsync(delayedPromise), 'fulfilled');
});

test('promiseStateSync', () => {
	const pendingPromise = new Promise(() => {});
	const fulfilledPromise = Promise.resolve();
	const rejectedPromise = Promise.reject();

	assert.equal(promiseStateSync(pendingPromise), 'pending');
	assert.equal(promiseStateSync(fulfilledPromise), 'fulfilled');
	assert.equal(promiseStateSync(rejectedPromise), 'rejected');

	rejectedPromise.catch(() => {});
});

test('throws on non-promise input', async () => {
	await assert.rejects(promiseStateAsync(null), {message: 'Expected a promise, got object'});
	await assert.rejects(promiseStateAsync(123), {message: 'Expected a promise, got number'});
	await assert.rejects(promiseStateAsync('string'), {message: 'Expected a promise, got string'});

	assert.throws(() => promiseStateSync(null), {message: 'Expected a promise, got object'});
	assert.throws(() => promiseStateSync(123), {message: 'Expected a promise, got number'});
});

// Test for https://github.com/sindresorhus/p-state/issues/12
test('promiseStateAsync - handles late rejections', async () => {
	// Handle unhandled rejection temporarily for this test
	const originalHandler = process.listeners('unhandledRejection');
	process.removeAllListeners('unhandledRejection');

	const unhandledRejections = [];
	const listener = error => unhandledRejections.push(error);
	process.on('unhandledRejection', listener);

	let rejectPromise;
	const lateRejectPromise = new Promise((_, reject) => { // eslint-disable-line promise/param-names
		rejectPromise = reject;
	});

	assert.equal(await promiseStateAsync(lateRejectPromise), 'pending');

	// Reject the promise after checking its state
	setTimeout(() => rejectPromise(new Error('Late rejection')), 50);

	await delay(100);

	assert.equal(unhandledRejections.length, 1);
	assert.equal(unhandledRejections[0]?.message, 'Late rejection');

	// Clean up and restore original handlers
	lateRejectPromise.catch(() => {});
	process.removeListener('unhandledRejection', listener);
	for (const listener of originalHandler) {
		process.on('unhandledRejection', listener);
	}
});
