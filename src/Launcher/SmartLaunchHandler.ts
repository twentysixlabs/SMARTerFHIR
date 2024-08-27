import * as FHIR from "fhirclient";
import { fhirclient } from "fhirclient/lib/types";
import { LAUNCH } from "../Client/ClientFactory";
import { cerner } from "./Config";
import scopes from "./scopes.json";
import { Action, Actor, FhirScopePermissions } from "./Scopes";

export enum EMR {
  CERNER = "cerner",
  EPIC = "epic",
  SMART = "smart",
  ECW = "ecw",
  MEDPLUM = "medplum",
  INFERNO = "inferno",
  NONE = "none",
}

export function instanceOfEmr(object: unknown): object is EMR {
  return Object.values(EMR).includes(object as string as EMR);
}

export default class SmartLaunchHandler {
  readonly clientID: string;
  readonly clientSecret?: string;
  private emrType: EMR;

  constructor(clientID: string, clientSecret?: string, emrType?: EMR) {
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.emrType = emrType ?? EMR.NONE; // Default to EMR.NONE if not provided
  }

  /**
   * Explicitly sets the EMR type.
   * @param {EMR} emrType - The EMR type to set.
   */
  setEMRType(emrType: EMR) {
    this.emrType = emrType;
  }

  private async launchEMR(
    redirect: string,
    iss: string,
    launchType: LAUNCH
  ): Promise<string | void> {
    if (launchType === LAUNCH.BACKEND) {
      throw new Error("This doesn't work for backend launch");
    }

    const defaultScopes = ["openid", "fhirUser"];
    const emrSpecificScopes = getEmrSpecificScopes(this.emrType, launchType);
    const scope = [...defaultScopes, ...emrSpecificScopes].join(" ");
    const emrSpecificAuthorizeParams: Partial<fhirclient.AuthorizeParams> =
      getEMRSpecificAuthorizeParams(this.emrType);
    const redirect_uri = redirect ?? "";

    const authorizeParams = {
      client_id: this.clientID,
      iss: iss,
      redirect_uri: redirect_uri,
      scope: scope,
      clientSecret: this.clientSecret,
      ...emrSpecificAuthorizeParams,
    };
    return FHIR.oauth2.authorize(authorizeParams);
  }

  async authorizeEMR(launchType: LAUNCH = LAUNCH.EMR, redirectPath?: string) {
    if (launchType === LAUNCH.BACKEND) {
      throw new Error(`Direct Backend Authorization not supported yet.`);
    } else {
      return await this.executeWebLaunch(launchType, redirectPath);
    }
  }

  private async executeWebLaunch(launchType: LAUNCH, redirectPath?: string) {
    const queryString = window.location.search;
    const origin = window.location.origin;
    const redirect =
      origin +
      (redirectPath
        ? redirectPath.startsWith("/")
          ? redirectPath
          : "/" + redirectPath
        : "");
    const urlParams = new URLSearchParams(queryString);
    const iss = urlParams.get("iss") ?? undefined;

    if (!iss) {
      throw new Error(
        "Iss Search parameter must be provided as part of EMR Web Launch"
      );
    }

    // If the EMR type has not been explicitly set, try to determine it
    if (this.emrType === EMR.NONE) {
      this.emrType = SmartLaunchHandler.getEMRType(iss);
    }

    if (this.emrType === EMR.NONE || !this.emrType) {
      throw new Error("EMR type cannot be inferred from the ISS");
    }

    await this.launchEMR(redirect, iss, launchType);
  }

  static getEMRType(iss?: string): EMR {
    if (iss) {
      const isEMROfType = (emrType: EMR) => iss.includes(emrType);
      const emrTypes = Object.values(EMR);
      return emrTypes.find(isEMROfType) ?? EMR.NONE;
    }
    const emrType = (
      process.env.REACT_APP_EMR_TYPE as string
    ).toLowerCase() as EMR;
    if (!emrType) {
      throw new Error(
        "EMR type cannot be inferred. You must provide the emrType explicitly as an env variable"
      );
    }
    return emrType;
  }
}

function getEmrSpecificScopes(emrType: EMR, launchType: LAUNCH): string[] {
  const standardScopes = [
    launchType === LAUNCH.STANDALONE ? "launch/practitioner" : "launch",
    "online_access",
  ];
  switch (emrType) {
    case EMR.CERNER:
      return [
        ...standardScopes,
        ...cerner.scopes.map(
          (name) => (scopes as { [key: string]: string })[name]
        ),
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
    case EMR.SMART:
      return [
        launchType === LAUNCH.STANDALONE ? "launch/patient" : "launch",
        launchType === LAUNCH.STANDALONE ? "patient/*.*" : "",
        "user/*.*",
        "offline_access",
        "profile",
      ];
    case EMR.EPIC:
    default:
      return standardScopes;
  }
}

function getEMRSpecificAuthorizeParams(
  emrType: EMR
): Partial<fhirclient.AuthorizeParams> {
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
