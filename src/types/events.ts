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

export type PrintifyEvent = {
    id: string;
    type: EventTypes;
    created_at: string;
} & (
    | {
          type: "shop:disconnected";
      }
    | {
          type: "product:deleted";
      }
    | {
          type: "product:publish:started";
          resource: {
              id: string;
              type: "product";
              data: {
                  shop_id: number;
              } & (
                  | {
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
                    }
                  | {
                        action: "delete";
                    }
              );
          };
      }
    | {
          type: "order:created";
      }
    | {
          type: "order:updated";
          resource: {
              id: string;
              shop_id: number;
              data: {
                  shop_id: number;
                  status: OrderStatus;
              };
          };
      }
    | {
          type: "order:shipment:created";
          resource: {
              id: string;
              type: "order";
              data: {
                  shop_id: number;
                  shipped_at: string;
                  carrier: {
                      code: string;
                      tracking_number: string;
                  };
                  skus: string[];
              };
          };
      }
    | {
          type: "order:shipment:delivered";
          resource: {
              id: string;
              type: "order";
              data: {
                  shop_id: number;
                  delivered_at: string;
                  carrier: {
                      code: string;
                      tracking_number: string;
                  };
                  skus: string[];
              };
          };
      }
    | {
          type: "order:sent-to-production";
      }
);
