<template>
    <div>
        <div class="hidden sm:flex flex-row justify-center md:h-auto xl:pt-0 sm:pt-48">
            <div class="bg-tertiary/30 xl:h-screen lg:h-auto lg:block w-[115vw] hidden relative container">
                <div class="xl:absolute z-20 bottom-0 left-1/3">
                    <LayoutsAppImage
                        src="/auth/Group_1164.png"
                        class="xl:w-[20rem] z-20 lg:w-64 mt-24 relative flex justify-center mx-auto"
                    />
                </div>
                <div class="absolute top-36 left-20">
                    <LayoutsAppImage
                        src="/icons/plus.png"
                        class="xl:w-24 lg:w-20"
                    />
                </div>
                <div class="absolute bottom-32 right-20">
                    <LayoutsAppImage
                        src="/icons/Unin.png"
                        class="xl:w-16 lg:w-12"
                    />
                </div>

                <div class="absolute right-6 top-6">
                    <LayoutsDropdownLang />
                </div>

                <div class="absolute bottom-24 left-24">
                    <LayoutsAppImage
                        src="/icons/cog.png"
                        class="w-52"
                    />
                </div>

                <div class="absolute z-10 w-full text-primary h-16 bg-primary bottom-0 left-0">
                    .
                </div>
            </div>

            <div class="bg-white overflow-hidden container sm:w-full md:w-[80%] lg:w-full flex flex-col space-y-12 justify-center items-center relative">
                <BackButton to="/"/>
                <div>
                    <LayoutsLogo class="lg:w-80 sm:w-72" />
                </div>

                <div class="w-full max-w-md container">
                    <div class="mb-8 text-center">
                        <h1 class="font-secondary text-2xl font-semibold text-dark">
                            {{ $t('auth.signInHeading') }}
                        </h1>
                        <p class="mt-2 text-sm text-gray-500">
                            {{ $t('auth.signInSubtitle') }}
                        </p>
                    </div>

                    <form @submit.prevent="submit">
                        <div class="flex flex-col space-y-4">
                            <div class="flex w-full items-center space-x-1">
                                <InputIcon
                                    v-model="credentials.identifier"
                                    :icon="User"
                                    type="text"
                                    rounded="md"
                                    label="Email"
                                    placeholder="Email"
                                    class="text-sm w-full"
                                />
                            </div>

                            <div class="flex w-full items-center space-x-1">
                                <InputIcon
                                    v-model="credentials.password"
                                    :icon="Lock"
                                    type="password"
                                    rounded="md"
                                    :label="$t('auth.password')"
                                    :placeholder="$t('auth.password')"
                                    class="text-sm w-full"
                                />
                            </div>
                        </div>

                        <div class="flex justify-between lg:text-sm text-xs items-center md:mt-6 sm:mt-4">
                            <label
                                for="remember"
                                class="group flex cursor-pointer items-center gap-2 select-none"
                            >
                                <Checkbox
                                    id="remember"
                                    v-model:checked="credentials.remember"
                                    class="transition-transform group-active:scale-90"
                                />
                                <span class="font-sans font-light text-primary leading-none">
                                    {{ $t('auth.rememberMe') }}
                                </span>
                            </label>

                            <NuxtLink
                                :to="localePath('/password/reset-password')"
                                class="relative w-fit text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100"
                            >
                                *{{ $t('auth.forgotPassword') }}
                            </NuxtLink>
                        </div>

                        <div class="flex flex-col justify-center items-center mx-auto mt-12 space-y-7">
                            <!-- <Button
                                variant="secondary"
                                class="md:w-80 sm:w-64 shadow flex justify-center space-x-2 items-center md:text-base sm:text-xs"
                            >
                                <LayoutsAppImage
                                    src="/icons/google.png"
                                    alt="Google"
                                    class="w-4"
                                />
                                <span>
                                    {{ $t('auth.signInGoogle') }}
                                </span>
                            </Button> -->
                            <Button
                                class="md:w-80 sm:w-64 hover:shadow-lg md:text-base sm:text-xs"
                                type="submit"
                                :in-progress="inProgress"
                                data-testid="login-submit"
                            >
                                {{ $t('auth.signIn') }}
                            </Button>
                        </div>
                    </form>
                </div>

                <div>
                    <p class="text-xs">
                        {{ $t('auth.noAccountYet') }}
                        <NuxtLink
                            :to="localePath('/register')"
                            class="font-bold text-primary underline"
                        >
                            {{ $t('auth.signUp') }}
                        </NuxtLink>
                    </p>
                </div>
            </div>
        </div>

        <div class="sm:hidden min-h-screen w-screen flex flex-col justify-between relative overflow-hidden">
            <LayoutsHeaderMobile />

            <BackButton to="/" />

            <div class="flex flex-col justify-center items-center px-6 grow">
                <div class="mb-6 text-center">
                    <h1 class="font-secondary text-xl font-semibold text-dark">
                        {{ $t('auth.signInHeading') }}
                    </h1>
                    <p class="mt-1.5 text-xs text-gray-500">
                        {{ $t('auth.signInSubtitle') }}
                    </p>
                </div>

                <form
                    class="w-full max-w-sm"
                    @submit.prevent="submit"
                >
                    <div class="flex flex-col space-y-6">
                        <div class="flex w-full items-center space-x-1">
                            <InputIcon
                                v-model="credentials.identifier"
                                :icon="User"
                                type="text"
                                rounded="md"
                                label="Email"
                                placeholder="Email"
                                class="text-sm w-full"
                            />
                        </div>

                        <div class="flex w-full items-center space-x-1">
                            <InputIcon
                                v-model="credentials.password"
                                :icon="Lock"
                                type="password"
                                rounded="md"
                                :label="$t('auth.password')"
                                :placeholder="$t('auth.password')"
                                class="text-sm w-full"
                            />
                        </div>
                    </div>

                    <div class="flex justify-between text-xs mt-4">
                        <label
                            for="remember-mobile"
                            class="group flex cursor-pointer items-center gap-2 select-none"
                        >
                            <Checkbox
                                id="remember-mobile"
                                v-model:checked="credentials.remember"
                                class="rounded-md! transition-transform group-active:scale-90"
                            />
                            <span class="font-light text-primary leading-none">{{ $t('auth.rememberMe') }}</span>
                        </label>

                        <NuxtLink
                            :to="localePath('/password/reset-password')"
                            class="relative w-fit text-primary after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out hover:after:origin-left hover:after:scale-x-100"
                        >*{{ $t('auth.forgotPassword') }}</NuxtLink>
                    </div>

                    <div class="flex flex-col justify-center items-center mx-auto mt-12 space-y-7">
                        <!-- <Button
                            variant="secondary"
                            class="w-80"
                        >
                            <LayoutsAppImage
                                src="/icons/google.png"
                                alt="Google"
                                class="w-4"
                            />
                            <span>{{ $t('auth.signInGoogle') }}</span>
                        </Button> -->
                        <Button
                            class="w-80"
                            type="submit"
                            :in-progress="inProgress"
                            data-testid="login-submit"
                        >
                            {{ $t('auth.signIn') }}
                        </Button>
                    </div>
                </form>
            </div>

            <div class="text-xs text-center mt-4 mb-8">
                <p>
                    {{ $t('auth.noAccountYet') }}
                    <NuxtLink
                        :to="localePath('/register')"
                        class="font-bold text-primary underline"
                    >{{ $t('auth.signUp') }}</NuxtLink>
                </p>
            </div>

            <div class="bg-primary text-primary h-10 w-full mt-auto" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Lock, User } from 'lucide-vue-next';
