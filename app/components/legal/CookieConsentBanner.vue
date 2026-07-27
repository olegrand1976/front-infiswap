<template>
    <div
        v-if="bannerVisible"
        class="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6"
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-desc"
    >
        <div class="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:p-6">
            <h2
                id="cookie-consent-title"
                class="text-base font-semibold text-gray-900 sm:text-lg"
            >
                {{ $t('cookies.title') }}
            </h2>
            <p
                id="cookie-consent-desc"
                class="mt-2 text-sm text-gray-600"
            >
                {{ $t('cookies.description') }}
                <NuxtLink
                    :to="localePath('/privacy-security')"
                    class="text-primary underline"
                >
                    {{ $t('cookies.privacyLink') }}
                </NuxtLink>
            </p>

            <div
                v-if="showDetails"
                class="mt-4 space-y-3 rounded-lg bg-gray-50 p-3 text-sm"
            >
                <label class="flex items-start gap-2">
                    <input
                        type="checkbox"
                        checked
                        disabled
                        class="mt-1"
                    >
                    <span>{{ $t('cookies.necessary') }}</span>
                </label>
                <label class="flex items-start gap-2">
                    <input
                        v-model="analytics"
                        type="checkbox"
                        class="mt-1"
                    >
                    <span>{{ $t('cookies.analytics') }}</span>
                </label>
                <label class="flex items-start gap-2">
                    <input
                        v-model="marketing"
                        type="checkbox"
                        class="mt-1"
                    >
                    <span>{{ $t('cookies.marketing') }}</span>
                </label>
            </div>

            <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    class="order-3 sm:order-1"
                    @click="showDetails = !showDetails"
                >
                    {{ showDetails ? $t('cookies.hide') : $t('cookies.customize') }}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    class="order-2"
                    @click="rejectNonEssential"
                >
                    {{ $t('cookies.refuse') }}
                </Button>
                <Button
                    v-if="showDetails"
                    type="button"
                    variant="secondary"
                    class="order-1 sm:order-3"
                    @click="save({ analytics, marketing })"
                >
                    {{ $t('cookies.save') }}
                </Button>
                <Button
                    type="button"
                    class="order-1 sm:order-4"
                    @click="acceptAll"
                >
                    {{ $t('cookies.acceptAll') }}
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button';

const {
    bannerVisible,
    preferences,
    acceptAll,
    rejectNonEssential,
    save,
    init,
} = useCookieConsent();

const localePath = useLocalePath();
const showDetails = ref(false);
const analytics = ref(false);
const marketing = ref(false);

function syncLocalFromPreferences(): void {
    analytics.value = preferences.value?.analytics ?? false;
    marketing.value = preferences.value?.marketing ?? false;
}

onMounted(() => {
    init();
    syncLocalFromPreferences();
});

watch(bannerVisible, (visible) => {
    if (visible) {
        syncLocalFromPreferences();
        showDetails.value = Boolean(preferences.value);
    }
});
</script>
