import { OrderStatus } from "./orders";

export type ShopEvents = "shop:disconnected";

export type ProductEvents = "product:deleted" | "product:publish:started";

export type OrderEvents =
    | "order:created"
    | "order:updated"
    | "order:sent-to-production"
    | "order:shipment:created"
    | "order:shipment:delivered";

export type EventTypes = ShopEvents | ProductEvents | OrderEvents;

export interface ShopDisconnectedEvent {
    id: string;
    type: "shop:disconnected";
    created_at: string;
    resource: {
        id: number;
        type: "shop";
        data: null;
    };
}

export interface ProductDeletedEvent {
    id: string;
    type: "product:deleted";
    created_at: string;
    resource: {
        id: string;
        type: "product";
        data: {
            shop_id: number;
        };
    };
}

export interface ProductPublishStartedEvent {
    id: string;
    type: "product:publish:started";
    created_at: string;
    resource: {
        id: string;
        type: "product";
        data: {
            shop_id: number;
            publish_details: {
                title: boolean;
                description: boolean;
                images: boolean;
                variants: boolean;
                tags: boolean;
                key_features: boolean;
                shipping_template: boolean;
            };
            action: "create";
            out_of_stock_publishing?: number;
        };
    };
}

export interface OrderCreatedEvent {
    id: string;
    type: "order:created";
    created_at: string;
    resource: {
        id: string;
        type: "order";
        data: {
            shop_id: number;
        };
    };
}

export interface OrderUpdatedEvent {
    id: string;
    type: "order:updated";
    created_at: string;
    resource: {
        id: string;
        type: "order";
        data: {
            shop_id: number;
            status: OrderStatus;
        };
    };
}

export interface OrderShipmentCreatedEvent {
    id: string;
    type: "order:shipment:created";
    created_at: string;
    resource: {
        id: string;
        type: "order";
        data: {
            shop_id: number;
            shipped_at: string;
            carrier: {
                code: string;
                tracking_number: string;
                tracking_url: string;
            };
            skus: string[];
        };
    };
}

export interface OrderShipmentDeliveredEvent {
    id: string;
    type: "order:shipment:delivered";
    created_at: string;
    resource: {
        id: string;
        type: "order";
        data: {
            shop_id: number;
            delivered_at: string;
            carrier: {
                code: string;
                tracking_number: string;
                tracking_url: string;
            };
            skus: string[];
        };
    };
}

export interface OrderSentToProductionEvent {
    id: string;
    type: "order:sent-to-production";
    created_at: string;
    resource: {
        id: string;
        type: "order";
        data: {
            shop_id: number;
        };
    };
}

export type PrintifyEvent =
    | ShopDisconnectedEvent
    | ProductDeletedEvent
    | ProductPublishStartedEvent
    | OrderCreatedEvent
    | OrderUpdatedEvent
    | OrderShipmentCreatedEvent
    | OrderShipmentDeliveredEvent
    | OrderSentToProductionEvent;
