import process from 'node:process';
import test from 'ava';
import delay from 'delay';
import {pEvent} from 'p-event';
import {promiseStateAsync, promiseStateSync} from './index.js';

test('promiseStateAsync', async t => {
	const pendingPromise = new Promise(() => {});
	const fulfilledPromise = Promise.resolve();
	const rejectedPromise = Promise.reject();
	t.is(await promiseStateAsync(pendingPromise), 'pending');
	t.is(await promiseStateAsync(fulfilledPromise), 'fulfilled');
	t.is(await promiseStateAsync(rejectedPromise), 'rejected');
});

test('promiseStateAsync - reject', async t => {
	const error = new Error('fixture');
	const rejectedPromise = Promise.reject(error);
	t.is(await promiseStateAsync(rejectedPromise), 'rejected');
	await t.throwsAsync(rejectedPromise, {is: error});
});

test('promiseStateAsync - does not affect unhandled rejection', async t => {
	const unhandledRejection = pEvent(process, 'unhandledRejection');
	const fixture = Promise.reject(new Error('fixture'));
	await promiseStateAsync(fixture);
	await unhandledRejection;
	t.pass();
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

function trackUnhandledRejections() {
	const unhandledRejections = [];

	const listener = error => {
		unhandledRejections.push(error);
	};

	process.on('unhandledRejection', listener);

	return {
		stop() {
			process.off('unhandledRejection', listener);
		},
		getRejections() {
			return unhandledRejections;
		},
	};
}

// Test for https://github.com/sindresorhus/p-state/issues/12
test.serial.failing('promiseStateAsync - handles late rejections', async t => {
	const tracker = trackUnhandledRejections();

	let rejectPromise;
	const lateRejectPromise = new Promise((_, reject) => {
		rejectPromise = reject;
	});

	// Check initial state
	const initialState = await promiseStateAsync(lateRejectPromise);
	t.is(initialState, 'pending');

	// Reject the promise after checking its state
	setTimeout(() => {
		rejectPromise(new Error('Late rejection'));
	}, 50);

	// Give it some time to settle and check for unhandled rejections
	await new Promise(resolve => {
		setTimeout(resolve, 100);
	});

	t.is(tracker.getRejections().length, 1);
	t.is(tracker.getRejections()[0]?.message, 'Late rejection');

	tracker.stop();
});
