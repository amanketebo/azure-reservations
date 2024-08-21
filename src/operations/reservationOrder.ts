/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import { PagedAsyncIterableIterator, PageSettings } from "@azure/core-paging";
import { setContinuationToken } from "../pagingHelper";
import { ReservationOrder } from "../operationsInterfaces";
import * as coreClient from "@azure/core-client";
import * as Mappers from "../models/mappers";
import * as Parameters from "../models/parameters";
import { AzureReservationAPI } from "../azureReservationAPI";
import {
  SimplePollerLike,
  OperationState,
  createHttpPoller
} from "@azure/core-lro";
import { createLroSpec } from "../lroImpl";
import {
  ReservationOrderResponse,
  ReservationOrderListNextOptionalParams,
  ReservationOrderListOptionalParams,
  ReservationOrderListResponse,
  PurchaseRequest,
  ReservationOrderCalculateOptionalParams,
  ReservationOrderCalculateResponse,
  ReservationOrderPurchaseOptionalParams,
  ReservationOrderPurchaseResponse,
  ReservationOrderGetOptionalParams,
  ReservationOrderGetResponse,
  ChangeDirectoryRequest,
  ReservationOrderChangeDirectoryOptionalParams,
  ReservationOrderChangeDirectoryResponse,
  ReservationOrderListNextResponse
} from "../models";

/// <reference lib="esnext.asynciterable" />
/** Class containing ReservationOrder operations. */
export class ReservationOrderImpl implements ReservationOrder {
  private readonly client: AzureReservationAPI;

  /**
   * Initialize a new instance of the class ReservationOrder class.
   * @param client Reference to the service client
   */
  constructor(client: AzureReservationAPI) {
    this.client = client;
  }

  /**
   * List of all the `ReservationOrder`s that the user has access to in the current tenant.
   * @param options The options parameters.
   */
  public list(
    options?: ReservationOrderListOptionalParams
  ): PagedAsyncIterableIterator<ReservationOrderResponse> {
    const iter = this.listPagingAll(options);
    return {
      next() {
        return iter.next();
      },
      [Symbol.asyncIterator]() {
        return this;
      },
      byPage: (settings?: PageSettings) => {
        if (settings?.maxPageSize) {
          throw new Error("maxPageSize is not supported by this operation.");
        }
        return this.listPagingPage(options, settings);
      }
    };
  }

  private async *listPagingPage(
    options?: ReservationOrderListOptionalParams,
    settings?: PageSettings
  ): AsyncIterableIterator<ReservationOrderResponse[]> {
    let result: ReservationOrderListResponse;
    let continuationToken = settings?.continuationToken;
    if (!continuationToken) {
      result = await this._list(options);
      let page = result.value || [];
      continuationToken = result.nextLink;
      setContinuationToken(page, continuationToken);
      yield page;
    }
    while (continuationToken) {
      result = await this._listNext(continuationToken, options);
      continuationToken = result.nextLink;
      let page = result.value || [];
      setContinuationToken(page, continuationToken);
      yield page;
    }
  }

  private async *listPagingAll(
    options?: ReservationOrderListOptionalParams
  ): AsyncIterableIterator<ReservationOrderResponse> {
    for await (const page of this.listPagingPage(options)) {
      yield* page;
    }
  }

  /**
   * Calculate price for placing a `ReservationOrder`.
   * @param body Information needed for calculate or purchase reservation
   * @param options The options parameters.
   */
  calculate(
    body: PurchaseRequest,
    options?: ReservationOrderCalculateOptionalParams
  ): Promise<ReservationOrderCalculateResponse> {
    return this.client.sendOperationRequest(
      { body, options },
      calculateOperationSpec
    );
  }

  /**
   * List of all the `ReservationOrder`s that the user has access to in the current tenant.
   * @param options The options parameters.
   */
  private _list(
    options?: ReservationOrderListOptionalParams
  ): Promise<ReservationOrderListResponse> {
    return this.client.sendOperationRequest({ options }, listOperationSpec);
  }

  /**
   * Purchase `ReservationOrder` and create resource under the specified URI.
   * @param reservationOrderId Order Id of the reservation
   * @param body Information needed for calculate or purchase reservation
   * @param options The options parameters.
   */
  async beginPurchase(
    reservationOrderId: string,
    body: PurchaseRequest,
    options?: ReservationOrderPurchaseOptionalParams
  ): Promise<
    SimplePollerLike<
      OperationState<ReservationOrderPurchaseResponse>,
      ReservationOrderPurchaseResponse
    >
  > {
    const directSendOperation = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ): Promise<ReservationOrderPurchaseResponse> => {
      return this.client.sendOperationRequest(args, spec);
    };
    const sendOperationFn = async (
      args: coreClient.OperationArguments,
      spec: coreClient.OperationSpec
    ) => {
      let currentRawResponse:
        | coreClient.FullOperationResponse
        | undefined = undefined;
      const providedCallback = args.options?.onResponse;
      const callback: coreClient.RawResponseCallback = (
        rawResponse: coreClient.FullOperationResponse,
        flatResponse: unknown
      ) => {
        currentRawResponse = rawResponse;
        providedCallback?.(rawResponse, flatResponse);
      };
      const updatedArgs = {
        ...args,
        options: {
          ...args.options,
          onResponse: callback
        }
      };
      const flatResponse = await directSendOperation(updatedArgs, spec);
      return {
        flatResponse,
        rawResponse: {
          statusCode: currentRawResponse!.status,
          body: currentRawResponse!.parsedBody,
          headers: currentRawResponse!.headers.toJSON()
        }
      };
    };

