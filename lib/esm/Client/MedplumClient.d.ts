import SubClient from "../FhirClient";
import { EMR } from "../Launcher/SmartLaunchHandler";
import { R4ResourceWithRequiredType } from "../types";
import BaseClient, { EMR_ENDPOINTS } from "./BaseClient";
/**
 Represents the MedplumClient class, extending the BaseClient.
 */
export default class MedplumClient extends BaseClient {
    EMR_TYPE: EMR;
    static readonly AUTHORIZE_ENDPOINT = "https://api.medplum.com/oauth2/authorize";
    static readonly TOKEN_ENDPOINT = "https://api.medplum.com/oauth2/token";
    static readonly R4_ENDPOINT = "https://api.medplum.com/fhir/R4";
    static getEndpoints(): EMR_ENDPOINTS;
    getEndpoints(): EMR_ENDPOINTS;
    readonly medplumRequestHeaders: HeadersInit;
    /**
     * Creates an instance of MedplumClient.
     * @param {SubClient} fhirClientDefault - The default FHIR client to use.
     */
    constructor(fhirClientDefault: SubClient);
    /**
     * Creates a resource in Medplum with additional context.
     * @param {T} resource - The resource to create.
     * @returns {Promise<T>} - A promise resolving to the created resource.
     */
    create<T extends R4ResourceWithRequiredType>(resource: T, patientId?: string, encounterId?: string): Promise<T>;
    /**
     * The function `requestResource` is an asynchronous function that makes a request for a resource using a resource ID and Medplum request headers.
     * @param {string} resourceID - The resourceID parameter is a string that represents the ID of the resource that you want to request.
     * @returns The `requestResource` function is returning a promise.
     */
    requestResource(resourceID: string): Promise<import("fhir/r4").Resource>;
}
