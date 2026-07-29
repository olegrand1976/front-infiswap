<template>
    <section class="container mx-auto px-4 py-10">
        <div class="rounded-2xl border border-teal-200 bg-teal-50 px-6 py-8 text-center text-teal-950">
            <h2 class="text-xl font-semibold md:text-2xl">
                {{ $t('partnerPromo.networkTitle') }}
            </h2>
            <p class="mt-2 text-sm md:text-base text-teal-800">
                {{ $t('partnerPromo.networkProof') }}
            </p>
            <ul class="mx-auto mt-4 max-w-xl space-y-1 text-sm text-teal-900/90">
                <li>{{ $t('partnerPromo.networkLi1') }}</li>
                <li>{{ $t('partnerPromo.networkLi2') }}</li>
                <li>{{ $t('partnerPromo.networkLi3') }}</li>
            </ul>
            <div class="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <NuxtLink
                    :to="localePath('/dashboard/replacements')"
                    class="inline-flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                    @click="onClick('see')"
                >
                    {{ $t('partnerPromo.networkSee') }}
                </NuxtLink>
                <NuxtLink
                    :to="localePath('/dashboard/replacements/create')"
                    class="inline-flex items-center justify-center rounded-md border-2 border-teal-600 bg-white px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
                    @click="onClick('publish')"
                >
                    {{ $t('partnerPromo.networkPublish') }}
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { trackEvent } = useProductAnalytics();

function onClick(action: 'see' | 'publish') {
    trackEvent('infiswap_replacements_cta_click', {
        placement: 'partner_landing',
        action,
    });
}
</script>
