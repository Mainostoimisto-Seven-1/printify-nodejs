import { PaginatedResponse } from "./paginated-response";

type UploadedImage = {
    id: string;
    file_name: string;
    height: number;
    width: number;
    size: number;
    mime_type: string;
    preview_url: string;
    upload_time: string;
};

export type GetUploadedImagesResponse = PaginatedResponse<UploadedImage>;
export type GetUploadedImageResponse = UploadedImage;
export type UploadImagePayload = {
    file_name: string;
} & (
    | {
          url: string;
      }
    | {
          /**
           * Base64 encoded image contents
           * @deprecated
           */
          contents: string;
      }
);
export type UploadImageResponse = UploadedImage;
