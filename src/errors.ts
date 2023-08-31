export class PrintifyError extends Error {
    response?: Response;
    status?: number;
    data?: unknown;

    constructor(message: string) {
        super(message);
        this.name = "PrintifyError";
    }

    static async fromResponse(response: Response) {
        const error = new PrintifyError(response.statusText);
        error.response = response;
        error.status = response.status;
        if (
            response.headers.get("content-type")?.includes("application/json")
        ) {
            error.data = await response.json();
        }
        return error;
    }
}
