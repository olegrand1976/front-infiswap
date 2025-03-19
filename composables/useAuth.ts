import { useRouter, useState, useCookie, useNuxtApp } from '#app';
import { AUTH_TOKEN } from '~/lib/constants';
import type { User } from '~/lib/types';

export const useUser = () => {
    return useState<User | undefined>('user', () => undefined);
};

export const useAuth = () => {
    const router = useRouter();
    const { $apifetch, $fetchCurrentUser, $toast } = useNuxtApp();
    const user = useUser();
    const isLoggedIn = computed(() => !!user.value);

    async function refresh() {
        try {
            user.value = await $fetchCurrentUser();
        }
        catch {
            user.value = null;
        }
    }

    async function login(credentials: { inami: string; password: string }) {
        if (isLoggedIn.value) return;

        await $apifetch('api/login', { method: 'post', body: credentials })
            .then(response => useCookie(AUTH_TOKEN, { maxAge: 7776000 }).value = response.token);

        await refresh();
    }

    // async function register(credentials) {
    //     await $apifetch('/api/register', { method: 'post', body: credentials })
    //         .then(response => useCookie(AUTH_TOKEN).value = response.token);
    //     await refresh();
    // }

    async function register(credentials) {
        return $apifetch('/api/register', { method: 'post', body: credentials })
            .then((response) => {
                useCookie(AUTH_TOKEN).value = response.token;
                return refresh();
            })
            .catch((error) => { throw error; });
    }

    async function registerBeta(credentials) {
        await $apifetch('/api/user-betas',
            { method: 'post', body: credentials },
        );
    }

    async function resendEmailVerification() {
        return await $apifetch('/api/email/verification-notification', {
            method: 'post',
        }).then(() => {
            $toast({
                description: 'E-mail envoyé avec succès.',
            });
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
