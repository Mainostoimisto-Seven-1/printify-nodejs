export type LineItemStatus = "pending" | "canceled" | "fulfilled";

export interface LineItem {
    readonly product_id?: string;
    readonly variant_id: number;
    readonly quantity: number;
    readonly print_provider_id: number;
    readonly cost?: number;
    readonly shipping_cost?: number;
    readonly status?: LineItemStatus;
    readonly metadata?: {
        readonly title?: string;
        readonly price?: number;
        readonly variant_label?: string;
        readonly sku?: string;
        readonly country?: string;
    };
    readonly sent_to_production_at?: string;
    readonly fulfilled_at?: string;
}

export interface OrderMetadata {
    readonly order_type?: "external" | "manual" | "sample";
    readonly shop_order_id?: number;
    readonly shop_order_label?: string;
    readonly shop_fulfilled_at?: string;
}

export interface Shipment {
    readonly carrier?: string;
    readonly number?: string;
    readonly url?: string;
    readonly delivered_at?: string;
}

export type OrderStatus =
    | "pending"
    | "on-hold"
    | "checking-quality"
    | "quality-declined"
    | "quality-approved"
    | "ready-for-production"
    | "sending-to-production"
    | "in-production"
    | "canceled"
    | "fulfilled"
    | "partially-fulfilled"
    | "payment-not-received"
    | "callback-received"
    | "has-issues";

export enum ShippingMethod {
    /**
     * Standard Shippinh
     */
    standard = 1,
    /**
     * Priority Shipping
     */
    priority = 2,
    /**
     * Printify Express Shipping
     * @see https://developers.printify.com/#orders:~:text=or%20has%2Dissues.-,shipping%20method,-REQUIRED
     * @deprecated Not yet supported on public api. Should not be used for making orders.
     */
    express = 3,
}

export type Order = {
    readonly id?: string;
    readonly address_to: {
        readonly first_name: string;
        readonly last_name: string;
        readonly region: string;
        readonly address1: string;
        readonly city: string;
        readonly zip: string;
        readonly email: string;
        readonly phone: string;
        readonly country: string;
        readonly company?: string;
    };
    readonly line_items: LineItem[];
    readonly metadata?: OrderMetadata;
    readonly total_price?: number;
    readonly total_shipping?: number;
    readonly total_tax?: number;
    readonly status?: OrderStatus;
    readonly shipping_method: ShippingMethod;
    readonly shipments?: Shipment[];
    readonly created_at?: string;
    readonly sent_to_production_at?: string;
    readonly fulfilled_at?: string;
    readonly printify_connect?: {
        readonly url: string;
        readonly id: string;
    };
};

/**
 * @todo finish
 */
export interface SkuLineItem {
    sku: string;
    quantity: number;
}

/**
 * @todo finish
 */
export interface NewProductLineItem {
    print_provider_id: number;
    blueprint_id: number;
    variant_id: number;
    print_areas:
        | {
              front: string;
          }
        | {
              back: string;
          }
        | {
              front: string;
              back: string;
          };
    quantity: number;
}

export interface ProductIdLineItem {
    product_id: string;
    variant_id: number;
    quantity: number;
}

export type OrderSubmissionProperties = {
    external_id: string;
    label?: SVGStringList;
    line_items: (ProductIdLineItem | NewProductLineItem | SkuLineItem)[];
    shipping_method: ShippingMethod;
    send_shipping_notification?: boolean;
    address_to: {
        first_name: string;
        last_name: string;
        region: string;
        address1: string;
        address2?: string;
        city: string;
        zip: string;
        email: string;
        phone: string;
        country: string;
        company?: string;
    };
};

export type OrderSubmissionResponse = {
    id: string;
};

export type CalculateOrderShippingCostResponse = {
    standard: number;
    express: number;
    priority: number;
    printify_express: number;
};
