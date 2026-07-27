<template>
    <section class="container my-12">
        <h2 class="text-2xl font-bold text-primary text-center mb-6">
            {{ $t('home.partners.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="rounded-xl border border-blue-200 bg-white p-6 shadow-sm flex flex-col gap-4">
                <LayoutsNursTech class="w-36 mx-auto" />
                <p class="text-sm text-gray-600 text-center">
                    {{ $t('home.partners.nurstechDesc') }}
                </p>
                <NuxtLink
                    :to="localePath('/nurstech-by-infiswap')"
                    class="mx-auto px-4 py-2 border border-primarytech text-primarytech rounded-md text-sm font-medium hover:bg-primarytech hover:text-white transition"
                    @click="onDiscover('nurstech')"
                >
                    {{ $t('home.partners.discoverNurstech') }}
                </NuxtLink>
            </div>
            <div class="rounded-xl border border-indigo-200 bg-white p-6 shadow-sm flex flex-col gap-4">
                <LayoutsNursAssur class="w-36 mx-auto" />
                <p class="text-sm text-gray-600 text-center">
                    {{ $t('home.partners.nursassurDesc') }}
                </p>
                <NuxtLink
                    :to="localePath('/nursassur-by-infiswap')"
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
    trackPartnerCtaClick(product, 'home_partners', 'discover', 'home');
    registerPartnerClickFromProduct(product, 'home', 'home_partners');
}
</script>
