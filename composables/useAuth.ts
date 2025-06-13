import { useRouter, useState, useCookie, useNuxtApp } from '#app';
import { AUTH_TOKEN } from '~/lib/constants';
import type { AccountType, Address, Pagination, User } from '~/lib/types';

export const useUser = () => {
    return useState<User | undefined>('user', () => undefined);
};

export const useAuth = () => {
    const router = useRouter();
    const { $apifetch, $fetchCurrentUser, $toast } = useNuxtApp();
    const user = useUser();
    const users = useState<Pagination<User> | null>('users', () => null);
    const count = useState<number>('userCount', () => 0);
    const isLoggedIn = computed(() => !!user.value && !!user.value.email_verified_at);

    const isAdmin = computed((): boolean => {
        return ['administrator', 'developer'].includes(user.value?.account_type ?? '');
    });

    const hasChangedAvatar = computed(() => {
        return user.value?.profile?.profil_url;
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
                await nextTick();
                await refresh();
                return;
            }

            if (response.hash) {
                localStorage.setItem('credentials', JSON.stringify(credentials));
                useCookie('2fa_hash').value = response.hash;
                return;
            }
            throw createError({
                statusMessage: 'Identifiant ou mot de passe incorrect',
            });
        }
        catch (error) {
            throw createError({
                statusCode: error.statusCode,
                statusMessage: error.data?.message || 'Une erreur est survenue.',
            });
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

    async function registerImmediate(credentials) {
        return $apifetch('/api/register-immediate', { method: 'post', body: credentials })
            .then((response) => {
                useCookie(AUTH_TOKEN).value = response.token;
            })
            .then(() => {
                $toast({
                    description: 'Inscription rapide réussie',
                });
            })
            .catch((error) => { throw error; });
    }

    async function resendEmailVerification(email: string) {
        return await $apifetch('/api/email/verification-notification', {
            method: 'post',
            body: { email: email },
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
        const response = await $apifetch(`/api/users/${user.value.id}/update-profil`, {
            method: 'post',
            body: formData,
        });

        return response;
    }

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
        const response = await $apifetch(`/api/verify-2fa`, {
            method: 'post',
            body: formData,
        });

        useCookie(AUTH_TOKEN).value = response.token;
        await nextTick();
        await refresh();
        return navigateTo('/dashboard');
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

    async function getUsers(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/users', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            users.value = response.users;
            count.value = response.count;
        });
    }

    type UserForm = {
        lastname: string;
        firstname: string;
        identifierNumber: string;
        email: string;
        gender: string;
        group: number;
        phoneNumber: string;
        dateOfBirth: string | null;
        language: 'fr' | 'en' | string;
        roles: AccountType[];
        address: Address;
    };

    async function create(form: UserForm) {
        const response = await $apifetch('api/users', {
            method: 'POST',
            body: form,
        });

        return response.user;
    }

    async function show(id: number) {
        return await $apifetch(`/api/users/${id}`);
    }

    async function update(id: number, form: UserForm) {
        const response = await $apifetch(`/api/users/${id}`, {
            method: 'PUT',
            body: form,
        });

        return response.user;
    }

    async function forceDelete(user: number) {
        await $apifetch(`/api/users/${user}`, {
            method: 'DELETE',
        }).then(() => {
            $toast({
                description: 'Suppression réussie.',
            });
        })
            .catch(() => {
                $toast({
                    variant: 'destructive',
                    description: 'Une erreur est survenue lors de la suppression.',
                });
            });
    }

    async function validate(user: number) {
        try {
            const response = await $apifetch(`/api/users/${user}/validate`, {
                method: 'PUT',
            });

            $toast({
                description: 'Validation réussie.',
            });

            return response.user;
        }
        catch {
            $toast({
                variant: 'destructive',
                description: 'Une erreur est survenue lors de la validation.',
            });
        }
    }

    function generatePassword(length: number = 12): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
        const charsLength = chars.length;
        const array = crypto.getRandomValues(new Uint32Array(length));

        return Array.from(array, n => chars[n % charsLength]).join('');
    }

    async function getRoles() {
        return await $apifetch('/api/user/roles');
    };

    async function switchRole(role: string) {
        return await $apifetch('/api/user/switch-role', {
            method: 'PUT',
            body: { role: role },
        }).then(async () => {
            await refresh();
            router.push('/dashboard');
        });
    }

    async function edit(id: number, options = {}) {
        return await $apifetch(`/api/users/${id}/activate`, {
            method: 'PUT',
            body: { ...options },
        });
    }

    const createPreferences = async (formData) => {
        await $apifetch('/api/users/settings', { method: 'POST', body: formData }).then(() => {
            $toast({
                description: 'Succès',
            });
        }).catch(() => {
            $toast({
                variant: 'destructive',
                description: 'Une erreur est survenue lors de l\'enregistrement',
            });
        });
    };

    async function createNotifPreferences(formData) {
        return await $apifetch(`/api/users/settings/notification`, {
            method: 'post',
            body: formData,
        });
    };

    return {
        user,
        users,
        count,
        hasChangedAvatar,
        create,
        update,
        show,
        validate,
        forceDelete,
        getUsers,
        isLoggedIn,
        isAdmin,
        login,
        register,
        registerBeta,
        registerImmediate,
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
        generatePassword,
        getRoles,
        switchRole,
        edit,
        createPreferences,
        createNotifPreferences,
    };
};
