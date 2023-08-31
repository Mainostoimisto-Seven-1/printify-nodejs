/**
 * Besides the data property returned in response, there are also other properties that are helpful for paginating over the resources.
 * @link https://developers.printify.com/#api-pagination
 */
export type PaginatedResponse<TData> = {
    current_page: number;
    data: TData[];
    first_page_url: string;
    prev_page_url: string | null;
    next_page_url: string | null;
    last_page_url: string;
    last_page: number;
    total: number;
    per_page: number;
    from: number | null;
    to: number | null;
};

export type PaginationOptions = {
    limit: number;
    page: number;
};
