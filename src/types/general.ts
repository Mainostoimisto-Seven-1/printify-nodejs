export type BlueprintProperties = {
    readonly id: number;
    readonly title: string;
    readonly brand: string;
    readonly model: string;
    readonly images: string[];
};

export type PrintProviderPropterties = {
    readonly id: number;
    readonly title: string;
    readonly location: {
        address1: string;
        address2: string;
        city: string;
        country: string;
        region: string;
        zip: string;
    };
};

export type VariantProperties = {
    readonly id: number;
    readonly title: string;
    readonly options: {
        color: string;
        size: string;
    };
    readonly placeholders: PlaceholderProperties[];
};

export type PlaceholderProperties = {
    readonly position: string;
    readonly height: number;
    readonly width: number;
};

export type ShippingProperties = {
    readonly handling_time: {
        value: number;
        unit: string;
    };

    readonly profiles: ProfileProperties[];
};

export type ProfileProperties = {
    readonly variant_ids: number[];
    readonly first_item: {
        currency: string;
        cost: number;
    };
    readonly additional_items: {
        currency: string;
        cost: number;
    };
    readonly countries: string[];
};

export type PrintDetailsProperties = {
    print_on_side?: string;
    separator_type?: string;
    separator_color?: string;
};
