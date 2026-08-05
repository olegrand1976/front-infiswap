<template>
    <div class="mt-4 lg:mt-10">
        <div class="md:hidden flex justify-center pt-8">
            <LayoutsLogo class="w-40" />
        </div>

        <Pricing />
    </div>
</template>

<script setup lang="ts">
import Pricing from '@/components/Pricing.vue';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
    title: () => t('pricing.seoTitle'),
    description: () => t('pricing.seoDescription'),
    ogTitle: () => t('pricing.seoTitle'),
    ogDescription: () => t('pricing.seoDescription'),
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: () => t('pricing.seoTitle'),
    twitterDescription: () => t('pricing.seoDescription'),
});

useHead({
    link: [
        { rel: 'canonical', href: localePath('/pricing') },
    ],
});

definePageMeta({
    layout: 'guest',
});
</script>
