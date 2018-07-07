import { CertificateGrade, CertificateGradeScore } from './Constants';
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

    executeSslTest(): Promise<any> {
        const promise = new Promise<any>((resolve, reject) => {
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

    getSslCertificateGrade(sslResult: any): Promise<Number> {
        const promise = new Promise<Number>((resolve, reject) => {
            try {
                if (!sslResult) {
                    reject('SSLLabs Scan Result is null or undefined');
                }

                if (sslResult.endpoints.length > 0) {
                    const endpoint: any = sslResult.endpoints.shift();
                    const gradeScore: Number = this.convertCertificateGradeToNumber(endpoint.grade);
                    resolve(gradeScore);
                } else {
                    reject('No endpoints found in the SSLLab Scan Result');
                }

            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

    timeTillCertificateExpiration(sslResult: any): Promise<number> {
        const promise = new Promise<number>((resolve, reject) => {
            try {
                if (!sslResult) {
                    reject('SSLLabs Scan Result is null or undefined');
                }

                if (sslResult.endpoints.length > 0) {
                    const endpoint: any = sslResult.endpoints.shift();

                    const expDate = Number(endpoint.details.cert.notAfter);
                    const currDate = Date.now();
                    const singleDay = 24 * 60 * 60 * 1000;
                    const dateDiff = Math.round(Math.abs((expDate - currDate) / singleDay));

                    resolve(dateDiff);

                } else {
                    reject('No endpoints found in the SSLLab Scan Result');
                }
            } catch (err) {
                reject(err.message || err);
            }
        });
        return promise;
    }

    private convertCertificateGradeToNumber(grade: string): Number {
        let gradeScore: Number = 0;
        switch (grade) {
            case CertificateGrade.A_PLUS:
                gradeScore = CertificateGradeScore.A_PLUS;
                break;
            case CertificateGrade.A:
                gradeScore = CertificateGradeScore.A;
                break;
            case CertificateGrade.A_MINUS:
                gradeScore = CertificateGradeScore.A_MINUS;
                break;
            case CertificateGrade.B:
                gradeScore = CertificateGradeScore.B;
                break;
            case CertificateGrade.C:
                gradeScore = CertificateGradeScore.C;
                break;
            case CertificateGrade.D:
                gradeScore = CertificateGradeScore.D;
                break;
            case CertificateGrade.E:
                gradeScore = CertificateGradeScore.E;
                break;
            case CertificateGrade.F:
                gradeScore = CertificateGradeScore.F;
                break;
        }
        return gradeScore;
    }

}

