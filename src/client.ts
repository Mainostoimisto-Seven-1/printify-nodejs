export const API_URL = "https://api.printify.com/v1";

import { GetBlueprintsResponse } from "./types/catalog";
import { DisconnectShopResponse, type GetShopsResponse } from "./types/shops";

class PrintifyClient {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    async callApi<TResponse>(options: {
        method: "GET" | "POST" | "DELETE";
        path: string;
        headers?: HeadersInit;
        body?: Record<string, unknown>;
    }) {
        const response = await fetch(`${API_URL}${options.path}`, {
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
