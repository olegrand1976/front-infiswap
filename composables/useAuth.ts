import { useRouter, useState, useCookie, useNuxtApp } from '#app';
import { AUTH_TOKEN } from '~/lib/constants';

export const useUser = () => {
    return useState('user', () => undefined);
};

export const useAuth = () => {
    const router = useRouter();
    const { $apifetch, $fetchCurrentUser } = useNuxtApp();
    const user = useUser();
    const isLoggedIn = computed(() => !!user.value);

    async function refresh() {
        try {
            user.value = await $fetchCurrentUser;
        }
        catch {
            user.value = null;
        }
    }

    async function login(credentials) {
        if (isLoggedIn.value) return;

        await $apifetch('api/login', { method: 'post', body: credentials })
            .then(response => useCookie(AUTH_TOKEN, { maxAge: 704800 }).value = response.token);

        await refresh();
    }

    async function register(credentials) {
        await $apifetch('/api/register', { method: 'post', body: credentials })
            .then(response => useCookie(AUTH_TOKEN).value = response.token);
        await refresh();
    }

    async function registerBeta(credentials) {
        await $apifetch('/api/user-betas',
            { method: 'post', body: credentials },
        );
    }

    async function resendEmailVerification() {
        return await $apifetch('/api/email/verification-notification', {
            method: 'post',
        });
    }

    async function logout() {
        if (!isLoggedIn.value) return;

        await $apifetch('api/logout', { method: 'post' });
        user.value = null;
        useCookie(AUTH_TOKEN).value = '';

        await router.push('/');
    }

    async function forgotPassword(email: string) {
        return await $apifetch('api/forgot-password', {
            method: 'post',
            body: { email },
        });
    }

    async function resetPassword(credentials: Record<string, unknown>) {
        return await $apifetch('api/reset-password', {
            method: 'post',
            body: credentials,
        });
    }

    return {
        user,
        isLoggedIn,
        login,
        register,
        registerBeta,
        resendEmailVerification,
        logout,
        forgotPassword,
        resetPassword,
        refresh,
    };
};
