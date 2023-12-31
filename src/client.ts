import { BASE_URL, VERSION } from "./constants";
import {
    GetBlueprintPrintProviderShippingInformationResponse,
    GetBlueprintPrintProviderVariantsResponse,
    GetBlueprintPrintProvidersResponse,
    GetBlueprintResponse,
    GetBlueprintsResponse,
    GetPrintProviderResponse,
    GetPrintProvidersResponse,
} from "./types/catalog";
import {
    CalculateOrderShippingCostResponse,
    Order,
    OrderStatus,
    OrderSubmissionProperties,
    OrderSubmissionResponse,
} from "./types/orders";
import {
    PaginatedResponse,
    PaginationOptions,
} from "./types/paginated-response";
import {
    ArchiveUploadedImageResponse,
    CreateProductPayload,
    CreateProductResponse,
    DeleteProductResponse,
    GetAllProductsResponse,
    GetProductResponse,
    ProductUnblishedNotifyResponse,
    PublishProductFailedPayload,
    PublishProductFailedResponse,
    PublishProductPayload,
    PublishProductResponse,
    PublishProductSuccessPayload,
    PublishProductSuccessResponse,
    UpdateProductPayload,
    UpdateProductResponse,
} from "./types/products";
import { DisconnectShopResponse, type GetShopsResponse } from "./types/shops";
import {
    GetUploadedImageResponse,
    GetUploadedImagesResponse,
    UploadImagePayload,
    UploadImageResponse,
} from "./types/uploads";
import {
    CreateWebhookPayload,
    ModifyWebhookPayload,
    Webhook,
} from "./types/webhooks";

import crypto from "node:crypto";
import {
    PrintifyError,
    PrintifyWebhookSignatureVerificationError,
} from "./errors";
import { PrintifyEvent } from "./types/events";

export interface PrintifyClientOptions {
    token: string;
    version: VERSION;
    debug?: boolean;
}

/**
 * Client for executing the requests to the Printify API
 */
class PrintifyClient {
    /**
     * Printify API Token
     */
    private token: string;
    /**
     * Printify API URL
     */
    private API_URL: string;
    /**
     * Toggle for the debug mode of the client.
     * While true, the client will print debug messages to the console.
     */
    private debug = false;

    constructor(options: PrintifyClientOptions) {
        const { token, version, debug } = options;
        this.token = token;
        this.API_URL = `${BASE_URL}${version}`;
        this.debug = debug ?? false;
    }

