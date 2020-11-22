# p-state [![Build Status](https://github.com/sindresorhus/p-state/workflows/CI/badge.svg?branch=main)](https://github.com/sindresorhus/p-state/actions?query=branch%3Amain+workflow%3ACI)

> Inspect the state of a promise

You would usually not need this as you can just await the promise at any time to get its value even after it's resolved. This package could be useful if you need to check the state of the promise before doing a heavy operation or for assertions when writing tests.

## Install

```
$ npm install p-state
```

## Usage

```js
const timers = require('timers/promises');
const {promiseStateSync} = require('p-state');

(async () => {
	const timeoutPromise = timers.setTimeout(100);

	console.log(promiseStateSync(timeoutPromise));
	//=> 'pending'

	await timeoutPromise;

	console.log(promiseStateSync(timeoutPromise));
	//=> 'fulfilled'
})();
```

## API

### `promiseStateAsync(promise: Promise)`

Asynchronously inspect the state of a promise.

Returns a promise for the state as a string with the possible values: `'pending'`, `'fulfilled'`, `'rejected'`.

Note: While this is async, it does return the state in the next [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide), which is almost right away.

### `promiseStateSync(promise: Promise)`

Synchronously inspect the state of a promise.

Returns the state as a string with the possible values: `'pending'`, `'fulfilled'`, `'rejected'`.

Note: This method does not work in the browser.

## Related

- [p-reflect](https://github.com/sindresorhus/p-reflect) - Make a promise always fulfill with its actual fulfillment value or rejection reason
- [p-settle](https://github.com/sindresorhus/p-settle) - Settle promises concurrently and get their fulfillment value or rejection reason
- [More…](https://github.com/sindresorhus/promise-fun)
