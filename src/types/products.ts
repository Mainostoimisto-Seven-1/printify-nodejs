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

const test: ProductOption = {
    type: "color",
    name: "Color",
    values: [
        {
            id: 1,
            title: "red",
            colors: ["#ff0000"],
        },
    ],
};

type Product = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    options: ProductOption[];
    variants: {
        id: number;
        sku: string;
        cost: number;
        price: number;
        title: string;
        grams: number;
        is_enabled: boolean;
        is_default: boolean;
        is_available: boolean;
        is_printify_express_eligible: boolean;
        options: number[];
    }[];
    images: {
        src: string;
        variant_ids: number[];
        position: string;
        is_default: boolean;
    }[];
    created_at: string;
    updated_at: string;
    visible: boolean;
    is_locked: false;
    is_printify_express_eligible: boolean;
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

export type ArchiveUploadedImageResponse = {};
