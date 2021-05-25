/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import * as coreHttp from "@azure/core-http";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { GeneratedClient } from "../generatedClient";
import {
  AttestationType,
  PolicyGetResponse,
  PolicySetModelResponse,
  PolicyResetResponse
} from "../models";

/**
 * Class representing a Policy.
 */
export class Policy {
  private readonly client: GeneratedClient;

  /**
   * Initialize a new instance of the class Policy class.
   * @param client Reference to the service client
   */
  constructor(client: GeneratedClient) {
    this.client = client;
  }

  /**
   * Retrieves the current policy for an attestation type.
   * @param attestationType Specifies the trusted execution environment to be used to validate the
   *                        evidence
   * @param options The options parameters.
   */
  get(
    attestationType: AttestationType,
    options?: coreHttp.OperationOptions
  ): Promise<PolicyGetResponse> {
    const operationArguments: coreHttp.OperationArguments = {
      attestationType,
      options: coreHttp.operationOptionsToRequestOptionsBase(options || {})
    };
    return this.client.sendOperationRequest(
      operationArguments,
      getOperationSpec
    ) as Promise<PolicyGetResponse>;
  }

  /**
   * Sets the policy for a given attestation type.
   * @param attestationType Specifies the trusted execution environment to be used to validate the
   *                        evidence
   * @param newAttestationPolicy JWT Expressing the new policy whose body is a StoredAttestationPolicy
   *                             object.
   * @param options The options parameters.
   */
  set(
    attestationType: AttestationType,
    newAttestationPolicy: string,
    options?: coreHttp.OperationOptions
  ): Promise<PolicySetModelResponse> {
    const operationArguments: coreHttp.OperationArguments = {
      attestationType,
      newAttestationPolicy,
      options: coreHttp.operationOptionsToRequestOptionsBase(options || {})
    };
    return this.client.sendOperationRequest(
      operationArguments,
      setOperationSpec
    ) as Promise<PolicySetModelResponse>;
  }

  /**
   * Resets the attestation policy for the specified tenant and reverts to the default policy.
   * @param attestationType Specifies the trusted execution environment to be used to validate the
   *                        evidence
   * @param policyJws JSON Web Signature with an empty policy document
   * @param options The options parameters.
   */
  reset(
    attestationType: AttestationType,
    policyJws: string,
    options?: coreHttp.OperationOptions
  ): Promise<PolicyResetResponse> {
    const operationArguments: coreHttp.OperationArguments = {
      attestationType,
      policyJws,
      options: coreHttp.operationOptionsToRequestOptionsBase(options || {})
    };
    return this.client.sendOperationRequest(
      operationArguments,
      resetOperationSpec
    ) as Promise<PolicyResetResponse>;
  }
}
// Operation Specifications

const serializer = new coreHttp.Serializer(Mappers, /* isXml */ false);

const getOperationSpec: coreHttp.OperationSpec = {
  path: "/policies/{attestationType}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.PolicyResponse
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.instanceUrl, Parameters.attestationType],
  headerParameters: [Parameters.accept],
  serializer
};
const setOperationSpec: coreHttp.OperationSpec = {
  path: "/policies/{attestationType}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.PolicyResponse
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  requestBody: Parameters.newAttestationPolicy,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.instanceUrl, Parameters.attestationType],
  headerParameters: [Parameters.contentType, Parameters.accept1],
  mediaType: "text",
  serializer
};
const resetOperationSpec: coreHttp.OperationSpec = {
  path: "/policies/{attestationType}:reset",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: Mappers.PolicyResponse
    },
    default: {
      bodyMapper: Mappers.CloudError
    }
  },
  requestBody: Parameters.policyJws,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.instanceUrl, Parameters.attestationType],
  headerParameters: [Parameters.contentType, Parameters.accept1],
  mediaType: "text",
  serializer
};
