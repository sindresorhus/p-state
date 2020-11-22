export type PromiseState = 'pending' | 'fulfilled' | 'rejected';

/**
Asynchronously inspect the state of a promise.

Note: While this is async, it does return the state in the next [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide), which is almost right away.

@param promise - The promise to inspect.
@returns A promise for the promise state.

@example
```
import timers from 'timers/promises';
import {promiseStateAsync} from 'p-state';

(async () => {
	const timeoutPromise = timers.setTimeout(100);

	console.log(await promiseStateAsync(timeoutPromise));
	//=> 'pending'

	await timeoutPromise;

	console.log(await promiseStateAsync(timeoutPromise));
	//=> 'fulfilled'
})();
```
*/
export function promiseStateAsync(promise: Promise<unknown>): Promise<PromiseState>;

/**
Synchronously inspect the state of a promise.

Note: This method does not work in the browser.

@param promise - The promise to inspect.
@returns The promise state.

@example
```
import timers from 'timers/promises';
import {promiseStateSync} from 'p-state';

(async () => {
	const timeoutPromise = timers.setTimeout(100);

	console.log(promiseStateSync(timeoutPromise));
	//=> 'pending'

	await timeoutPromise;

	console.log(promiseStateSync(timeoutPromise));
	//=> 'fulfilled'
})();
```
*/
export function promiseStateSync(promise: Promise<unknown>): PromiseState;
