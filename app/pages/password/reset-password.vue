<template>
    <div class="min-h-screen">
        <div class="hidden lg:flex flex-row justify-center h-auto min-h-screen">
            <div class="hidden lg:flex bg-muted flex-col items-center lg:w-[115vw] relative overflow-hidden container">
                <div class="absolute right-[14%] top-[16%] size-16 rounded-lg bg-primary/20" />
                <div class="absolute bottom-[26%] left-[12%] size-9 rounded-full bg-primary/20" />

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute left-1/2 top-1/2 flex size-50 -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-xl bg-white shadow-lg">
                    <ShieldCheck class="size-30 text-primary" />
                </div>

                <div class="absolute z-10 h-14 w-full bg-primary bottom-0 left-0" />
            </div>

            <div class="hidden lg:flex bg-white container w-full flex-col justify-center items-center relative">
                <BackButton :to="localePath('/login')" />
                <div class="shrink-0 mb-4">
                    <LayoutsLogo class="w-64" />
                </div>

                <div class="w-full max-w-md container">
                    <div class="mb-5 text-center">
                        <div class="mx-auto mb-4 flex size-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                            <ShieldCheck class="size-5" />
                        </div>
                        <h1 class="font-secondary text-2xl font-semibold text-dark">
                            {{ $t('auth.resetPasswordTitle') }}
                        </h1>
                        <p class="mt-2 text-sm text-gray-500">
                            {{ $t('auth.resetPasswordHint') }}
                        </p>
                    </div>

                    <form
                        v-if="!showSuccess"
                        @submit.prevent="submitForm"
                    >
                        <div class="flex flex-col gap-1.5">
                            <label class="text-sm font-medium text-gray-700">
                                {{ $t('auth.yourEmail') }}
                            </label>
                            <InputIcon
                                v-model="email"
                                type="email"
                                rounded="md"
                                :placeholder="$t('auth.yourEmailPlaceholder')"
                                :icon="Mail"
                            />
                        </div>

                        <Button
                            type="submit"
                            class="mt-6 w-full font-bold"
                            :in-progress="isSubmitting"
                        >
                            {{ $t('auth.resetSubmit') }}
                        </Button>

                        <div class="mt-4 flex gap-2 rounded-md border border-gray-200 bg-gray-50 px-3.5 py-3 text-xs text-gray-500">
                            <Info class="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                            <span>{{ $t('auth.resetHelper') }}</span>
                        </div>
                    </form>

                    <div
                        v-else
                        class="flex gap-2.5 rounded-md border border-success/30 bg-success/10 px-4 py-3.5"
                    >
                        <MailCheck class="mt-0.5 size-4.5 shrink-0 text-success" />
                        <div>
                            <div class="text-sm font-semibold text-dark">
                                {{ $t('auth.resetSuccessTitle') }}
                            </div>
                            <div class="mt-0.5 text-xs text-gray-500">
                                {{ $t('auth.resetSuccessDetail') }}
                            </div>
                        </div>
                    </div>

                    <p class="mt-5 text-center text-xs text-gray-500">
                        {{ $t('auth.rememberPassword') }}
                        <NuxtLink
                            :to="localePath('/login')"
                            class="font-bold text-primary underline"
                        >
                            {{ $t('auth.backToLogin') }}
                        </NuxtLink>
                    </p>
                </div>
            </div>
        </div>

        <div class="lg:hidden min-h-screen w-full flex flex-col justify-between relative overflow-y-auto">
            <LayoutsHeaderMobile />
            <BackButton :to="localePath('/login')" />

            <div class="flex flex-col justify-center items-center px-6 grow py-12">
                <div class="mb-6 text-center">
                    <div class="mx-auto mb-3 flex size-10 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                        <ShieldCheck class="size-4.5" />
                    </div>
                    <h1 class="font-secondary text-xl font-semibold text-dark">
                        {{ $t('auth.resetPasswordTitle') }}
                    </h1>
                    <p class="mt-1.5 text-xs text-gray-500 px-4">
                        {{ $t('auth.resetPasswordHint') }}
                    </p>
                </div>

                <div class="w-full max-w-sm">
                    <Form v-if="!showSuccess">
                        <form
                            class="flex flex-col"
                            @submit.prevent="submitForm"
                        >
                            <FormField name="email">
                                <FormItem>
                                    <FormLabel class="text-sm font-medium text-gray-700 mb-1.5 block">
                                        {{ $t('auth.yourEmail') }}
                                    </FormLabel>
                                    <FormControl>
                                        <InputIcon
                                            v-model="email"
                                            type="email"
                                            rounded="md"
                                            :placeholder="$t('auth.yourEmailPlaceholder')"
                                            :icon="Mail"
                                        />
                                    </FormControl>
                                </FormItem>
                            </FormField>

                            <Button
                                type="submit"
                                class="mt-6 w-full font-bold"
                                :in-progress="isSubmitting"
                            >
                                {{ $t('auth.resetSubmit') }}
                            </Button>

                            <div class="mt-4 flex gap-2 rounded-md border border-gray-200 bg-gray-50 px-3.5 py-3 text-xs text-gray-500">
                                <Info class="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                                <span>{{ $t('auth.resetHelper') }}</span>
                            </div>
                        </form>
                    </Form>

                    <div
                        v-else
                        class="flex gap-2.5 rounded-md border border-success/30 bg-success/10 px-4 py-3.5"
                    >
                        <MailCheck class="mt-0.5 size-4.5 shrink-0 text-success" />
                        <div>
                            <div class="text-sm font-semibold text-dark">
                                {{ $t('auth.resetSuccessTitle') }}
                            </div>
                            <div class="mt-0.5 text-xs text-gray-500">
                                {{ $t('auth.resetSuccessDetail') }}
                            </div>
                        </div>
                    </div>

                    <p class="mt-5 text-center text-xs text-gray-500">
                        {{ $t('auth.rememberPassword') }}
                        <NuxtLink
                            :to="localePath('/login')"
                            class="font-bold text-primary underline"
                        >
                            {{ $t('auth.backToLogin') }}
                        </NuxtLink>
                    </p>
                </div>
            </div>

            <div class="bg-primary text-primary h-10 w-full mt-auto" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Info, Mail, MailCheck, ShieldCheck } from 'lucide-vue-next';
import { ref } from 'vue';
import { getErrorMessage } from '~/lib/utils';
import { shouldShowPasswordResetSuccess } from '~/utils/passwordReset';
import BackButton from '~/components/ui/back-button/BackButton.vue';
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const { t } = useI18n();
const localePath = useLocalePath();
const { $toast } = useNuxtApp();
definePageMeta({
    layout: 'auth',
});

useHead({
    title: t('auth.resetPageTitle'),
});

const email = ref('');
const showSuccess = ref(false);
const isSubmitting = ref(false);

const { forgotPassword } = useAuth();

const submitForm = async (event: Event) => {
    event.preventDefault();

    if (isSubmitting.value) {
        return;
    }

    if (!email.value) {
        $toast({
            description: t('auth.resetEmailRequired'),
            variant: 'destructive',
        });
        return;
    }

    isSubmitting.value = true;
    try {
        const result = await forgotPassword(email.value);
        if (!shouldShowPasswordResetSuccess(result)) {
            throw new Error(t('auth.oopsError'));
        }
        showSuccess.value = true;
    }
    catch (error) {
        $toast({
            title: t('auth.oopsError'),
            description: getErrorMessage(error),
            variant: 'destructive',
        });
    }
    finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
html, body {
  height: 100%;
  overflow-x: hidden;
}
</style>
