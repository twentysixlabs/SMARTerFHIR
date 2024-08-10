import SubClient from "../FhirClient";
import { EMR } from "../Launcher/SmartLaunchHandler";
import { R4ResourceWithRequiredType } from "../types";
import BaseClient, { EMR_ENDPOINTS } from "./BaseClient";

/**
 Represents the MedplumClient class, extending the BaseClient.
 */
export default class MedplumClient extends BaseClient {
  EMR_TYPE: EMR = EMR.MEDPLUM;

  // Define the authorization, token, and FHIR R4 endpoints for Medplum
  static readonly AUTHORIZE_ENDPOINT =
    "https://api.medplum.com/oauth2/authorize";
  static readonly TOKEN_ENDPOINT = "https://api.medplum.com/oauth2/token";
  static readonly R4_ENDPOINT = "https://api.medplum.com/fhir/R4";

  // Method to get the endpoints
  static getEndpoints(): EMR_ENDPOINTS {
    return BaseClient.constructEndpoints(
      MedplumClient.TOKEN_ENDPOINT,
      MedplumClient.R4_ENDPOINT,
      MedplumClient.AUTHORIZE_ENDPOINT
    );
  }

  // Instance method to get the endpoints
  getEndpoints(): EMR_ENDPOINTS {
    return MedplumClient.getEndpoints();
  }

  // Headers specific to Medplum, if any
  readonly medplumRequestHeaders: HeadersInit = {
    Accept: "application/fhir+json",
  };

  /**
   * Creates an instance of MedplumClient.
   * @param {SubClient} fhirClientDefault - The default FHIR client to use.
   */
  constructor(fhirClientDefault: SubClient) {
    super(fhirClientDefault);
  }

  /**
   * Creates a resource in Medplum with additional context.
   * @param {T} resource - The resource to create.
   * @returns {Promise<T>} - A promise resolving to the created resource.
   */
  async create<T extends R4ResourceWithRequiredType>(
    resource: T,
    patientId?: string,
    encounterId?: string
  ): Promise<T> {
    return super.create(
      resource,
      patientId,
      encounterId,
      this.createHeaders(this.medplumRequestHeaders)
    );
  }

  /**
   * The function `requestResource` is an asynchronous function that makes a request for a resource using a resource ID and Medplum request headers.
   * @param {string} resourceID - The resourceID parameter is a string that represents the ID of the resource that you want to request.
   * @returns The `requestResource` function is returning a promise.
   */
  async requestResource(resourceID: string) {
    return super.requestResource(resourceID, {
      headers: this.medplumRequestHeaders,
    });
  }
}
