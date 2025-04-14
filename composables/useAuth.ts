import { useRouter, useState, useCookie, useNuxtApp } from '#app';
import { AUTH_TOKEN } from '~/lib/constants';
import type { Pagination, User } from '~/lib/types';

export const useUser = () => {
    return useState<User | undefined>('user', () => undefined);
};

export const useAuth = () => {
    const router = useRouter();
    const { $apifetch, $fetchCurrentUser, $toast } = useNuxtApp();
    const user = useUser();
    const users = useState<Pagination<User> | null>('users', () => null);
    const isLoggedIn = computed(() => !!user.value);
    const isAdmin = computed(() => {
        return user.value?.roles?.some(role => ['admin', 'dev'].includes(role.name)) ?? false;
    });

    const isManager = computed(() => {
        return user.value.roles.some(role => ['test_manager', 'sale_manager'].includes(role.name));
    });

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
    
        try {
            const response = await $apifetch('api/login', {
                method: 'post',
                body: credentials,
            });
    
            if (response.token) {
                useCookie(AUTH_TOKEN, { maxAge: 7776000 }).value = response.token;
                return await refresh();
            }
    
            if (response.hash && response.two_factor_code) {
                useCookie('2fa_hash').value = response.hash;
                return {
                    message: response.message,
                    code: response.two_factor_code,
                };
            };
        } catch (error: any) {
            return {
                status: 'error',
                message: error.data?.message ?? 'Une erreur est survenue.',
            };
        }
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

    async function verify2fa(formData) {
        return await $apifetch(`/api/verify-2fa`, {
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

    async function deleteAvatar(id) {
        return await $apifetch(`/api/users/${user.value.id}/delete-profil`, {
            method: 'delete',
            body: id,
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

    async function getUsers(page = 1, perPage = 2) {
        return await $apifetch('api/admin/users', {
            params: {
                page: page,
                perPage: perPage,
            },
        }).then((response) => {
            users.value = response.users;
        });
    }

    return {
        user,
        users,
        getUsers,
        isLoggedIn,
        isAdmin,
        isManager,
        login,
        register,
        registerBeta,
        resendEmailVerification,
        updateUser,
        updateAddressUser,
        updatePasswordUser,
        updateAvatarUser,
        verifyCode,
        verify2fa,
        activeTwoFactorAuth,
        updateStatusAccount,
        deleteAvatar,
        logout,
        deleteAccount,
        forgotPassword,
        resetPassword,
        refresh,
    };
};
