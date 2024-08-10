import SubClient from "../FhirClient";
import { EMR } from "../Launcher/SmartLaunchHandler";
import { R4ResourceWithRequiredType } from "../types";
import BaseClient, { EMR_ENDPOINTS } from "./BaseClient";

/**
 * Represents the InfernoClient class, extending the BaseClient.
 */
export default class InfernoClient extends BaseClient {
  EMR_TYPE: EMR = EMR.INFERNO;
  static readonly AUTHORIZE_ENDPOINT =
    "https://inferno.healthit.gov/oauth2/authorize";
  static readonly TOKEN_ENDPOINT = "https://inferno.healthit.gov/oauth2/token";
  static readonly R4_ENDPOINT = "https://inferno.healthit.gov/fhir/r4";

  static getEndpoints(): EMR_ENDPOINTS {
    return BaseClient.constructEndpoints(
      InfernoClient.TOKEN_ENDPOINT,
      InfernoClient.R4_ENDPOINT,
      InfernoClient.AUTHORIZE_ENDPOINT
    );
  }

  getEndpoints(): EMR_ENDPOINTS {
    return InfernoClient.getEndpoints();
  }

  /**
   * Creates an instance of InfernoClient.
   * @param {SubClient} fhirClientDefault - The default FHIR client to use.
   */
  constructor(fhirClientDefault: SubClient) {
    super(fhirClientDefault);
  }

  async create<T extends R4ResourceWithRequiredType>(
    resource: T,
    patientId?: string,
    encounterId?: string
  ): Promise<T> {
    return super.create(
      resource,
      patientId,
      encounterId,
      this.createHeaders({})
    );
  }
}
