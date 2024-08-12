import { LAUNCH } from "../Client/ClientFactory";
export declare enum EMR {
    CERNER = "cerner",
    EPIC = "epic",
    SMART = "smart",
    ECW = "ecw",
    MEDPLUM = "medplum",
    INFERNO = "inferno",
    NONE = "none"
}
export declare function instanceOfEmr(object: unknown): object is EMR;
export default class SmartLaunchHandler {
    readonly clientID: string;
    readonly clientSecret?: string;
    private emrType;
    constructor(clientID: string, clientSecret?: string, emrType?: EMR);
    /**
     * Explicitly sets the EMR type.
     * @param {EMR} emrType - The EMR type to set.
     */
    setEMRType(emrType: EMR): void;
    private launchEMR;
    authorizeEMR(launchType?: LAUNCH, redirectPath?: string): Promise<void>;
    private executeWebLaunch;
    static getEMRType(iss?: string): EMR;
}