    /**
     * Method for calling arbitrary api endpoints with the token and error handling.
     */
    async callApi<TResponse>(options: {
        method: "GET" | "POST" | "DELETE" | "PUT";
        path: string;
        headers?: HeadersInit;
        body?: Record<string, unknown>;
        searchParams?: Record<string, string>;
    }) {
        const url = `${this.API_URL}${options.path}${
            options.searchParams
                ? "?" + new URLSearchParams(options.searchParams).toString()
                : ""
        }`;
        const response = await fetch(url, {
            method: options.method,
            headers: {
                "User-Agent": "Printify NodeJS Client",
                "Content-Type": "application/json;charset=utf-8",
                Authorization: `Bearer ${this.token}`,
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        let data: TResponse | null = null;
        let error: PrintifyError | null = null;
        if (!response.ok) {
            error = await PrintifyError.fromResponse(response);
        } else {
            data = (await response.json()) as unknown as TResponse;
        }
        if (this.debug)
            console.debug(`printify-nodejs:`, { options, data, error });
        return { data, error };
    }

    // Shops

    /**
     * @link https://developers.printify.com/#retrieve-list-of-shops-in-a-printify-account
     */
    async getShops() {
        const data = await this.callApi<GetShopsResponse>({
            method: "GET",
            path: "/shops.json",
        });
        return data;
    }

    /**
     * @link https://developers.printify.com/#disconnect-shop
     */
    async disconnectShop(shopId: number) {
        const data = await this.callApi<DisconnectShopResponse>({
            method: "DELETE",
            path: `/shops/${shopId}/connection.json`,
        });
        return data;
    }

    // Catalog

    /**
     * @link https://developers.printify.com/#retrieve-a-list-of-available-blueprints
     */
    async getBlueprints() {
        const data = await this.callApi<GetBlueprintsResponse>({
            method: "GET",
            path: "/catalog/blueprints.json",
        });
        return data;
    }

    /**
     * @link https://developers.printify.com/#retrieve-a-specific-blueprint
     */
    async getBlueprintById(blueprintId: number) {
        const data = await this.callApi<GetBlueprintResponse>({
            method: "GET",
            path: `/catalog/blueprints/${blueprintId}.json`,
        });
        return data;
    }

    /**
     * @link https://developers.printify.com/#retrieve-a-list-of-all-print-providers-that-fulfill-orders-for-a-specific-blueprint
     */
    async getBlueprintPrintProviders(
        blueprintId: number,
        showOutOfStock: boolean = false
    ) {
        const data = await this.callApi<GetBlueprintPrintProvidersResponse>({
            method: "GET",
            path: `/catalog/blueprints/${blueprintId}/print_providers.json`,
            searchParams: {
                "show-out-of-stock": showOutOfStock ? "1" : "0",
            },
        });
        return data;
    }

    /**
     * @link https://developers.printify.com/#retrieve-a-list-of-variants-of-a-blueprint-from-a-specific-print-provider
     */
    async getBlueprintPrintProviderVariants(
        blueprintId: number,
        printProviderId: number,
        showOutOfStock: boolean = false
    ) {
        const data =
            await this.callApi<GetBlueprintPrintProviderVariantsResponse>({
                method: "GET",
                path: `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/variants.json`,
                searchParams: {
                    "show-out-of-stock": showOutOfStock ? "1" : "0",
                },
            });
        return data;
    }

    async getBlueprintPrintProviderShippingInformation(
        blueprintId: number,
        printProviderId: number
    ) {
        const data =
            await this.callApi<GetBlueprintPrintProviderShippingInformationResponse>(
                {
                    method: "GET",
                    path: `/catalog/blueprints/${blueprintId}/print_providers/${printProviderId}/shipping.json`,
                }
            );
        return data;
    }

    async getPrintProviders() {
        const data = await this.callApi<GetPrintProvidersResponse>({
            method: "GET",
            path: "/catalog/print_providers.json",
        });
        return data;
    }

    async getPrintProviderById(printProviderId: number) {
        const data = await this.callApi<GetPrintProviderResponse>({
            method: "GET",
            path: `/catalog/print_providers/${printProviderId}.json`,
        });
        return data;
    }

    // Products

    async getAllProducts(
        shopId: number,
        pagination: {
            limit: number;
            page: number;
        } = { limit: 10, page: 1 }
    ) {
        const data = await this.callApi<GetAllProductsResponse>({
            method: "GET",
            path: `/shops/${shopId}/products.json`,
            searchParams: {
                limit: pagination.limit.toString(),
                page: pagination.page.toString(),
            },
        });
        return data;
    }

    async getProductById(shopId: number, productId: string) {
        const data = await this.callApi<GetProductResponse>({
            method: "GET",
            path: `/shops/${shopId}/products/${productId}.json`,
        });
        return data;
    }

    async createProduct(shopId: number, payload: CreateProductPayload) {
        const data = await this.callApi<CreateProductResponse>({
            method: "POST",
            body: payload,
            path: `/shops/${shopId}/products.json`,
        });
        return data;
    }

    async updateProduct(
        shopId: number,
        productId: string,
        payload: UpdateProductPayload
    ) {
        const data = await this.callApi<UpdateProductResponse>({
            method: "PUT",
            body: payload,
            path: `/shops/${shopId}/products/${productId}.json`,
        });
        return data;
    }

    async deleteProduct(shopId: number, productId: string) {
        const data = await this.callApi<DeleteProductResponse>({
            method: "DELETE",
            path: `/shops/${shopId}/products/${productId}.json`,
        });
        return data;
    }

    async publishProduct(
        shopId: number,
        productId: string,
        payload: PublishProductPayload
    ) {
        const data = await this.callApi<PublishProductResponse>({
            method: "POST",
            body: payload,
            path: `/shops/${shopId}/products/${productId}/publish.json`,
        });
        return data;
    }

    async publishProductSuccess(
        shopId: number,
        productId: string,
        payload: PublishProductSuccessPayload
    ) {
        const data = await this.callApi<PublishProductSuccessResponse>({
            method: "POST",
            body: payload,
            path: `/shops/${shopId}/products/${productId}/publishing_succeeded.json`,
        });
        return data;
    }

    async publishProductFailure(
        shopId: number,
        productId: string,
        payload: PublishProductFailedPayload
    ) {
        const data = await this.callApi<PublishProductFailedResponse>({
            method: "POST",
            body: payload,
            path: `/shops/${shopId}/products/${productId}/publishing_failed.json`,
        });
        return data;
    }

    async unpublishProduct(shopId: number, productId: string) {
        const data = await this.callApi<ProductUnblishedNotifyResponse>({
            method: "POST",
            body: {},
            path: `/shops/${shopId}/products/${productId}/unpublish.json`,
        });
        return data;
    }

    //* Orders

    async getOrders(
        shopId: number,
        {
            pagination,
            filters,
        }: {
            pagination: PaginationOptions;
            filters?: {
                sku?: string;
                status?: OrderStatus;
            };
        } = {
            pagination: { limit: 10, page: 1 },
        }
    ) {
        const data = await this.callApi<PaginatedResponse<Order[]>>({
            method: "GET",
            searchParams: {
                limit: pagination.limit.toString(),
                page: pagination.page.toString(),
                ...filters,
            },
            path: `/shops/${shopId}/orders.json`,
        });
        return data;
    }

    async getOrder(shopId: number, orderId: string) {
        const data = await this.callApi<Order>({
            method: "GET",
            path: `/shops/${shopId}/orders/${orderId}.json`,
        });
        return data;
    }

    async submitOrder(shopId: number, paylod: OrderSubmissionProperties) {
        const data = await this.callApi<OrderSubmissionResponse>({
            method: "POST",
            body: paylod,
            path: `/shops/${shopId}/orders.json`,
        });
        return data;
    }

    async sendOrderToProduction(shopId: number, orderId: string) {
        const data = await this.callApi<Order>({
            method: "POST",
            body: {},
            path: `/shops/${shopId}/orders/${orderId}/send_to_production.json`,
        });
        return data;
    }

    async calculateOrderShippingCost(
        shopId: number,
        payload: Pick<OrderSubmissionProperties, "line_items" | "address_to">
    ) {
        const data = await this.callApi<CalculateOrderShippingCostResponse>({
            method: "POST",
            body: payload,
            path: `/shops/${shopId}/orders/shipping.json`,
        });
        return data;
    }

    async cancelOrder(shopId: number, orderId: string) {
        const data = await this.callApi<Order>({
            method: "POST",
            body: {},
            path: `/shops/${shopId}/orders/${orderId}/cancel.json`,
        });
        return data;
    }

    // Uploads
    async getImageUploads(
        pagination: PaginationOptions = { limit: 10, page: 1 }
    ) {
        const data = await this.callApi<GetUploadedImagesResponse>({
            method: "GET",
            path: `/uploads.json`,
            searchParams: {
                limit: pagination.limit.toString(),
                page: pagination.page.toString(),
            },
        });
        return data;
    }

    async getImageUploadById(imageId: string) {
        const data = await this.callApi<GetUploadedImageResponse>({
            method: "GET",
            path: `/uploads/${imageId}.json`,
        });
        return data;
    }

    async uploadImage(payload: UploadImagePayload) {
        const data = await this.callApi<UploadImageResponse>({
            method: "POST",
            body: payload,
            path: `/uploads/images.json`,
        });
        return data;
    }

    async archiveImage(imageId: string) {
        const data = await this.callApi<ArchiveUploadedImageResponse>({
            method: "POST",
            body: {},
            path: `/uploads/${imageId}/archive.json`,
        });
        return data;
    }

    //* Webhooks

    async getWebhooks(shopId: number) {
        const data = await this.callApi<Webhook[]>({
            method: "GET",
            path: `/shops/${shopId}/webhooks.json`,
        });
        return data;
    }

    async createWebhook(shopId: number, payload: CreateWebhookPayload) {
        const data = await this.callApi<Webhook>({
            method: "POST",
            body: payload,
            path: `/shops/${shopId}/webhooks.json`,
        });
        return data;
    }

    async modifyWebhook(
        shopId: number,
        webhookId: string,
        payload: ModifyWebhookPayload
    ) {
        const data = await this.callApi<Webhook>({
            method: "PUT",
            body: payload,
            path: `/shops/${shopId}/webhooks/${webhookId}.json`,
        });
        return data;
    }

    async deleteWebhook(shopId: number, webhookId: string) {
        const data = await this.callApi<{}>({
            method: "DELETE",
            path: `/shops/${shopId}/webhooks/${webhookId}.json`,
        });
        return data;
    }

    verifyWebhook(secret: string, signature: string, body: string) {
        const hmac = crypto.createHmac("sha256", secret);
        const hash = "sha256=" + hmac.update(body).digest("hex");

        const verified = crypto.timingSafeEqual(
            Buffer.from(hash),
            Buffer.from(signature)
        );

        return verified;
    }

    /**
     *
     * @throws {PrintifyWebhookSignatureVerificationError}
     */
    decodeEvent(secret: string, signature: string, body: string) {
        const verified = this.verifyWebhook(secret, signature, body);

        if (!verified) {
            throw new PrintifyWebhookSignatureVerificationError();
        }

        const event = JSON.parse(body);

        return event as PrintifyEvent;
    }
}

export { PrintifyClient };
