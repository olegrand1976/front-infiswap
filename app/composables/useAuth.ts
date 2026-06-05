/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from 'vue-sonner';
import { useRouter, useState, useCookie, useNuxtApp } from '#app';
import { AUTH_TOKEN } from '~/lib/constants';
import type { AccountType, Address, Pagination, User } from '~/lib/types';

export const useUser = () => {
    return useState<User | undefined>('user', () => undefined);
};

export const useAuth = () => {
    const router = useRouter();
    const { $apifetch, $fetchCurrentUser } = useNuxtApp();
    const user = useUser();
    const users = useState<Pagination<User> | null>('users', () => null);
    const count = useState<number>('userCount', () => 0);
    const isLoggedIn = computed(() => !!user.value && !!user.value.email_verified_at);

    const hasAccountType = (types: string[]) => computed(() => types.includes(user.value?.account_type ?? ''));

    const isSuperAdmin = hasAccountType(['administrator']);
    const isAdmin = hasAccountType(['administrator', 'developer']);
    const isDeveloper = hasAccountType(['developer']);
    const isManager = hasAccountType(['manager']);
    const isCommunityManager = hasAccountType(['community_manager']);
    const isSaleRepresentative = hasAccountType(['sale_representative']);
    const isMedical = hasAccountType(['nurse', 'caregiver', 'midwife', 'collaborator']);
    const isInstitution = computed((): boolean => {
        return user.value?.type === 'institution';
    });
    const isInstitutionAdmin = computed(() => {
        if (!isInstitution.value || !user.value) return false;
        return (user.value.institution_roles || []).some(p => p.role_name === 'administrator');
    });
    const isInstitutionManager = computed(() => {
        if (!isInstitution.value || !user.value) return false;
        return (user.value.institution_roles || []).some(p => p.role_name === 'manager');
    });
    const canCreateInstitution = computed(() => {
        if (!isLoggedIn.value || !user.value || user.value.institution_id) return false;
        return isMedical.value;
    });

    const isCollaborator = computed((): boolean => {
        return ['collaborator'].includes(user.value?.account_type ?? '');
    });
    const isNurse = hasAccountType(['nurse', 'caregiver', 'midwife']);
    const isTester = hasAccountType(['tester']);

    const isAdminGroup = (groupId: number): boolean => {
        const pivotArray = toRaw(user.value.group_roles);

        if (Array.isArray(pivotArray)) {
            const matchingPivot = pivotArray.find(p => p.group_id === groupId);
            if (matchingPivot) {
                return matchingPivot.role_id === 1;
            }
        }

        return false;
    };

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

        if (!user.value && useCookie(AUTH_TOKEN).value) {
            useCookie(AUTH_TOKEN).value = null;
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
                toast.success('Inscription réussie');
            })
            .then(() => {
                const email = credentials.email || '';
                setTimeout(() => {
                    router.push({
                        path: '/auth/registration-success',
                        query: { email },
                    });
                }, 1500);
                return refresh();
            })
            .catch((error) => { throw error; });
    }

    async function validateEmail(id: string, hash: string) {
        loading.value = true;

        try {
            await $apifetch(`/api/email/verify/${id}/${hash}`, {
                method: 'POST',
            });

            toast.success('Compte validé avec succès.');

            return true;
        }
        catch (err) {
            toast.error('Une erreur s\'est produite lors de la validation de votre compte. Merci de réessayer plus tard.');

            throw new Error(err);
        }
        finally {
            loading.value = false;
        }
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
                toast.success('Inscription rapide réussie');
            })
            .catch((error) => { throw error; });
    }

    async function resendEmailVerification(email: string) {
        return await $apifetch('/api/email/verification-notification', {
            method: 'post',
            body: { email: email },
        }).then(() => {
            toast.success('E-mail envoyé avec succès.');
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

    async function softDelete(userId) {
        return await $apifetch(`/api/users/delete/${userId}`, {
            method: 'delete',
        });
    };

    async function deleteAvatar(id) {
        return await $apifetch(`/api/users/${user.value.id}/delete-profil`, {
            method: 'delete',
            body: id,
        });
    }

    function logout() {
        loading.value = false;
        try {
            if (!isLoggedIn.value) return;
            $apifetch('api/logout', { method: 'post' });
            user.value = null;
            useCookie(AUTH_TOKEN).value = '';

            router.push('/');
        }
        catch {
            toast.error('Erreur lors de la déconnexion.');
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

    async function getRecentUsers(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/admin/users/registration', {
            params: {
                page: page,
                perPage: perPage,
                ...options,
            },
        }).then((response) => {
            users.value = response;
        });
    }

    async function getCrmPlus(page = 1, perPage = 15, options = {}) {
        return await $apifetch('api/crm', {
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
            toast.success('Suppression réussie.');
        })
            .catch(() => {
                toast.error('Une erreur est survenue lors de la suppression.');
            });
    }

    async function validate(user: number) {
        try {
            const response = await $apifetch(`/api/users/${user}/validate`, {
                method: 'PUT',
            });

            toast.success('Validation réussie.');

            return response.user;
        }
        catch {
            toast.error('Une erreur est survenue lors de la validation.');
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
            toast.success('Succès');
        }).catch(() => {
            toast.error('Une erreur est survenue lors de l\'enregistrement');
        });
    };

    const updateRadiusKm = async (newRadius: number) => {
        const currentSettings = JSON.parse(user.value.settings || '{}');

        currentSettings.replacement = currentSettings.replacement || {};
        currentSettings.replacement.radius_km = newRadius;

        const formData = {
            key: 'radius_km',
            value: JSON.stringify(newRadius),
        };

        try {
            await createPreferences(formData);
            user.value.settings = JSON.stringify(currentSettings);
            toast.success('Rayon de recherche mis à jour avec succès');
        }
        catch (error) {
            toast.error('Erreur lors de la mise à jour du rayon de recherche');
        }
    };

    async function createNotifPreferences(formData) {
        return await $apifetch(`/api/users/settings/notification`, {
            method: 'post',
            body: formData,
        });
    };

    async function updateField(id: number, options = {}) {
        return await $apifetch(`/api/users/${id}/update-user-field`, {
            method: 'PUT',
            body: { ...options },
        });
    };

    async function fetchUserFromNurseId(nurseId: number): Promise<User | null> {
        try {
            const nurse = await $apifetch(`/api/nurses/${nurseId}`);
            const userId = nurse?.user?.id;
            if (!userId) return null;

            const user = await $apifetch(`/api/users/${userId}`);
            return user as User;
        }
        catch (error) {
            console.error('Erreur fetchUserFromNurseId:', error);
            return null;
        }
    }

    async function updateContact(id: number, payload: { contact_date: string; contact_method: string }) {
        return await $apifetch(`/api/users/${id}/contact`, {
            method: 'PUT',
            body: payload,
        });
    }

    async function restore(id: number) {
        return await $apifetch(`/api/admin/users/${id}/restore`, {
            method: 'PUT',
        });
    }

    async function switchView(type: 'standard' | 'institution') {
        return await $apifetch('/api/users/switch-view', {
            method: 'PUT',
            body: { type },
        }).then(async () => {
            await refresh();
            router.push(type === 'institution' ? '/dashboard/institution' : '/dashboard');
        });
    }

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
        getCrmPlus,
        isLoggedIn,
        isSuperAdmin,
        isAdmin,
        isInstitution,
        isInstitutionAdmin,
        isInstitutionManager,
        canCreateInstitution,
        isCommunityManager,
        isSaleRepresentative,
        isCollaborator,
        isDeveloper,
        isManager,
        isMedical,
        isNurse,
        isTester,
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
        softDelete,
        forgotPassword,
        resetPassword,
        refresh,
        generatePassword,
        getRoles,
        switchRole,
        edit,
        createPreferences,
        createNotifPreferences,
        updateField,
        fetchUserFromNurseId,
        updateContact,
        updateRadiusKm,
        isAdminGroup,
        getRecentUsers,
        validateEmail,
        restore,
        loading,
        switchView,
    };
};
