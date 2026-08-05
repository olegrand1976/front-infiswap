<template>
    <div>
        <div class="hidden lg:flex flex-row justify-center h-auto min-h-screen">
            <div class="bg-muted hidden lg:flex flex-col items-center lg:w-[115vw] relative overflow-hidden container">
                <div class="absolute right-[14%] top-[16%] size-16 rounded-lg bg-primary/20" />
                <div class="absolute bottom-[26%] left-[12%] size-9 rounded-full bg-primary/20" />

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute left-1/2 top-1/2 flex size-23 -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-xl bg-white shadow-lg">
                    <KeyRound class="size-10 text-primary" />
                </div>

                <div class="absolute z-10 h-14 w-full bg-primary bottom-0 left-0" />
            </div>

            <div class="bg-white container w-full flex flex-col justify-center items-center relative">
                <BackButton :to="localePath('/login')" />
                <div class="shrink-0 mb-4">
                    <LayoutsLogo class="w-64" />
                </div>

                <div class="w-full max-w-md container">
                    <template v-if="!showSuccess">
                        <div class="mb-5 text-center">
                            <div class="mx-auto mb-4 flex size-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                                <KeyRound class="size-5" />
                            </div>
                            <h1 class="font-secondary text-2xl font-semibold text-dark">
                                {{ $t('auth.newPasswordTitle') }}
                            </h1>
                            <p class="mt-2 text-sm text-gray-500">
                                {{ $t('auth.newPasswordHint') }}
                            </p>
                        </div>

                        <form
                            class="flex flex-col gap-4"
                            @submit.prevent="resetPassword"
                        >
                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-medium text-gray-700">
                                    {{ $t('auth.newPasswordLabel') }}
                                </label>
                                <InputIcon
                                    v-model="formData.password"
                                    :icon="Lock"
                                    type="password"
                                    rounded="md"
                                    :placeholder="$t('auth.password')"
                                    class="text-sm w-full"
                                />
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-medium text-gray-700">
                                    {{ $t('auth.confirmNewPassword') }}
                                </label>
                                <InputIcon
                                    v-model="formData.passwordConfirm"
                                    :icon="Lock"
                                    type="password"
                                    rounded="md"
                                    :placeholder="$t('auth.passwordConfirmPlaceholder')"
                                    class="text-sm w-full"
                                />
                            </div>

                            <div class="flex flex-wrap gap-x-3.5 gap-y-1.5 -mt-1">
                                <span
                                    v-for="req in passwordRequirements"
                                    :key="req.key"
                                    class="flex items-center gap-1 text-[11.5px]"
                                    :class="req.met ? 'text-success' : 'text-gray-400'"
                                >
                                    <Check
                                        v-if="req.met"
                                        class="size-3"
                                    />
                                    <span
                                        v-else
                                        class="size-3 rounded-full border border-gray-300"
                                    />
                                    {{ req.label }}
                                </span>
                            </div>

                            <Button
                                type="submit"
                                class="mt-2 w-full font-bold"
                            >
                                {{ $t('common.save') }}
                            </Button>
                        </form>
                    </template>

                    <div
                        v-else
                        class="text-center py-2"
                    >
                        <div class="mx-auto mb-4 flex size-15 items-center justify-center rounded-xl bg-success/10">
                            <ShieldCheck class="size-7 text-success" />
                        </div>
                        <h1 class="font-secondary text-xl font-semibold text-dark mb-2">
                            {{ $t('auth.passwordSaved') }}
                        </h1>
                        <p class="text-sm text-gray-500 mb-6">
                            {{ $t('auth.newPasswordSuccessHint') }}
                        </p>
                        <Button
                            class="w-full max-w-64 mx-auto font-bold"
                            @click="navigateTo(localePath('/login'))"
                        >
                            {{ $t('auth.backToLogin') }}
                            <ArrowRight class="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <div class="lg:hidden min-h-screen w-screen flex flex-col justify-between relative overflow-hidden">
            <LayoutsHeaderMobile />

            <BackButton :to="localePath('/login')" />

            <div class="flex flex-col justify-center items-center px-6 grow py-12">
                <template v-if="!showSuccess">
                    <div class="mb-6 text-center">
                        <div class="mx-auto mb-3 flex size-10 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                            <KeyRound class="size-4.5" />
                        </div>
                        <h1 class="font-secondary text-xl font-semibold text-dark">
                            {{ $t('auth.newPasswordTitle') }}
                        </h1>
                        <p class="mt-1.5 text-xs text-gray-500 px-4">
                            {{ $t('auth.newPasswordHint') }}
                        </p>
                    </div>

                    <form
                        class="flex flex-col gap-4 w-full max-w-sm"
                        @submit.prevent="resetPassword"
                    >
                        <div class="flex flex-col gap-1.5">
                            <label class="text-sm font-medium text-gray-700">
                                {{ $t('auth.newPasswordLabel') }}
                            </label>
                            <InputIcon
                                v-model="formData.password"
                                :icon="Lock"
                                type="password"
                                rounded="md"
                                :placeholder="$t('auth.password')"
                                class="text-sm w-full"
                            />
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-sm font-medium text-gray-700">
                                {{ $t('auth.confirmNewPassword') }}
                            </label>
                            <InputIcon
                                v-model="formData.passwordConfirm"
                                :icon="Lock"
                                type="password"
                                rounded="md"
                                :placeholder="$t('auth.passwordConfirmPlaceholder')"
                                class="text-sm w-full"
                            />
                        </div>

                        <div class="flex flex-wrap gap-x-3.5 gap-y-1.5 -mt-1">
                            <span
                                v-for="req in passwordRequirements"
                                :key="req.key"
                                class="flex items-center gap-1 text-[11.5px]"
                                :class="req.met ? 'text-success' : 'text-gray-400'"
                            >
                                <Check
                                    v-if="req.met"
                                    class="size-3"
                                />
                                <span
                                    v-else
                                    class="size-3 rounded-full border border-gray-300"
                                />
                                {{ req.label }}
                            </span>
                        </div>

                        <Button
                            type="submit"
                            class="mt-2 w-full font-bold"
                        >
                            {{ $t('common.save') }}
                        </Button>
                    </form>
                </template>

                <div
                    v-else
                    class="text-center w-full max-w-sm"
                >
                    <div class="mx-auto mb-4 flex size-15 items-center justify-center rounded-xl bg-success/10">
                        <ShieldCheck class="size-7 text-success" />
                    </div>
                    <h1 class="font-secondary text-xl font-semibold text-dark mb-2">
                        {{ $t('auth.passwordSaved') }}
                    </h1>
                    <p class="text-sm text-gray-500 mb-6">
                        {{ $t('auth.newPasswordSuccessHint') }}
                    </p>
                    <Button
                        class="w-full font-bold"
                        @click="navigateTo(localePath('/login'))"
                    >
                        {{ $t('auth.backToLogin') }}
                        <ArrowRight class="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ArrowRight, Check, KeyRound, Lock, ShieldCheck } from 'lucide-vue-next';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, ref } from 'vue';
