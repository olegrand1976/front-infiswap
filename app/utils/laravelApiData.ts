export function unwrapLaravelData<T>(response: T | { data: T }): T {
    if (response !== null && typeof response === 'object' && 'data' in response) {
        const wrapped = response as { data: T };
        if (wrapped.data !== undefined && wrapped.data !== null) {
            return wrapped.data;
        }
    }

    return response as T;
}
