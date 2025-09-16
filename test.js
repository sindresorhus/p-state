import process from 'node:process';
import test from 'ava';
import delay from 'delay';
import {pEvent} from 'p-event';
import {promiseStateAsync, promiseStateSync} from './index.js';

test('promiseStateAsync', async t => {
	const pendingPromise = new Promise(() => {});
	const fulfilledPromise = Promise.resolve();
	const rejectedPromise = Promise.reject(new Error('fixture'));

	t.is(await promiseStateAsync(pendingPromise), 'pending');
	t.is(await promiseStateAsync(fulfilledPromise), 'fulfilled');
	t.is(await promiseStateAsync(rejectedPromise), 'rejected');

	rejectedPromise.catch(() => {}); // Prevent unhandled rejection
});

test('promiseStateAsync - does not affect unhandled rejection', async t => {
	const unhandledRejection = pEvent(process, 'unhandledRejection');
	const fixture = Promise.reject(new Error('fixture'));
	await promiseStateAsync(fixture);
	await unhandledRejection;
	t.pass();

	// Handle the rejection to prevent AVA from reporting it
	fixture.catch(() => {});
});

test('promiseStateAsync - state resolves before promise', async t => {
	const delayedPromise = delay(50);
	t.is(await promiseStateAsync(delayedPromise), 'pending');
	await delayedPromise;
	t.is(await promiseStateAsync(delayedPromise), 'fulfilled');
});

test('promiseStateSync', t => {
	const pendingPromise = new Promise(() => {});
	const fulfilledPromise = Promise.resolve();
	const rejectedPromise = Promise.reject();

	t.is(promiseStateSync(pendingPromise), 'pending');
	t.is(promiseStateSync(fulfilledPromise), 'fulfilled');
	t.is(promiseStateSync(rejectedPromise), 'rejected');

	rejectedPromise.catch(() => {});
});

test('throws on non-promise input', async t => {
	await t.throwsAsync(promiseStateAsync(null), {message: 'Expected a promise, got object'});
	await t.throwsAsync(promiseStateAsync(123), {message: 'Expected a promise, got number'});
	await t.throwsAsync(promiseStateAsync('string'), {message: 'Expected a promise, got string'});

	t.throws(() => promiseStateSync(null), {message: 'Expected a promise, got object'});
	t.throws(() => promiseStateSync(123), {message: 'Expected a promise, got number'});
});

// Test for https://github.com/sindresorhus/p-state/issues/12
test.serial('promiseStateAsync - handles late rejections', async t => {
	const unhandledRejections = [];
	const listener = error => unhandledRejections.push(error);
	process.on('unhandledRejection', listener);

	let rejectPromise;
	const lateRejectPromise = new Promise((_, reject) => {
		rejectPromise = reject;
	});

	t.is(await promiseStateAsync(lateRejectPromise), 'pending');

	// Reject the promise after checking its state
	setTimeout(() => rejectPromise(new Error('Late rejection')), 50);

	await delay(100);

	t.is(unhandledRejections.length, 1);
	t.is(unhandledRejections[0]?.message, 'Late rejection');

	// Handle the rejection to prevent AVA from reporting it
	lateRejectPromise.catch(() => {});

	process.off('unhandledRejection', listener);
});
