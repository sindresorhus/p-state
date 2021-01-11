import test from 'ava';
import delay from 'delay';
import pEvent from 'p-event';
import {promiseStateAsync, promiseStateSync} from '.';

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
