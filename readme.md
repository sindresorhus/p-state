# p-state

> Inspect the state of a promise

You would usually not need this as you can just await the promise at any time to get its value even after it's resolved. This package could be useful if you need to check the state of the promise before doing a heavy operation or for assertions when writing tests.

**Vote up [this issue](https://github.com/nodejs/node/issues/40054) if you want to see this feature being included in Node.js itself.**

## Install

```sh
npm install p-state
```

## Usage

```js
import timers from 'node:timers/promises';
import {promiseStateSync} from 'p-state';

const timeoutPromise = timers.setTimeout(100);

console.log(promiseStateSync(timeoutPromise));
//=> 'pending'

await timeoutPromise;

console.log(promiseStateSync(timeoutPromise));
//=> 'fulfilled'
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
