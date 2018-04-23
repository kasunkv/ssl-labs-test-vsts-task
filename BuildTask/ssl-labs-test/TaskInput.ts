import * as Task from 'vsts-task-lib';
import { ITaskInput } from './interfaces/ITaskInput';
import { injectable } from 'inversify';

@injectable()
export class TaskInput implements ITaskInput {
    private _hostname: string;
    private _freshScan: boolean;
    private _publishScanResults: boolean;
    private _enableVerification: boolean;
    private _minimumCertGrade: string;
    private _enableExpirationAlert: boolean;
    private _daysBeforeExpiration: string;
    private _alertMode: string;
    private _variableName: string;
    private _variableContent: string;

    constructor() {
        this._hostname = Task.getInput('hostname', true);
        this._freshScan = Task.getBoolInput('freshScan');
        this._publishScanResults = Task.getBoolInput('publishScanResults');
        this._enableVerification = Task.getBoolInput('enableVerification');
        this._minimumCertGrade = Task.getInput('minimumCertGrade');
        this._enableExpirationAlert = Task.getBoolInput('enableExpirationAlert');
        this._daysBeforeExpiration = Task.getInput('daysBeforeExpiration');
        this._alertMode = Task.getInput('alertMode');
        this._variableName = Task.getInput('variableName');
        this._variableContent = Task.getInput('variableContent');
    }

    get Hostname(): string {
        if (this._hostname) {
            return this._hostname;
        }
        throw new Error('The Hostname is Required');
    }

    get FreshScan(): boolean {
        return this._freshScan;
    }

    get PublishScanResults(): boolean {
        return this._publishScanResults;
    }

    get EnableVerification(): boolean {
        return this._enableVerification;
    }

    get MinimumCertGrade(): string {
        if (this._minimumCertGrade) {
            return this._minimumCertGrade;
        }
        return 'A';
    }

    get EnableExpirationAlert(): boolean {
        return this._enableExpirationAlert;
    }

    get DaysBeforeExpiration(): number {
        if (this._daysBeforeExpiration) {
            return Number(this._daysBeforeExpiration);
        }
        throw new Error('Days Before Expiration Value must be a valid Number.');
    }

    get AlertMode(): string {
        if (this._alertMode) {
            return this._alertMode;
        }
        return 'BreakBuild';
    }

    get VariableName(): string {
        if (this._variableName) {
            return this._variableName;
        }
        return '';
    }

    get VariableContent(): string {
        if (this._variableContent) {
            return this._variableContent;
        }
        return '';
    }

    toJSON(): string {
        const obj: object = {
            hostname: this._hostname,
            freshScan: this._freshScan,
            publishScanResults: this._publishScanResults,
            enableVerification: this._enableVerification,
            minimumCertGrade: this._minimumCertGrade,
            enableExpirationAlert: this._enableExpirationAlert,
            daysBeforeExpiration: this._daysBeforeExpiration,
            alertMode: this._alertMode,
            variableName: this._variableName,
            variableContent: this._variableContent
        };

        return JSON.stringify(obj);
    }
}