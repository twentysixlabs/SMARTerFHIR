/// <reference types="node" />
import { fhirclient } from "fhirclient/lib/types";
import { IncomingMessage, ServerResponse } from "http";
import { EMR } from "../Launcher/SmartLaunchHandler";
import { FhirClientConfig } from "../types";
import BaseClient from "./BaseClient";
/**
 * Enum representing the different types of launch configurations.
 */
export declare enum LAUNCH {
    EMR = 0,
    STANDALONE = 1,
    BACKEND = 2,
    STATEFUL = 3
}
/**
 * The type represents a JSON Web Token (JWT) with properties for client_id and an optional epic.eci property.
 * @property {string} client_id - A string representing the client ID.
 * @property {string} [epic.eci] - An optional string representing the Epic ECI (Epic Community Identifier).
 */
export type JWT = {
    client_id: string;
    "epic.eci"?: string;
};
/**
 * The function checks if an object is an instance of the JWT type by verifying if it has a client_id property.
 * @param {unknown} object - The `object` parameter is of type `unknown`, which means it can be any type.
 * @returns {boolean} - A boolean value indicating whether the object is an instance of JWT.
 */
export declare function instanceOfJWT(object: unknown): object is JWT;
/**
 * Represents the ClientFactory class for creating EMR clients.
 */
export default class ClientFactory {
    /**
     * The function `createEMRClient` creates an EMR client based on the specified launch type.
     * @param {LAUNCH} launchType - The `launchType` parameter is an enum of type `LAUNCH` that specifies the type of EMR launch.
     * @param {EMR} [emrType] - The type of EMR (e.g., EPIC, CERNER, etc.).
     * @param {string | fhirclient.ClientState} [state] - The state or client state object for the FHIR client. This is used for STATEFUL launches.
     * @returns {Promise<BaseClient>} - A Promise that resolves to an instance of the `BaseClient` class.
     */
    createEMRClient(launchType: LAUNCH, emrType?: EMR, state?: string | fhirclient.ClientState): Promise<BaseClient>;
    /**
     * The function `createEMRClientBackend` creates an EMR client for backend operations.
     * @param {IncomingMessage} req - The `req` parameter is an incoming message object that represents the request made by the client.
     * @param {ServerResponse} res - The `res` parameter is a server response object that represents the response sent by the server.
     * @param {FhirClientConfig} serverConfig - The `serverConfig` parameter is an object that contains the configuration for the FHIR client. It includes the server URL, token response, client ID, and token URI.
     * @returns {Promise<BaseClient>} - A Promise that resolves to an instance of the `BaseClient` class.
     */
    createEMRClientBackend(req: IncomingMessage, res: ServerResponse, serverConfig: FhirClientConfig): Promise<BaseClient>;
    /**
     * The function creates a smarter FHIR client based on the given FHIR client and EMR type.
     * @param {SubClient} fhirClient - The FHIR client to base the smarter FHIR client on.
     * @param {EMR} [emrType] - The type of EMR (e.g., EPIC, CERNER, etc.).
     * @returns {Promise<BaseClient>} - A Promise that resolves to an instance of the `BaseClient` class.
     */
    private createSmarterFhirClient;
    /**
     * The function creates a default FHIR client based on the launch type.
     * @param {LAUNCH} launchType - The `launchType` parameter is an enum type that represents the type of launch for the FHIR client.
     * @param {string | fhirclient.ClientState} [state] - The state or client state object for the FHIR client. This is used for STATEFUL launches.
     * @returns {Promise<SubClient>} - A Promise that resolves to a SubClient object.
     */
    private createDefaultFhirClient;
    /**
     * The function `getEmrEndpoints` returns the endpoints based on the EMR type obtained from the JWT or EMR.
     * @param {EMR | JWT} object - The object representing either an EMR type or a JWT.
     * @returns {EMR_ENDPOINTS} - An object containing the EMR endpoints.
     */
    private getEmrEndpoints;
}
