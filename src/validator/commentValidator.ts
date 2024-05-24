export const isUUID = (value: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
};

export const isNotBlank = (value: string): boolean => {
    return value.trim().length > 0;
};

export const validateArticleId = (value: string): boolean => {
    return isUUID(value) && isNotBlank(value);
};