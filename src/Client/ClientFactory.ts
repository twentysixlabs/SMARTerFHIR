/// <reference types="node" />
import { fhirclient } from "@johnbendi/fhirclient/lib/types";
import smart, * as FHIR from "@johnbendi/fhirclient";
import { IncomingMessage, ServerResponse } from "http";
import { ClientUtils } from "..";
import SubClient from "../FhirClient";
import { EMR } from "../Launcher/SmartLaunchHandler";
import { FhirClientConfig } from "../types";
import BaseClient, { EMR_ENDPOINTS } from "./BaseClient";
import CernerClient from "./CernerClient";
import ECWClient from "./ECWClient";
import EpicClient from "./EpicClient";
import SmartHealthClient from "./SmartHealthClient";
import MedplumClient from "./MedplumClient";
import InfernoClient from "./InfernoClient";

/**
 * Enum representing the different types of launch configurations.
 */
export enum LAUNCH {
  EMR,
  STANDALONE,
  BACKEND,
  STATEFUL,
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
export function instanceOfJWT(object: unknown): object is JWT {
  return (object as JWT).client_id !== undefined;
}

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
  async createEMRClient(
    launchType: LAUNCH,
    emrType?: EMR,
    state?: string | fhirclient.ClientState
  ): Promise<BaseClient> {
    const fhirClient = await this.createDefaultFhirClient(launchType, state);
    return this.createSmarterFhirClient(fhirClient, emrType);
  }

  /**
   * The function `createEMRClientBackend` creates an EMR client for backend operations.
   * @param {IncomingMessage} req - The `req` parameter is an incoming message object that represents the request made by the client.
   * @param {ServerResponse} res - The `res` parameter is a server response object that represents the response sent by the server.
   * @param {FhirClientConfig} serverConfig - The `serverConfig` parameter is an object that contains the configuration for the FHIR client. It includes the server URL, token response, client ID, and token URI.
   * @returns {Promise<BaseClient>} - A Promise that resolves to an instance of the `BaseClient` class.
   */
  async createEMRClientBackend(
    req: IncomingMessage,
    res: ServerResponse,
    serverConfig: FhirClientConfig
  ): Promise<BaseClient> {
    const fhirClient = smart(req, res).client({
      serverUrl: serverConfig.serverUrl,
      tokenResponse: serverConfig.tokenResponse,
      clientId: serverConfig.clientId,
      tokenUri: serverConfig.tokenUri,
    });

    return this.createSmarterFhirClient(fhirClient, EMR.NONE);
  }

  /**
   * The function creates a smarter FHIR client based on the given FHIR client and EMR type.
   * @param {SubClient} fhirClient - The FHIR client to base the smarter FHIR client on.
   * @param {EMR} [emrType] - The type of EMR (e.g., EPIC, CERNER, etc.).
   * @returns {Promise<BaseClient>} - A Promise that resolves to an instance of the `BaseClient` class.
   */
  private async createSmarterFhirClient(
    fhirClient: SubClient,
    emrType?: EMR
  ): Promise<BaseClient> {
    const _emrType = emrType ?? ClientUtils.getEMRType(fhirClient);
    switch (_emrType) {
      case EMR.EPIC:
        return new EpicClient(fhirClient);
      case EMR.CERNER:
        return new CernerClient(fhirClient);
      case EMR.SMART:
        return new SmartHealthClient(fhirClient);
      case EMR.ECW:
        return new ECWClient(fhirClient);
      case EMR.MEDPLUM:
        return new MedplumClient(fhirClient);
      case EMR.INFERNO:
        return new InfernoClient(fhirClient);
      case EMR.NONE:
      default:
        throw new Error("Unsupported provider for EMR Client creation");
    }
  }

  /**
   * The function creates a default FHIR client based on the launch type.
   * @param {LAUNCH} launchType - The `launchType` parameter is an enum type that represents the type of launch for the FHIR client.
   * @param {string | fhirclient.ClientState} [state] - The state or client state object for the FHIR client. This is used for STATEFUL launches.
   * @returns {Promise<SubClient>} - A Promise that resolves to a SubClient object.
   */
  private async createDefaultFhirClient(
    launchType: LAUNCH,
    state?: string | fhirclient.ClientState
  ): Promise<SubClient> {
    switch (launchType) {
      case LAUNCH.EMR:
      case LAUNCH.STANDALONE:
        return FHIR.oauth2.ready();
      case LAUNCH.STATEFUL:
        if (!state) {
          throw new Error(
            "state parameter is required when using the STATEFUL launch type"
          );
        }
        return FHIR.oauth2.init({});
      default:
        throw new Error("Unsupported provider for standalone launch");
    }
  }

  /**
   * The function `getEmrEndpoints` returns the endpoints based on the EMR type obtained from the JWT or EMR.
   * @param {EMR | JWT} object - The object representing either an EMR type or a JWT.
   * @returns {EMR_ENDPOINTS} - An object containing the EMR endpoints.
   */
  private getEmrEndpoints(emrType: EMR): EMR_ENDPOINTS;
  private getEmrEndpoints(jwt: JWT): EMR_ENDPOINTS;
  private getEmrEndpoints(object: EMR | JWT): EMR_ENDPOINTS {
    switch (ClientUtils.getEmrTypeFromObject(object)) {
      case EMR.EPIC:
        return EpicClient.getEndpoints();
      case EMR.CERNER:
        return CernerClient.getEndpoints();
      case EMR.MEDPLUM:
        return MedplumClient.getEndpoints();
      case EMR.SMART:
      case EMR.NONE:
      default:
        throw new Error("EMR type not defined.");
    }
  }
}
