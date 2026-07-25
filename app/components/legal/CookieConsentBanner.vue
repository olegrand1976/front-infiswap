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
                Cookies et confidentialité
            </h2>
            <p
                id="cookie-consent-desc"
                class="mt-2 text-sm text-gray-600"
            >
                Nous utilisons des cookies nécessaires au fonctionnement du site. Avec votre accord, nous activons aussi
                la mesure d’audience et, le cas échéant, la publicité. InfiSwap ne revend pas vos données.
                <NuxtLink
                    to="/privacy-security"
                    class="text-primary underline"
                >
                    Politique de confidentialité
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
                    <span><strong>Nécessaires</strong> — session, sécurité, préférences techniques (toujours actifs).</span>
                </label>
                <label class="flex items-start gap-2">
                    <input
                        v-model="analytics"
                        type="checkbox"
                        class="mt-1"
                    >
                    <span><strong>Analytics</strong> — Google Analytics / Tag Manager (mesure d’audience).</span>
                </label>
                <label class="flex items-start gap-2">
                    <input
                        v-model="marketing"
                        type="checkbox"
                        class="mt-1"
                    >
                    <span><strong>Marketing</strong> — Meta Pixel et publicité personnalisée.</span>
                </label>
            </div>

            <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    class="order-3 sm:order-1"
                    @click="showDetails = !showDetails"
                >
                    {{ showDetails ? 'Masquer' : 'Personnaliser' }}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    class="order-2"
                    @click="rejectNonEssential"
                >
                    Refuser
                </Button>
                <Button
                    v-if="showDetails"
                    type="button"
                    variant="secondary"
                    class="order-1 sm:order-3"
                    @click="save({ analytics, marketing })"
                >
                    Enregistrer
                </Button>
                <Button
                    type="button"
                    class="order-1 sm:order-4"
                    @click="acceptAll"
                >
                    Tout accepter
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

watch(preferences, () => {
    syncLocalFromPreferences();
}, { deep: true });
</script>
