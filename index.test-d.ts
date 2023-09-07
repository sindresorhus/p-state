import {expectType} from 'tsd';
import {promiseStateAsync, promiseStateSync, type PromiseState} from './index.js';

const promise = Promise.resolve();

expectType<Promise<PromiseState>>(promiseStateAsync(promise));
expectType<PromiseState>(promiseStateSync(promise));
