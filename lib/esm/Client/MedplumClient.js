var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EMR } from "../Launcher/SmartLaunchHandler";
import BaseClient from "./BaseClient";
/**
 Represents the MedplumClient class, extending the BaseClient.
 */
class MedplumClient extends BaseClient {
    // Method to get the endpoints
    static getEndpoints() {
        return BaseClient.constructEndpoints(MedplumClient.TOKEN_ENDPOINT, MedplumClient.R4_ENDPOINT, MedplumClient.AUTHORIZE_ENDPOINT);
    }
    // Instance method to get the endpoints
    getEndpoints() {
        return MedplumClient.getEndpoints();
    }
    /**
     * Creates an instance of MedplumClient.
     * @param {SubClient} fhirClientDefault - The default FHIR client to use.
     */
    constructor(fhirClientDefault) {
        super(fhirClientDefault);
        this.EMR_TYPE = EMR.MEDPLUM;
        // Headers specific to Medplum, if any
        this.medplumRequestHeaders = {
            Accept: "application/fhir+json",
        };
    }
    /**
     * Creates a resource in Medplum with additional context.
     * @param {T} resource - The resource to create.
     * @returns {Promise<T>} - A promise resolving to the created resource.
     */
    create(resource, patientId, encounterId) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.create.call(this, resource, patientId, encounterId, this.createHeaders(this.medplumRequestHeaders));
        });
    }
    /**
     * The function `requestResource` is an asynchronous function that makes a request for a resource using a resource ID and Medplum request headers.
     * @param {string} resourceID - The resourceID parameter is a string that represents the ID of the resource that you want to request.
     * @returns The `requestResource` function is returning a promise.
     */
    requestResource(resourceID) {
        const _super = Object.create(null, {
            requestResource: { get: () => super.requestResource }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.requestResource.call(this, resourceID, {
                headers: this.medplumRequestHeaders,
            });
        });
    }
}
// Define the authorization, token, and FHIR R4 endpoints for Medplum
MedplumClient.AUTHORIZE_ENDPOINT = "https://api.medplum.com/oauth2/authorize";
MedplumClient.TOKEN_ENDPOINT = "https://api.medplum.com/oauth2/token";
MedplumClient.R4_ENDPOINT = "https://api.medplum.com/fhir/R4";
export default MedplumClient;
//# sourceMappingURL=MedplumClient.js.map