import { PaginatedResponse } from "./paginated-response";

export type ProductOptionBase = {
    name: string;
};

export type ColorOption = ProductOptionBase & {
    type: "color";
    values: {
        id: number;
        title: string;
        colors: string[];
    }[];
};

export type BasicOption = ProductOptionBase & {
    type: string;
    values: {
        id: number;
        title: string;
    }[];
};

export type ProductOption = ColorOption | BasicOption;

export interface ProductVariant {
    id: number;
    sku?: string;
    price: number;
    cost?: number;
    title?: string;
    grams?: number;
    is_enabled?: boolean;
    is_default?: boolean;
    is_available?: boolean;
    is_printify_express_eligible?: boolean;
    options?: number[];
    quantity?: number;
}

type Product = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    options: ProductOption[];
    variants: ProductVariant[];
    images: {
        src: string;
        variant_ids: number[];
        position: string;
        is_default: boolean;
    }[];
    created_at: string;
    updated_at: string;
    visible: boolean;
    is_locked: boolean;
    is_printify_express_eligible: boolean,
    is_printify_express_enabled: boolean,
    is_economy_shipping_eligible: boolean,
    is_economy_shipping_enabled: boolean,
    blueprint_id: number;
    user_id: number;
    shop_id: number;
    print_provider_id: number;
    print_areas: {
        variant_ids: number[];
        placeholders: {
            position: string;
            images: {
                id: string;
                name: string;
                type: string;
                height: number;
                width: number;
                x: number;
                y: number;
                scale: number;
                angle: number;
            }[];
        }[];
        /**
         * Background HEX color
         */
        background: string;
    }[];
    sales_channel_properties: unknown[];
};

export type GetAllProductsResponse = PaginatedResponse<Product>;
export type GetProductResponse = Product;

export type CreateProductPayload = {
    title: string;
    description: string;
    blueprint_id: number;
    print_provider_id: number;
    variants: {
        id: number;
        price: number;
        is_enabled: boolean;
    }[];
    print_areas: {
        variant_ids: number[];
        placeholders: {
            position: string;
            images: {
                id: string;
                x: number;
                y: number;
                scale: number;
                angle: number;
            }[];
        }[];
    }[];
};

export type CreateProductResponse = Product;

/**
 * When updating variants, you must include all variants in the request.
 * @see https://developers.printify.com/#products
 */
export type UpdateProductPayload = Partial<Product>;
export type UpdateProductResponse = Product;

export type DeleteProductResponse = {};

export type PublishProductPayload = {
    title: boolean;
    description: boolean;
    images: boolean;
    variants: boolean;
    tags: boolean;
    keyFeatures: boolean;
    shipping_template: boolean;
};
export type PublishProductResponse = {};

export type PublishProductSuccessPayload = {
    external: {
        id: string;
        handle: string;
    };
};
export type PublishProductSuccessResponse = {};

export type PublishProductFailedPayload = {
    reason: string;
};
export type PublishProductFailedResponse = {};

export type ProductUnblishedNotifyResponse = {};

export type ArchiveUploadedImageResponse = {};
