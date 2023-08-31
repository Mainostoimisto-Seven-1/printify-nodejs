import { EventTypes } from "./events";

export interface Webhook {
    id?: string;
    topic: EventTypes;
    url: string;
    shop_id?: number;
    secret?: string;
}

export type CreateWebhookPayload = {
    topid: EventTypes;
    url: string;
};

export type ModifyWebhookPayload = {
    url: string;
};
