var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as FHIR from "fhirclient";
import { LAUNCH } from "../Client/ClientFactory";
import { cerner } from "./Config";
import scopes from "./scopes.json";
import { Action, Actor, FhirScopePermissions } from "./Scopes";
export var EMR;
(function (EMR) {
    EMR["CERNER"] = "cerner";
    EMR["EPIC"] = "epic";
    EMR["SMART"] = "smart";
    EMR["ECW"] = "ecw";
    EMR["MEDPLUM"] = "medplum";
    EMR["INFERNO"] = "inferno";
    EMR["NONE"] = "none";
})(EMR || (EMR = {}));
export function instanceOfEmr(object) {
    return Object.values(EMR).includes(object);
}
export default class SmartLaunchHandler {
    constructor(clientID, clientSecret, emrType) {
        this.clientID = clientID;
        this.clientSecret = clientSecret;
        this.emrType = emrType !== null && emrType !== void 0 ? emrType : EMR.NONE; // Default to EMR.NONE if not provided
    }
    /**
     * Explicitly sets the EMR type.
     * @param {EMR} emrType - The EMR type to set.
     */
    setEMRType(emrType) {
        this.emrType = emrType;
    }
    launchEMR(redirect, iss, launchType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (launchType === LAUNCH.BACKEND) {
                throw new Error("This doesn't work for backend launch");
            }
            const defaultScopes = ["openid", "fhirUser"];
            const emrSpecificScopes = getEmrSpecificScopes(this.emrType, launchType);
            const scope = [...defaultScopes, ...emrSpecificScopes].join(" ");
            const emrSpecificAuthorizeParams = getEMRSpecificAuthorizeParams(this.emrType);
            const redirect_uri = redirect !== null && redirect !== void 0 ? redirect : "";
            const authorizeParams = Object.assign({ client_id: this.clientID, iss: iss, redirect_uri: redirect_uri, scope: scope, clientSecret: this.clientSecret }, emrSpecificAuthorizeParams);
            return FHIR.oauth2.authorize(authorizeParams);
        });
    }
    authorizeEMR(launchType = LAUNCH.EMR, redirectPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (launchType === LAUNCH.BACKEND) {
                throw new Error(`Direct Backend Authorization not supported yet.`);
            }
            else {
                return yield this.executeWebLaunch(launchType, redirectPath);
            }
        });
    }
    executeWebLaunch(launchType, redirectPath) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = window.location.search;
            const origin = window.location.origin;
            const redirect = origin +
                (redirectPath
                    ? redirectPath.startsWith("/")
                        ? redirectPath
                        : "/" + redirectPath
                    : "");
            const urlParams = new URLSearchParams(queryString);
            const iss = (_a = urlParams.get("iss")) !== null && _a !== void 0 ? _a : undefined;
            if (!iss) {
                throw new Error("Iss Search parameter must be provided as part of EMR Web Launch");
            }
            // If the EMR type has not been explicitly set, try to determine it
            if (this.emrType === EMR.NONE) {
                this.emrType = SmartLaunchHandler.getEMRType(iss);
            }
            if (this.emrType === EMR.NONE || !this.emrType) {
                throw new Error("EMR type cannot be inferred from the ISS");
            }
            yield this.launchEMR(redirect, iss, launchType);
        });
    }
    static getEMRType(iss) {
        var _a;
        if (iss) {
            const isEMROfType = (emrType) => iss.includes(emrType);
            const emrTypes = Object.values(EMR);
            return (_a = emrTypes.find(isEMROfType)) !== null && _a !== void 0 ? _a : EMR.NONE;
        }
        const emrType = process.env.REACT_APP_EMR_TYPE.toLowerCase();
        if (!emrType) {
            throw new Error("EMR type cannot be inferred. You must provide the emrType explicitly as an env variable");
        }
        return emrType;
    }
}
function getEmrSpecificScopes(emrType, launchType) {
    const standardScopes = [
        launchType === LAUNCH.STANDALONE ? "launch/practitioner" : "launch",
        "online_access",
    ];
    switch (emrType) {
        case EMR.CERNER:
            return [
                ...standardScopes,
                ...cerner.scopes.map((name) => scopes[name]),
            ];
        case EMR.ECW:
            return [
                launchType === LAUNCH.STANDALONE ? "launch/patient" : "launch",
                FhirScopePermissions.get(Actor.USER, Action.READ, [
                    "Patient",
                    "Encounter",
                    "Practitioner",
                ]),
            ];
        case EMR.MEDPLUM:
            return [
                ...standardScopes,
                "user/*.*",
                "profile",
                "email",
                "offline_access",
            ];
        case EMR.EPIC:
        case EMR.SMART:
        default:
            return standardScopes;
    }
}
function getEMRSpecificAuthorizeParams(emrType) {
    switch (emrType) {
        case EMR.ECW:
            return {
                pkceMode: "unsafeV1",
                completeInTarget: true,
            };
        case EMR.MEDPLUM:
        case EMR.CERNER:
        case EMR.EPIC:
        case EMR.SMART:
        default:
            return {
                pkceMode: "ifSupported",
            };
    }
}
//# sourceMappingURL=SmartLaunchHandler.js.map