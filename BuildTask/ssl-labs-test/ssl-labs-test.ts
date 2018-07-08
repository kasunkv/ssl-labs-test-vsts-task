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
            console.log(`Starting SSL Labs Scan for the hostname: ${taskInput.Hostname}`);

            const scanResult = await sslLabsService.executeSslTest();
            console.log('Scan Completed...');


            // Check for Verifications
            if (taskInput.EnableVerification) {
                console.log(`Verifications are Enabled with the Alert Mode: ${taskInput.AlertMode}`);
                const certGradeScore = await sslLabsService.getSslCertificateGrade(scanResult);

                if (Number(taskInput.MinimumCertGrade) > certGradeScore) {
                    console.log('Minimum certifiate grade threshold exceeded. Executing Alert');
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
                console.log('Certificate expiration alerts Enabled.');
                const daysTillExpire: number = await sslLabsService.timeTillCertificateExpiration(scanResult);

                if (daysTillExpire < taskInput.DaysBeforeExpiration) {
                    console.log('Minimum certifiate expire threshold exceeded. Executing Alert');
                    switch (taskInput.AlertMode) {
                        case AlertMode.BREAK_BUILD:
                            throw new Error(`SSL certificate is nearing expireation and will expire in ${daysTillExpire} Days.`);

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
        Task.setResult(Task.TaskResult.Succeeded, res);
    })
    .catch((err: any) => {
        const msg = `Task Failed. Error: ${JSON.stringify(err)}`;
        Task.setResult(Task.TaskResult.Failed, msg);
    });