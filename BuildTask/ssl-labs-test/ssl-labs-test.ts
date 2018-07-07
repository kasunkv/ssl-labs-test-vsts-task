import * as Task from 'vsts-task-lib';
import * as path from 'path';

import container from './di/inversify.config';
import TYPES from './di/types';

import { AlertMode } from './Constants';
import { ISslLabsService } from './interfaces/ISslLabsService';
import { ITaskInput } from './interfaces/ITaskInput';

Task.setResourcePath(path.join(__dirname, 'task.json'));

async function run(): Promise<string> {
    const promise = new Promise<string>(async (resolve, reject) => {
        try {
           
            const taskInput: ITaskInput = container.get<ITaskInput>(TYPES.ITaskInput);
            const sslLabsService: ISslLabsService = container.get<ISslLabsService>(TYPES.ISslLabsService);
            
            Task.debug(taskInput.toJSON());
            Task.debug('Executing SSL Labs Scan with the given inputs');

            const scanResult = await sslLabsService.executeSslTest();

            // Check for Verifications
            if (taskInput.EnableVerification) {
                const certGradeScore = await sslLabsService.getSslCertificateGrade(scanResult);

                if (Number(taskInput.MinimumCertGrade) > certGradeScore) {

                    // If certificate grade threshold is passed
                    switch (taskInput.AlertMode) {
                        case AlertMode.BREAK_BUILD:
                            throw new Error('SSL certificate grade has dropped below the minimum expected grade');

                        case AlertMode.SET_VARIABLE:
                            Task.setVariable(taskInput.VariableName, taskInput.VariableContent, false);
                            break;
                    }
                }
            }

            if (taskInput.EnableExpirationAlert) {
                const timeDiff: number = await sslLabsService.timeTillCertificateExpiration(scanResult);

                if (timeDiff < taskInput.DaysBeforeExpiration) {
                    switch (taskInput.AlertMode) {
                        case AlertMode.BREAK_BUILD:
                            throw new Error(`SSL certificate is nearing expireation and will expire in ${timeDiff} Days.`);

                        case AlertMode.SET_VARIABLE:
                            Task.setVariable(taskInput.VariableName, taskInput.VariableContent, false);
                            break;
                    }
                }
            }

        } catch (err) {
            reject(err.message || err);
        }
    });

    return promise;
}

run()
    .then((res: string) => {
        console.log(res);
        Task.setResult(Task.TaskResult.Succeeded, res);
    })
    .catch((err: any) => {
        const msg = `Task Failed. Error: ${JSON.stringify(err)}`;
        console.log(msg);
        Task.setResult(Task.TaskResult.Failed, msg);
    });