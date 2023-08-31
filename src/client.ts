import {
    GetBlueprintPrintProviderShippingInformationResponse,
    GetBlueprintPrintProviderVariantsResponse,
    GetBlueprintPrintProvidersResponse,
    GetBlueprintResponse,
    GetBlueprintsResponse,
    GetPrintProviderResponse,
    GetPrintProvidersResponse,
} from "./types/catalog";
import { DisconnectShopResponse, type GetShopsResponse } from "./types/shops";
import { BASE_URL, VERSION, VERSIONS } from "./constants";
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
import {
    PaginatedResponse,
    PaginationOptions,
} from "./types/paginated-response";
import {
    GetUploadedImageResponse,
    GetUploadedImagesResponse,
    UploadImagePayload,
    UploadImageResponse,
} from "./types/uploads";
import {
    Order,
    OrderStatus,
    OrderSubmissionProperties,
    OrderSubmissionResponse,
    CalculateOrderShippingCostResponse,
} from "./types/orders";
import {
    CreateWebhookPayload,
    ModifyWebhookPayload,
    Webhook,
} from "./types/webhooks";

import crypto from "crypto";
import { PrintifyEvent } from "./types/events";

export interface PrintifyClientOptions {
    token: string;
    version: VERSION;
    debug?: boolean;
}

export class PrintifyError extends Error {
    response?: Response;
    status?: number;
    data?: unknown;

    constructor(message: string) {
        super(message);
        this.name = "PrintifyError";
    }

    static fromResponse(response: Response) {
        const error = new PrintifyError(response.statusText);
        error.response = response;
        error.status = response.status;
        if (
            response.headers.get("content-type")?.includes("application/json")
        ) {
            error.data = response.json();
        }
        return error;
    }
}

class PrintifyClient {
    token: string;
    API_URL: string;
    debug = false;

    constructor({ token, version, debug }: PrintifyClientOptions) {
        this.token = token;
        this.API_URL = `${BASE_URL}${version}`;
        this.debug = debug ?? false;
    }

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
        if (this.debug) console.debug(`printify-nodejs:`, options);
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

        if (!response.ok) {
            throw PrintifyError.fromResponse(response);
        }

        const data = (await response.json()) as unknown as TResponse;
        return data;
    }

    // Shops

    async getShops() {
        const data = await this.callApi<GetShopsResponse>({
            method: "GET",
            path: "/shops.json",
        });
        return data;
    }

    async disconnectShop(shopId: number) {
        const data = await this.callApi<DisconnectShopResponse>({
            method: "DELETE",
            path: `/shops/${shopId}/connection.json`,
        });
        return data;
    }

    // Catalog
    async getBlueprints() {
        const data = await this.callApi<GetBlueprintsResponse>({
            method: "GET",
            path: "/catalog/blueprints.json",
        });
        return data;
    }

    async getBlueprintById(blueprintId: number) {
        const data = await this.callApi<GetBlueprintResponse>({
            method: "GET",
            path: `/catalog/blueprints/${blueprintId}.json`,
        });
        return data;
    }

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
            path: `/shops/${shopId}/orders/submit.json`,
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
            path: `/shops/${shopId}/orders/calculate_shipping_cost.json`,
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

    decodeEvent(secret: string, signature: string, body: string) {
        const verified = this.verifyWebhook(secret, signature, body);

        if (!verified) {
            throw new Error("Invalid signature");
        }

        const event = JSON.parse(body);

        return event as PrintifyEvent;
    }
}

export { PrintifyClient };
