import {expectType} from 'tsd';
import {promiseStateAsync, promiseStateSync, PromiseState} from '.';

const promise = Promise.resolve();

expectType<Promise<PromiseState>>(promiseStateAsync(promise));
expectType<PromiseState>(promiseStateSync(promise));
