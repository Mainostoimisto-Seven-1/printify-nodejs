export const BASE_URL = "https://api.printify.com/" as const;
export const VERSIONS = ["v1"] as const;
export type VERSION = (typeof VERSIONS)[number];
