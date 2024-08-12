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
 * Represents the InfernoClient class, extending the BaseClient.
 */
class InfernoClient extends BaseClient {
    static getEndpoints() {
        return BaseClient.constructEndpoints(InfernoClient.TOKEN_ENDPOINT, InfernoClient.R4_ENDPOINT, InfernoClient.AUTHORIZE_ENDPOINT);
    }
    getEndpoints() {
        return InfernoClient.getEndpoints();
    }
    /**
     * Creates an instance of InfernoClient.
     * @param {SubClient} fhirClientDefault - The default FHIR client to use.
     */
    constructor(fhirClientDefault) {
        super(fhirClientDefault);
        this.EMR_TYPE = EMR.INFERNO;
    }
    create(resource, patientId, encounterId) {
        const _super = Object.create(null, {
            create: { get: () => super.create }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.create.call(this, resource, patientId, encounterId, this.createHeaders({}));
        });
    }
}
InfernoClient.AUTHORIZE_ENDPOINT = "https://inferno.healthit.gov/oauth2/authorize";
InfernoClient.TOKEN_ENDPOINT = "https://inferno.healthit.gov/oauth2/token";
InfernoClient.R4_ENDPOINT = "https://inferno.healthit.gov/fhir/r4";
export default InfernoClient;
//# sourceMappingURL=InfernoClient.js.map