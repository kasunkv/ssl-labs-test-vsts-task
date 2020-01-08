import * as Task from 'vsts-task-lib';
import * as path from 'path';

import container from './di/inversify.config';
import TYPES from './di/types';

import { AlertMode } from './Constants';
import { ISslLabsService } from './interfaces/ISslLabsService';
import { ITaskInput } from './interfaces/ITaskInput';
import { ILogger } from './interfaces/ILogger';

Task.setResourcePath(path.join(__dirname, 'task.json'));

async function run(): Promise<string> {
    const promise = new Promise<string>(async (resolve, reject) => {
        try {
           
            const taskInput: ITaskInput = container.get<ITaskInput>(TYPES.ITaskInput);
            const sslLabsService: ISslLabsService = container.get<ISslLabsService>(TYPES.ISslLabsService);
            const logger: ILogger = container.get<ILogger>(TYPES.ILogger);
            
            logger.logDebug(taskInput.toJSON());
            logger.logDebug('Executing SSL Labs Scan with the given inputs');
            logger.logConsole(`Starting SSL Labs Scan for the hostname: ${taskInput.Hostname}`);

            const scanResult: any = await sslLabsService.executeSslTest();
            logger.logConsole('Scan Completed...');


            // Check for Verifications
            if (taskInput.EnableVerification) {
                logger.logConsole(`Verifications are Enabled with the Alert Mode: ${taskInput.AlertMode}`);
                const certGradeScore = await sslLabsService.getSslCertificateGrade(scanResult);

                if (Number(taskInput.MinimumCertGrade) > certGradeScore) {
                    logger.logConsole('Minimum certifiate grade threshold exceeded. Executing Alert');
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
                logger.logConsole('Certificate expiration alerts Enabled.');
                const daysTillExpire: number = await sslLabsService.timeTillCertificateExpiration(scanResult);

                if (daysTillExpire < taskInput.DaysBeforeExpiration) {
                    logger.logConsole('Minimum certifiate expire threshold exceeded. Executing Alert');
                    switch (taskInput.AlertMode) {
                        case AlertMode.BREAK_BUILD:
                            throw new Error(`SSL certificate is nearing expiration and will expire in ${daysTillExpire} Days.`);

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
