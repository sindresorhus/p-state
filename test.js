import test from 'ava';
import {promiseStateAsync, promiseStateSync} from '.';

test('promiseStateAsync', async t => {
	const pendingPromise = new Promise(() => {});
	const fulfilledPromise = Promise.resolve();
	const rejectedPromise = Promise.reject();
	t.is(await promiseStateAsync(pendingPromise), 'pending');
	t.is(await promiseStateAsync(fulfilledPromise), 'fulfilled');
	t.is(await promiseStateAsync(rejectedPromise), 'rejected');
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
