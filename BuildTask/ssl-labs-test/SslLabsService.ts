import * as SslLabs from 'node-ssllabs';
import { inject, injectable } from 'inversify';

import { ITaskInput } from './interfaces/ITaskInput';
import { ISslLabsService } from './interfaces/ISslLabsService';

import { Options } from 'node-ssllabs';
import { TaskInput } from './TaskInput';

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
        const promise = new Promise<string>((resolve, reject) => {
            try {

                const options: Options = new Options();
                options.host = this._taskInput.Hostname;
                options.maxAge = 24;
                options.publish = this._taskInput.PublishScanResults;
                options.startNew = this._taskInput.FreshScan;
                options.all = 'done';                

                SslLabs.scan(options, (err: any, res: any) => {
                    if (err) {
                        reject(err.message || err);
                    }
                    resolve(res);
                });
            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }
}

