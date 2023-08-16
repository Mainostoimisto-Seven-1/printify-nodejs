import { GetBlueprintsResponse } from "./types/catalog";
import { DisconnectShopResponse, type GetShopsResponse } from "./types/shops";
import { BASE_URL, VERSION, VERSIONS } from "./constants";

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
    }) {
        const response = await fetch(`${this.API_URL}${options.path}`, {
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
}

export { PrintifyClient };
