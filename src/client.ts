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
    GetAllProductsResponse,
} from "./types/products";
import { PaginationOptions } from "./types/paginated-response";
import {
    GetUploadedImageResponse,
    GetUploadedImagesResponse,
    UploadImagePayload,
    UploadImageResponse,
} from "./types/uploads";

export interface PrintifyClientOptions {
    token: string;
    version: VERSION;
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

    constructor({ token, version }: PrintifyClientOptions) {
        this.token = token;
        this.API_URL = `${BASE_URL}${version}`;
    }

    async callApi<TResponse>(options: {
        method: "GET" | "POST" | "DELETE";
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
        console.debug(`Calling ${url}`);
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

    async createProduct(shopId: number, payload: CreateProductPayload) {
        const data = await this.callApi<CreateProductResponse>({
            method: "POST",
            body: payload,
            path: `/shops/${shopId}/products.json`,
        });
        return data;
    }

    // TODO: Finish product endpoints integration (https://developers.printify.com/#products)

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
}

export { PrintifyClient };
