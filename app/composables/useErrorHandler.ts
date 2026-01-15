import { useError, clearError } from '#app';

export const useErrorHandler = () => {
    const error = useError();

    const clearAuthErrors = () => {
        if (error.value && (error.value.statusCode === 401 || error.value.statusCode === 403)) {
            const route = useRoute();
            const publicRoutes = ['/', '/login', '/register', '/about', '/contact'];
            if (publicRoutes.includes(route.path)) {
                clearError();
                return true;
            }
        }
        return false;
    };

    return {
        clearAuthErrors,
    };
};
