import * as R4 from "fhir/r4";
import SubClient, { FhirClientTypes } from "../FhirClient";
import { EMR } from "../Launcher/SmartLaunchHandler";
import { Author, FhirClientResourceWithRequiredType, GenericContext, R4ResourceWithRequiredType } from "../types";
/**
 * The EMR_ENDPOINTS type represents an object with two properties, "token" and "r4", both of which are URLs.
 * @property {URL} token - A URL that represents the endpoint for accessing the token service in an EMR (Electronic Medical Record) system.
 * @property {URL} r4 - The "r4" property in the EMR_ENDPOINTS type represents a URL that is used to access the R4 version of an EMR (Electronic Medical Record)
 * endpoint.
 */
export type EMR_ENDPOINTS = {
    token: URL;
    r4: URL;
    auth: URL;
};
/**
Represents the BaseClient abstract class.
*/
export default abstract class BaseClient {
    readonly fhirClientDefault: SubClient;
    readonly defaultCreateHeaders: HeadersInit;
    abstract readonly EMR_TYPE: EMR;
    static readonly AUTHORIZE_ENDPOINT: string | undefined;
    static readonly TOKEN_ENDPOINT: string | undefined;
    static readonly R4_ENDPOINT: string | undefined;
    abstract getEndpoints(): EMR_ENDPOINTS;
    getEMRType(): EMR;
    /**
     * The function constructs and returns an object containing three endpoints (token, r4, and auth) based on the provided tokenEP, r4EP, and authorizeEP values.
     * @param {string | undefined} tokenEP - The `tokenEP` parameter is a string that represents the token endpoint. This endpoint is used to obtain an access token
     * for authentication and authorization purposes.
     * @param {string | undefined} r4EP - The `r4EP` parameter is the endpoint URL for the R4 API. It is used to make requests to the R4 API.
     * @param {string | undefined} authorizeEP - The `authorizeEP` parameter is the endpoint URL for the authorization server. It is used for initiating the
     * authorization process and obtaining an authorization code or access token.
     * @returns An object with three properties: "token", "r4", and "auth". Each property is assigned a new URL object based on the corresponding input parameters.
     */
    protected static constructEndpoints(tokenEP: string | undefined, r4EP: string | undefined, authorizeEP: string | undefined): {
        token: URL;
        r4: URL;
        auth: URL;
    };
    /**
     * Fetch options for create operation headers.
     * @private
     * @readonly
     * @type {FhirClientTypes.FetchOptions}
     */
    protected createHeaders(additionalCreateHeaders: HeadersInit): FhirClientTypes.FetchOptions;
    /**
     * Creates an instance of BaseClient.
     * @param {SubClient} fhirClientDefault - The default FHIR client to use.
     */
    constructor(fhirClientDefault: SubClient);
    /**
     * Gets the ID from an object with ID.
     * @private
     * @param {T} objectWithId - The object with ID.
     * @returns {Promise<string>} - A promise resolving to the ID.
     * @throws {Error} - Throws an error if the ID is not found.
     */
    private getIDfromObject;
    /**
     * Creates a patient subject.
     * @private
     * @returns {Promise<GenericSubject>} - A promise resolving to the patient subject.
     */
    private createPatientSubject;
    /**
     * The function creates a reference to an Encounter object by retrieving its ID from a FHIR client.
     * @returns An object is being returned with a property "reference" that has a value of `Encounter/`.
     */
    private createEncounterReference;
    /**
     * The function creates an array of encounter references asynchronously.
     * @returns An array containing the result of the `createEncounterReference` function, which is awaited.
     */
    private createEncounterReferenceArray;
    /**
     * The function "createPeriod" creates a period object with the same start and end date.
     * @param {string} start - The start parameter is a string that represents the start date or time of a period.
     * @returns An object of type R4.Period is being returned.
     */
    private createPeriod;
    /**
     * The createContext function creates a context object with an encounter reference array and a period.
     * @returns The function `createContext` is returning an object with a property `context` which contains the values of `encounter` and `period`.
     */
    private createContext;
    /**
     * The function creates an array of author references using the user ID obtained from the FHIR client.
     * @returns an object with an "author" property, which is an array containing an object with a "reference" property. The value of the "reference" property is a
     * string in the format "Practitioner/{userID}".
     */
    createReferenceArrayAuthor(): Promise<Author>;
    /**
     * Hydrates a resource with subject and encounter context.
     * @param {T} resource - The resource to hydrate.
     * @returns {Promise<T>} - A promise resolving to the hydrated resource.
     */
    hydrateResource<T extends FhirClientResourceWithRequiredType>(resource: T, patientId?: string, encounterId?: string): Promise<T & {
        context?: R4.DocumentReferenceContext | undefined;
        subject?: R4.Reference | undefined;
    }>;
    /**
     * The function creates a resource of type T, transforms it to a FhirClientType, hydrates it, sends a create request to the FhirClientDefault, transforms the
     * result back to type T, and returns it.
     * @param {T} resource - The `resource` parameter is the FHIR resource object that you want to create. It should be an object that conforms to the R4 (Release 4)
     * FHIR specification and has a required `resourceType` property.
     * @param [additionalHeaders] - The `additionalHeaders` parameter is an optional object that represents additional headers to be included in the HTTP request when
     * creating a resource. It is of type `FhirClientTypes.FetchOptions`.
     * @returns a Promise of type T, which is the same type as the input resource.
     */
    create<T extends R4ResourceWithRequiredType>(resource: T, patientId?: string, encounterId?: string, additionalHeaders?: FhirClientTypes.FetchOptions): Promise<T>;
    createHydratedResource(hydratedResource: Omit<Partial<FhirClientTypes.FHIR.Resource>, "resourceType"> & Required<Pick<Partial<FhirClientTypes.FHIR.Resource>, "resourceType">> & {
        context?: GenericContext;
        subject?: R4.Reference | undefined;
    }, additionalHeaders?: FhirClientTypes.FetchOptions | undefined): Promise<FhirClientResourceWithRequiredType>;
    /**
     * The function `requestResource` asynchronously requests a resource using a specified resource ID and optional request options.
     * @param {string} resourceID - The resourceID parameter is a string that represents the ID of the resource you want to request. It could be the URL or identifier
     * of the resource you want to retrieve.
     * @param {RequestInit} [requestOptions] - The `requestOptions` parameter is an optional object that contains additional options for the HTTP request. It can
     * include properties such as headers, method, body, etc.
     * @returns a resource of type R4.Resource.
     */
    requestResource(resourceID: string, requestOptions?: RequestInit): Promise<R4.Resource>;
    /**
     * The function `getUserRead` is a private asynchronous function that retrieves user data using the `read` method of the `fhirClientDefault` object and returns a
     * `UserReadResult` promise.
     * @returns a Promise that resolves to a UserReadResult object.
     */
    private getUserRead;
    /**
     * The function `getPractitionerRead` retrieves a user and checks if they are a practitioner, then converts the user to an R4 Practitioner if they are, otherwise
     * it throws an error.
     * @param {UserReadResult} user - The `user` parameter is of type `UserReadResult`, which is a result object returned from the `getUserRead()` function. It
     * represents a user resource in the FHIR format.
     * @returns a Promise that resolves to a FHIR R4 Practitioner resource.
     */
    getPractitionerRead(): Promise<R4.Practitioner>;
    /**
     * The function `getPatientRead` retrieves a patient record from a FHIR server and transforms it into an R4.Patient object.
     * @returns a Promise that resolves to an instance of the R4.Patient type.
     */
    getPatientRead(): Promise<R4.Patient>;
    getEncounterRead(): Promise<R4.Encounter>;
}