import { useCookie } from '#app';
import { Checkbox } from '@/components/ui/checkbox';
import InputIcon from '~/components/ui/input-with-icon/InputIcon.vue';
import Button from '~/components/ui/button/Button.vue';
import BackButton from '~/components/ui/back-button/BackButton.vue';
import { safeLoginRedirectPath } from '~/utils/accessReturn';

const route = useRoute();
const { login } = useAuth();
const localePath = useLocalePath();
const { t } = useI18n();

const credentials = reactive({
    identifier: '',
    password: '',
    remember: false,
});

const { submit, inProgress } = useSubmit(
    async () => {
        await login(credentials);

        await nextTick();

        if (useCookie('2fa_hash').value) {
            return navigateTo({
                path: localePath('/2fa-challenge'),
                query: route.query.redirect ? { redirect: route.query.redirect } : undefined,
            });
        }

        const target = safeLoginRedirectPath(route.query.redirect);
        await navigateTo(localePath(target), { replace: true });

        await nextTick();

        if (route.path === '/login' || route.path === '/nl/login') {
            window.location.assign(localePath(target));
        }
    },
);

definePageMeta({
    layout: 'auth',
    middleware: ['guest'],
});

useHead({
    title: () => t('auth.signIn'),
    meta: [
        {
            name: 'description',
            content: () => t('home.metaDescription'),
        },
    ],
});
</script>

<style scoped>
html, body {
  height: 100%;
  overflow: hidden;
}
</style>
