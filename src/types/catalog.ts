export type GetBlueprintsResponse = {
    id: number;
    title: string;
    description: string;
    brand: string;
    model: string;
    images: string[];
}[];

export type GetBlueprintResponse = {
    id: number;
    title: string;
    description: string;
    brand: string;
    model: string;
    images: string[];
};

export type GetBlueprintPrintProvidersResponse = {
    id: number;
    title: string;
}[];

export type GetBlueprintPrintProviderVariantsResponse = {
    id: number;
    title: string;
    variants: {
        id: number;
        title: string;
        options: {
            color: string;
            size: string;
        };
        placeholders: {
            position: string;
            height: number;
            width: number;
        }[];
    }[];
};

export type GetBlueprintPrintProviderShippingInformationResponse = {
    handling_time: {
        value: number;
        unit: string;
    };
    profiles: {
        variant_ids: number[];
        first_item: {
            cost: number;
            currency: string;
        };
        additional_items: {
            cost: number;
            currency: string;
        };
        countries: string[];
    }[];
};

export type GetPrintProvidersResponse = {
    id: number;
    title: string;
    location: {
        address1: string;
        address2: string;
        city: string;
        country: string;
        region: string;
        zip: string;
    };
}[];

export type GetPrintProviderResponse = {
    id: number;
    title: string;
    location: {
        address1: string;
        address2: string;
        city: string;
        region: string;
        zip: string;
    };
    blueprints: {
        id: number;
        title: string;
        brand: string;
        model: string;
        images: string[];
    }[];
};
