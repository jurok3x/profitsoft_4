export interface HttpError extends Error {
    httpStatus: number,
    timestamp: Date,
    errors: string[],
}