    const lro = createLroSpec({
      sendOperationFn,
      args: { reservationOrderId, body, options },
      spec: purchaseOperationSpec
    });
    const poller = await createHttpPoller<
      ReservationOrderPurchaseResponse,
      OperationState<ReservationOrderPurchaseResponse>
    >(lro, {
      restoreFrom: options?.resumeFrom,
      intervalInMs: options?.updateIntervalInMs,
      resourceLocationConfig: "location"
    });
    await poller.poll();
    return poller;
  }

  /**
   * Purchase `ReservationOrder` and create resource under the specified URI.
   * @param reservationOrderId Order Id of the reservation
   * @param body Information needed for calculate or purchase reservation
   * @param options The options parameters.
   */
  async beginPurchaseAndWait(
    reservationOrderId: string,
    body: PurchaseRequest,
    options?: ReservationOrderPurchaseOptionalParams
  ): Promise<ReservationOrderPurchaseResponse> {
    const poller = await this.beginPurchase(reservationOrderId, body, options);
    return poller.pollUntilDone();
  }

  /**
   * Get the details of the `ReservationOrder`.
   * @param reservationOrderId Order Id of the reservation
   * @param options The options parameters.
   */
  get(
    reservationOrderId: string,
    options?: ReservationOrderGetOptionalParams
  ): Promise<ReservationOrderGetResponse> {
    return this.client.sendOperationRequest(
      { reservationOrderId, options },
      getOperationSpec
    );
  }

  /**
   * Change directory (tenant) of `ReservationOrder` and all `Reservation` under it to specified tenant
   * id
   * @param reservationOrderId Order Id of the reservation
   * @param body Information needed to change directory of reservation order
   * @param options The options parameters.
   */
  changeDirectory(
    reservationOrderId: string,
    body: ChangeDirectoryRequest,
    options?: ReservationOrderChangeDirectoryOptionalParams
  ): Promise<ReservationOrderChangeDirectoryResponse> {
    return this.client.sendOperationRequest(
      { reservationOrderId, body, options },
      changeDirectoryOperationSpec
    );
  }

  /**
   * ListNext
   * @param nextLink The nextLink from the previous successful call to the List method.
   * @param options The options parameters.
   */
  private _listNext(
    nextLink: string,
    options?: ReservationOrderListNextOptionalParams
  ): Promise<ReservationOrderListNextResponse> {
    return this.client.sendOperationRequest(
      { nextLink, options },
      listNextOperationSpec
    );
  }
}
// Operation Specifications
const serializer = coreClient.createSerializer(Mappers, /* isXml */ false);

const calculateOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.Capacity/calculatePrice",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: Mappers.CalculatePriceResponse
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  requestBody: Parameters.body3,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.contentType, Parameters.accept],
  mediaType: "json",
  serializer
};
const listOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.Capacity/reservationOrders",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ReservationOrderList
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host],
  headerParameters: [Parameters.accept],
  serializer
};
const purchaseOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.Capacity/reservationOrders/{reservationOrderId}",
  httpMethod: "PUT",
  responses: {
    200: {
      bodyMapper: Mappers.ReservationOrderResponse
    },
    201: {
      bodyMapper: Mappers.ReservationOrderResponse
    },
    202: {
      bodyMapper: Mappers.ReservationOrderResponse
    },
    204: {
      bodyMapper: Mappers.ReservationOrderResponse
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  requestBody: Parameters.body3,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.reservationOrderId],
  headerParameters: [Parameters.contentType, Parameters.accept],
  mediaType: "json",
  serializer
};
const getOperationSpec: coreClient.OperationSpec = {
  path: "/providers/Microsoft.Capacity/reservationOrders/{reservationOrderId}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ReservationOrderResponse
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  queryParameters: [Parameters.apiVersion, Parameters.expand],
  urlParameters: [Parameters.$host, Parameters.reservationOrderId],
  headerParameters: [Parameters.accept],
  serializer
};
const changeDirectoryOperationSpec: coreClient.OperationSpec = {
  path:
    "/providers/Microsoft.Capacity/reservationOrders/{reservationOrderId}/changeDirectory",
  httpMethod: "POST",
  responses: {
    200: {
      bodyMapper: Mappers.ChangeDirectoryResponse
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  requestBody: Parameters.body4,
  queryParameters: [Parameters.apiVersion],
  urlParameters: [Parameters.$host, Parameters.reservationOrderId],
  headerParameters: [Parameters.contentType, Parameters.accept],
  mediaType: "json",
  serializer
};
const listNextOperationSpec: coreClient.OperationSpec = {
  path: "{nextLink}",
  httpMethod: "GET",
  responses: {
    200: {
      bodyMapper: Mappers.ReservationOrderList
    },
    default: {
      bodyMapper: Mappers.ErrorModel
    }
  },
  urlParameters: [Parameters.$host, Parameters.nextLink],
  headerParameters: [Parameters.accept],
  serializer
};
