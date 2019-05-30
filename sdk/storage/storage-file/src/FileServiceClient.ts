// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as Models from "./generated/lib/models";
import { Aborter } from "./Aborter";
import { Service } from "./generated/lib/operations";
import { Pipeline } from "./Pipeline";
import { StorageClient } from "./StorageClient";
import { ShareClient } from "./ShareClient";
import { appendToURLPath } from "./utils/utils.common";

/**
 * Options to configure List Shares Segment operation.
 *
 * @export
 * @interface ServiceListSharesSegmentOptions
 */
export interface ServiceListSharesSegmentOptions {
  /**
   * Aborter instance to cancel request. It can be created with Aborter.none
   * or Aborter.timeout(). Go to documents of {@link Aborter} for more examples
   * about request cancellation.
   *
   * @type {Aborter}
   * @memberof AppendBlobCreateOptions
   */
  abortSignal?: Aborter;
  /**
   * Filters the results to return only entries whose
   * name begins with the specified prefix.
   *
   * @type {string}
   * @memberof ServiceListSharesSegmentOptions
   */
  prefix?: string;

  /**
   * Specifies the maximum number of entries to
   * return. If the request does not specify maxresults, or specifies a value
   * greater than 5,000, the server will return up to 5,000 items.
   *
   * @type {number}
   * @memberof ServiceListSharesSegmentOptions
   */
  maxresults?: number;

  /**
   * Include this parameter to
   * specify one or more datasets to include in the response.
   *
   * @type {Models.ListSharesIncludeType[]}
   * @memberof ServiceListSharesSegmentOptions
   */
  include?: Models.ListSharesIncludeType[];
}

/**
 * Options to configure File Service - Get Properties operation.
 *
 * @export
 * @interface ServiceGetPropertiesOptions
 */
export interface ServiceGetPropertiesOptions {
  /**
   * Aborter instance to cancel request. It can be created with Aborter.none
   * or Aborter.timeout(). Go to documents of {@link Aborter} for more examples
   * about request cancellation.
   *
   * @type {Aborter}
   * @memberof AppendBlobCreateOptions
   */
  abortSignal?: Aborter;
}

/**
 * Options to configure File Service - Set Properties operation.
 *
 * @export
 * @interface ServiceSetPropertiesOptions
 */
export interface ServiceSetPropertiesOptions {
  /**
   * Aborter instance to cancel request. It can be created with Aborter.none
   * or Aborter.timeout(). Go to documents of {@link Aborter} for more examples
   * about request cancellation.
   *
   * @type {Aborter}
   * @memberof AppendBlobCreateOptions
   */
  abortSignal?: Aborter;
}

/**
 * A FileServiceClient represents a URL to the Azure Storage File service allowing you
 * to manipulate file shares.
 *
 * @export
 * @class FileServiceClient
 * @extends {StorageClient}
 */
export class FileServiceClient extends StorageClient {
  /**
   * serviceContext provided by protocol layer.
   *
   * @private
   * @type {Service}
   * @memberof FileServiceClient
   */
  private serviceContext: Service;

  /**
   * Creates an instance of FileServiceClient.
   *
   * @param {string} url A URL string pointing to Azure Storage file service, such as
   *                     "https://myaccount.file.core.windows.net". You can Append a SAS
   *                     if using AnonymousCredential, such as "https://myaccount.file.core.windows.net?sasString".
   * @param {Pipeline} pipeline Call StorageClient.newPipeline() to create a default
   *                            pipeline, or provide a customized pipeline.
   * @memberof FileServiceClient
   */
  constructor(url: string, pipeline: Pipeline) {
    super(url, pipeline);
    this.serviceContext = new Service(this.storageClientContext);
  }

  /**
   * Creates a ShareClient object.
   *
   * @param shareName
   * @returns {ShareClient}
   * @memberof FileServiceClient
   */
  public createShareClient(shareName: string): ShareClient {
    return new ShareClient(appendToURLPath(this.url, shareName), this.pipeline);
  }

  /**
   * Gets the properties of a storage account’s file service, including properties
   * for Storage Analytics and CORS (Cross-Origin Resource Sharing) rules.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/get-file-service-properties}
   *
   * @param {ServiceGetPropertiesOptions} [options={}] Optional options to Get Properties operation.
   * @returns {Promise<Models.ServiceGetPropertiesResponse>}
   * @memberof FileServiceClient
   */
  public async getProperties(
    options: ServiceGetPropertiesOptions = {}
  ): Promise<Models.ServiceGetPropertiesResponse> {
    const aborter = options.abortSignal || Aborter.none;
    return this.serviceContext.getProperties({
      abortSignal: aborter
    });
  }

  /**
   * Sets properties for a storage account’s file service endpoint, including properties
   * for Storage Analytics, CORS (Cross-Origin Resource Sharing) rules and soft delete settings.
   * @see https://docs.microsoft.com/en-us/rest/api/storageservices/set-file-service-properties}
   *
   * @param {Models.StorageServiceProperties} properties
   * @param {ServiceSetPropertiesOptions} [options={}] Optional options to Set Properties operation.
   * @returns {Promise<Models.ServiceSetPropertiesResponse>}
   * @memberof FileServiceClient
   */
  public async setProperties(
    properties: Models.StorageServiceProperties,
    options: ServiceSetPropertiesOptions = {}
  ): Promise<Models.ServiceSetPropertiesResponse> {
    const aborter = options.abortSignal || Aborter.none;
    return this.serviceContext.setProperties(properties, {
      abortSignal: aborter
    });
  }

  /**
   * Gets the properties of a storage account's File service, including properties for Storage
   * Analytics metrics and CORS (Cross-Origin Resource Sharing) rules.
   *
   * @param {string} [marker] A string value that identifies the portion of
   *                          the list to be returned with the next list operation. The operation
   *                          returns a marker value within the response body if the list returned was
   *                          not complete. The marker value may then be used in a subsequent call to
   *                          request the next set of list items. The marker value is opaque to the
   *                          client.
   * @param {ServiceListSharesSegmentOptions} [options={}] Optional options to List Shares Segment operation.
   * @returns {Promise<Models.ServiceListSharesSegmentResponse>}
   * @memberof FileServiceClient
   */
  public async listSharesSegment(
    marker?: string,
    options: ServiceListSharesSegmentOptions = {}
  ): Promise<Models.ServiceListSharesSegmentResponse> {
    const aborter = options.abortSignal || Aborter.none;
    return this.serviceContext.listSharesSegment({
      abortSignal: aborter,
      marker,
      ...options
    });
  }
}
