export interface ITaskInput {
    Hostname: string;
    FreshScan: boolean;
    PublishScanResults: boolean;
    EnableVerification: boolean;
    MinimumCertGrade: string;
    EnableExpirationAlert: boolean;
    DaysBeforeExpiration: number;
    AlertMode: string;
    VariableName: string;
    VariableContent: string;

    toJSON(): string;
}