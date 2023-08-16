import {
    GetBlueprintPrintProviderShippingInformationResponse,
    GetBlueprintPrintProviderVariantsResponse,
    GetBlueprintPrintProvidersResponse,
    GetBlueprintsResponse,
    GetPrintProviderResponse,
    GetPrintProvidersResponse,
} from "./types/catalog";
import { DisconnectShopResponse, type GetShopsResponse } from "./types/shops";
import { BASE_URL, VERSION, VERSIONS } from "./constants";
import {
    CreateProductPayload,
    CreateProductResponse,
    GetAllProductsResponse,
} from "./types/products";

export interface PrintifyClientOptions {
    token: string;
    version: VERSION;
}

class PrintifyClient {
    token: string;
    API_URL: string;

    constructor({ token, version }: PrintifyClientOptions) {
        this.token = token;
        this.API_URL = `${BASE_URL}/${version}`;
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
        const data = (await response.json()) as unknown as TResponse;
        return data;
    }

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

    async getBlueprints() {
        const data = await this.callApi<GetBlueprintsResponse>({
            method: "GET",
            path: "/catalog/blueprints.json",
        });
        return data;
    }

    async getBlueprintById(blueprintId: number) {
        const data = await this.callApi<GetBlueprintsResponse>({
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
}

export { PrintifyClient };
