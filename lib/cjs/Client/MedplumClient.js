"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SmartLaunchHandler_1 = require("../Launcher/SmartLaunchHandler");
var BaseClient_1 = __importDefault(require("./BaseClient"));
/**
 Represents the MedplumClient class, extending the BaseClient.
 */
var MedplumClient = /** @class */ (function (_super) {
    __extends(MedplumClient, _super);
    /**
     * Creates an instance of MedplumClient.
     * @param {SubClient} fhirClientDefault - The default FHIR client to use.
     */
    function MedplumClient(fhirClientDefault) {
        var _this = _super.call(this, fhirClientDefault) || this;
        _this.EMR_TYPE = SmartLaunchHandler_1.EMR.MEDPLUM;
        // Headers specific to Medplum, if any
        _this.medplumRequestHeaders = {
            Accept: "application/fhir+json",
        };
        return _this;
    }
    // Method to get the endpoints
    MedplumClient.getEndpoints = function () {
        return BaseClient_1.default.constructEndpoints(MedplumClient.TOKEN_ENDPOINT, MedplumClient.R4_ENDPOINT, MedplumClient.AUTHORIZE_ENDPOINT);
    };
    // Instance method to get the endpoints
    MedplumClient.prototype.getEndpoints = function () {
        return MedplumClient.getEndpoints();
    };
    /**
     * Creates a resource in Medplum with additional context.
     * @param {T} resource - The resource to create.
     * @returns {Promise<T>} - A promise resolving to the created resource.
     */
    MedplumClient.prototype.create = function (resource, patientId, encounterId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, _super.prototype.create.call(this, resource, patientId, encounterId, this.createHeaders(this.medplumRequestHeaders))];
            });
        });
    };
    /**
     * The function `requestResource` is an asynchronous function that makes a request for a resource using a resource ID and Medplum request headers.
     * @param {string} resourceID - The resourceID parameter is a string that represents the ID of the resource that you want to request.
     * @returns The `requestResource` function is returning a promise.
     */
    MedplumClient.prototype.requestResource = function (resourceID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, _super.prototype.requestResource.call(this, resourceID, {
                        headers: this.medplumRequestHeaders,
                    })];
            });
        });
    };
    // Define the authorization, token, and FHIR R4 endpoints for Medplum
    MedplumClient.AUTHORIZE_ENDPOINT = "https://api.medplum.com/oauth2/authorize";
    MedplumClient.TOKEN_ENDPOINT = "https://api.medplum.com/oauth2/token";
    MedplumClient.R4_ENDPOINT = "https://api.medplum.com/fhir/R4";
    return MedplumClient;
}(BaseClient_1.default));
exports.default = MedplumClient;
//# sourceMappingURL=MedplumClient.js.map