import {expectType} from 'tsd';
import {promiseStateAsync, promiseStateSync, PromiseState} from './index.js';

const promise = Promise.resolve();

expectType<Promise<PromiseState>>(promiseStateAsync(promise));
expectType<PromiseState>(promiseStateSync(promise));
