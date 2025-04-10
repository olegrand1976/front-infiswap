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
    const loading = useState<boolean>('loading', () => false);

    async function refresh() {
        try {
            user.value = await $fetchCurrentUser();
        }
        catch {
            user.value = null;
        }
    }

    async function login(credentials: { identifier: string; password: string }) {
        if (isLoggedIn.value) return;

        await $apifetch('api/login', { method: 'post', body: credentials })
            .then(response => useCookie(AUTH_TOKEN, { maxAge: 7776000 }).value = response.token);

        navigateTo('/dashboard');
        await refresh();
    }

    async function register(credentials) {
        return $apifetch('/api/register', { method: 'post', body: credentials })
            .then((response) => {
                useCookie(AUTH_TOKEN).value = response.token;
            })
            .then(() => {
                $toast({
                    description: 'Inscription réussie',
                });
            })
            .then(() => {
                setTimeout(() => {
                    // router.push('use-choice');
                    router.push('legal-chart');
                }, 2000);
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

    async function updateUser(formData) {
        return await $apifetch(`/api/users/${formData.id}/update-information`, {
            method: 'put',
            body: formData,
        });
    };

    async function updateAddressUser(formData) {
        return await $apifetch(`/api/users/${user.value.id}/update-address`, {
            method: 'put',
            body: formData,
        });
    };

    async function updatePasswordUser(formData) {
        return await $apifetch(`/api/users/${user.value.id}/update-password`, {
            method: 'put',
            body: formData,
        });
    };

    async function updateAvatarUser(formData) {
        return await $apifetch(`/api/users/${user.value.id}/update-profil`, {
            method: 'post',
            body: formData,
        });
    };

    async function activeTwoFactorAuth(formData) {
        return await $apifetch(`/api/users/2fa/toggle`, {
            method: 'post',
            body: formData,
        });
    };

    async function verifyCode(formData) {
        return await $apifetch(`/api/users/2fa/verify`, {
            method: 'post',
            body: formData,
        });
    };

    async function updateStatusAccount(formData) {
        return await $apifetch(`/api/users/${user.value.id}/update-status`, {
            method: 'put',
            body: formData,
        });
    };

    async function deleteAccount(formData) {
        return await $apifetch(`/api/users/${user.value.id}/soft-delete`, {
            method: 'delete',
            body: formData,
        });
    };

    async function logout() {
        loading.value = false;
        try {
            if (!isLoggedIn.value) return;
            await $apifetch('api/logout', { method: 'post' });
            user.value = null;
            useCookie(AUTH_TOKEN).value = '';

            router.push('/');
        }
        catch {
            $toast({
                variant: 'destructive',
                description: 'Erreur lors de la déconnexion.',
            });
        }
        finally {
            loading.value = false;
        }
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
        updateUser,
        updateAddressUser,
        updatePasswordUser,
        updateAvatarUser,
        verifyCode,
        activeTwoFactorAuth,
        updateStatusAccount,
        logout,
        deleteAccount,
        forgotPassword,
        resetPassword,
        refresh,
    };
};
