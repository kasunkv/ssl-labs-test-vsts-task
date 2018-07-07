declare module 'node-ssllabs' {
    function verifyOptions(options: Options): any;
    function normalizeOptions(options: Options): any;
    function info(callback: (err: any, res: any) => void): void;
    function analyze(options: Options, callback: (err: any, res: any) => void): void;
    function analyzeAndPoll(options: Options, callback: (err: any, res: any) => void): void;
    function getEndpointData(options: Options, callback: (err: any, res: any) => void): void;
    function getStatusCodes(callback: (err: any, res: any) => void): void;
    function getRootCertsRaw(callback: (err: any, res: any) => void): void;
    function scan(options: Options, callback: (err: any, res: any) => void): void;

    class Options {
        host: string;
        fromCache: boolean;
        maxAge: number;
        publish: boolean;
        startNew: boolean;
        all: string;
        ignoreMismatch: boolean;
        s: string;
    }

    // interface Info {
    //     engineVersion: string;
    //     criteriaVersion: string,
    //     maxAssessments: number,
    //     currentAssessments: number,
    //     newAssessmentCoolOff: number,
    //     messages: string[]
    // }

    // interface Host {
    //     host: string,
    //     port: number,
    //     protocol: string,
    //     isPublic: boolean,
    //     status: string,
    //     statusMessage: string,
    //     startTime: number,
    //     testTime: number,
    //     engineVersion: string,
    //     criteriaVersion: string,
    //     cacheExpiryTime: any,
    //     certHostnames: string[],
    //     endpoints: Endpoint[],
    //     certs: Cert[]
    // }

    // interface Endpoint {
    //     ipAddress: string,
    //     serverName: string,
    //     statusMessage: string,
    //     statusDetails: string,
    //     statusDetailsMessage: string,
    //     grade: string,
    //     gradeTrustIgnored: string,
    //     futureGrade: string,
    //     hasWarnings: boolean,
    //     isExceptional: boolean,
    //     progress: number,
    //     duration: number,
    //     eta: number,
    //     delegation: any,
    //     details: EndpointDetails
    // }
}