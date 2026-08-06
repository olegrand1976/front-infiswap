<template>
    <section class="container py-14">
        <h2 class="text-2xl font-bold font-secondary text-center mb-10">
            {{ $t('home.partners.title') }}
        </h2>
        <div class="grid grid-cols-1 max-w-5xl mx-auto md:grid-cols-2 gap-4 lg:gap-6">
            <div class="rounded-xl border border-blue-200 bg-white p-6 shadow-sm flex flex-col gap-4">
                <LayoutsNursTech class="w-36 mx-auto" />
                <p class="text-sm text-gray-600 text-center">
                    {{ $t('home.partners.nurstechDesc') }}
                </p>
                <NuxtLink
                    :to="`${localePath('/nurstech-by-infiswap')}#information-form`"
                    class="mx-auto px-4 py-2 border border-primarytech text-primarytech rounded-md text-sm font-medium hover:bg-primarytech hover:text-white transition"
                    @click="onDiscover('nurstech')"
                >
                    {{ $t('home.partners.discoverNurstech') }}
                </NuxtLink>
            </div>
            <div class="rounded-xl border border-indigo-200 bg-white p-6 shadow-sm flex flex-col gap-4">
                <LayoutsNursAssur class="mt-2 w-36 mx-auto" />
                <p class="text-sm mt-3 text-gray-600 text-center">
                    {{ $t('home.partners.nursassurDesc') }}
                </p>
                <NuxtLink
                    :to="`${localePath('/nursassur-by-infiswap')}#quote`"
                    class="mx-auto px-4 py-2 border border-primaryassur text-primaryassur rounded-md text-sm font-medium hover:bg-primaryassur hover:text-white transition"
                    @click="onDiscover('nursassur')"
                >
                    {{ $t('home.partners.discoverNursassur') }}
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { PartnerProduct } from '~/utils/partnerServices';

const localePath = useLocalePath();
const { trackPartnerImpression, trackPartnerCtaClick, registerPartnerClickFromProduct } = usePartnerServices();

onMounted(() => {
    trackPartnerImpression('nurstech', 'home_partners', 'home');
    trackPartnerImpression('nursassur', 'home_partners', 'home');
});

function onDiscover(product: PartnerProduct) {
    const cta = product === 'nursassur' ? 'see_offer' : 'request_callback';
    trackPartnerCtaClick(product, 'home_partners', cta, 'home');
    registerPartnerClickFromProduct(product, 'home', 'home_partners');
}
</script>
