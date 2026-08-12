<template>
    <div class="relative mt-6 sm:mt-0">
        <div class="flex flex-col">
            <HomeNewBanner />
            <HomePlatformStats />
            <HomeNursesMapSection />
            <HomeCommunityStory />
            <HomePlatform />
            <HomePartnerServices v-if="!isLoggedIn" />
            <HomeInstitutionBanner />
        </div>

        <NuxtLink
            v-if="!isLoggedIn"
            :to="localePath('/register')"
            class="lg:hidden fixed bottom-20 right-0 z-40 bg-primary text-white rounded-l-full shadow-lg px-4 py-3 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
            <UserPlus class="w-5 h-5" />
            <span class="text-sm font-semibold">{{ $t('home.ctaRegister') }}</span>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import { Phone, UserPlus } from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';

const { isLoggedIn } = useAuth();
const localePath = useLocalePath();
const { t } = useI18n();

useHead({
    title: () => t('nav.home'),
    meta: [
        {
            name: 'description',
            content: () => t('home.metaDescription'),
        },
    ],
});
</script>
