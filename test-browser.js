// Need to test manually in devtools
// $ npx esbuild test-browser.js --bundle | pbcopy
import {promiseStateAsync} from './browser.js';

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
	let passed = 0;
	let failed = 0;

	function assert(actual, expected, description) {
		if (actual === expected) {
			console.log('✅', description, `(${actual})`);
			passed++;
		} else {
			console.error('❌', description, `- expected: ${expected}, got: ${actual}`);
			failed++;
		}
	}

	console.log('Testing promiseStateAsync in browser...\n');

	// Test pending promise
	const pendingPromise = new Promise(() => {});
	assert(await promiseStateAsync(pendingPromise), 'pending', 'Pending promise');

	// Test fulfilled promise
	const fulfilledPromise = Promise.resolve('value');
	assert(await promiseStateAsync(fulfilledPromise), 'fulfilled', 'Fulfilled promise');

	// Test rejected promise
	const rejectedPromise = Promise.reject(new Error('test error'));
	assert(await promiseStateAsync(rejectedPromise), 'rejected', 'Rejected promise');
	rejectedPromise.catch(() => {}); // Handle to prevent unhandled rejection

	// Test promise that resolves after a delay
	const delayedPromise = new Promise(resolve => {
		setTimeout(resolve, 100);
	});
	assert(await promiseStateAsync(delayedPromise), 'pending', 'Delayed promise (before)');
	await delayedPromise;
	assert(await promiseStateAsync(delayedPromise), 'fulfilled', 'Delayed promise (after)');

	// Test Promise.all with pending
	const allPromise = Promise.all([Promise.resolve(1), new Promise(() => {})]);
	assert(await promiseStateAsync(allPromise), 'pending', 'Promise.all with pending');

	// Test Promise.race with resolved
	const racePromise = Promise.race([new Promise(() => {}), Promise.resolve('fast')]);
	assert(await promiseStateAsync(racePromise), 'fulfilled', 'Promise.race with resolved');

	// Test async function that never resolves
	async function asyncFunction() {
		await new Promise(() => {}); // Never resolves
	}

	const asyncPromise = asyncFunction();
	assert(await promiseStateAsync(asyncPromise), 'pending', 'Async function (pending)');

	// Test thenable-like object
	const thenableLike = {
		// eslint-disable-next-line unicorn/no-thenable
		then(resolve) {
			resolve('thenable value');
		},
	};
	assert(await promiseStateAsync(thenableLike), 'fulfilled', 'Thenable-like object');

	// Test invalid input
	try {
		await promiseStateAsync(null);
		console.error('❌ Should have thrown for null input');
		failed++;
	} catch (error) {
		if (error.message === 'Expected a promise, got object') {
			console.log('✅ Throws for null input');
			passed++;
		} else {
			console.error('❌ Wrong error for null input:', error.message);
			failed++;
		}
	}

	// Test invalid input (non-object)
	try {
		await promiseStateAsync(123);
		console.error('❌ Should have thrown for number input');
		failed++;
	} catch (error) {
		if (error.message === 'Expected a promise, got number') {
			console.log('✅ Throws for number input');
			passed++;
		} else {
			console.error('❌ Wrong error for number input:', error.message);
			failed++;
		}
	}

	// Summary
	console.log('\n' + '='.repeat(50));
	if (failed === 0) {
		console.log(`✅ All tests passed! (${passed}/${passed})`);
	} else {
		console.error(`❌ Some tests failed: ${passed} passed, ${failed} failed`);
	}
})();
