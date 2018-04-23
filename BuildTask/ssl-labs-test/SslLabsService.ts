import * as SslLabs from 'node-ssllabs';
import { inject, injectable } from 'inversify';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISslLabsService } from './interfaces/ISslLabsService';

import TYPES from './di/types';


@injectable()
export class SslLabsService implements ISslLabsService {
    private _taskInput: ITaskInput;

    constructor(
        @inject(TYPES.ITaskInput) taskInput: ITaskInput
    ) {
        this._taskInput = taskInput;
    }

    executeSslTest(): Promise<string> {
        const promise = new Promise((resolve, reject) => {
            try {
                
            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }
}

