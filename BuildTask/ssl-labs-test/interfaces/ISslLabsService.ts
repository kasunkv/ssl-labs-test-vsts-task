export interface ISslLabsService {
    executeSslTest(): Promise<any>;
    getSslCertificateGrade(sslResult: any): Promise<Number>;
    timeTillCertificateExpiration(sslResult: any): Promise<number>;
}