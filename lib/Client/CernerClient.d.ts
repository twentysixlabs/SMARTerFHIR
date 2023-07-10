import SubClient from "../FhirClient";
import { FhirClientResourceWithRequiredType } from "../types";
import BaseClient from "./BaseClient";
/**
Represents the CernerClient class, extending the BaseClient.
*/
export default class CernerClient extends BaseClient {
    readonly cernerRequestHeaders: HeadersInit;
    /**
     * Creates an instance of CernerClient.
     * @param {SubClient} fhirClientDefault - The default FHIR client to use.
     */
    constructor(fhirClientDefault: SubClient);
    /**
     * Hydrates a resource with subject and encounter context.
     * @param {T} resource - The resource to hydrate.
     * @returns {Promise<T>} - A promise resolving to the hydrated resource.
     */
    hydrateResource<T extends FhirClientResourceWithRequiredType>(resource: T): Promise<T & {
        author?: import("fhir/r4").Reference[] | undefined;
        context?: import("fhir/r4").DocumentReferenceContext | undefined;
        subject?: import("fhir/r4").Reference | undefined;
    }>;
    /**
     * The function `requestResource` is an asynchronous function that makes a request for a resource using a resource ID and Cerner request headers.
     * @param {string} resourceID - The resourceID parameter is a string that represents the ID of the resource that you want to request.
     * @returns The `requestResource` function is returning a promise.
     */
    requestResource(resourceID: string): Promise<import("fhir/r4").Resource>;
}