import { getErrorMessage } from '~/lib/utils';
import BackButton from '~/components/ui/back-button/BackButton.vue';

const { t } = useI18n();
const localePath = useLocalePath();
const { $toast } = useNuxtApp();

definePageMeta({
    layout: 'auth',
});

useHead({
    title: t('auth.newPasswordPageTitle'),
});

const formData = ref({
    email: '',
    password: '',
    passwordConfirm: '',
    token: '',
});

const showSuccess = ref(false);

const passwordRequirements = computed(() => [
    { key: 'length', label: t('auth.requirementLength'), met: formData.value.password.length >= 8 },
    { key: 'uppercase', label: t('auth.requirementUppercase'), met: /[A-Z]/.test(formData.value.password) },
    { key: 'digit', label: t('auth.requirementDigit'), met: /\d/.test(formData.value.password) },
    {
        key: 'match',
        label: t('auth.requirementMatch'),
        met: formData.value.password.length > 0 && formData.value.password === formData.value.passwordConfirm,
    },
]);

// Méthode pour récupérer les paramètres de l'URL
const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    formData.value.email = urlParams.get('email');
    formData.value.token = urlParams.get('token');
};

const { $apifetch } = useNuxtApp();

const resetPassword = async () => {
    getUrlParams();
    if (formData.value.password !== formData.value.passwordConfirm) {
        $toast({
            title: t('auth.oopsError'),
            description: t('auth.passwordMismatch'),
            variant: 'destructive',
        });
    }

    const data = {
        email: formData.value.email,
        password: formData.value.password,
        password_confirmation: formData.value.passwordConfirm,
        token: formData.value.token,
    };

    try {
        const response = await $apifetch('api/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response && response.data && response.data.success) {
            showSuccess.value = true;
        }
        else {
            showSuccess.value = true;
        }
    }
    catch (error: any) {
        console.error('Erreur lors de l\'envoi des données :', error);
        $toast({
            title: t('auth.oopsError'),
            description: getErrorMessage(error),
            variant: 'destructive',
        });
    }
};
</script>
