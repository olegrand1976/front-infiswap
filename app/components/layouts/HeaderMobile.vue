<template>
    <div class="relative flex flex-col">
        <div class="absolute inset-0 z-0">
            <LayoutsAppImage
                src="Mask_group.png"
                class="w-full h-48"
            />
        </div>
        <div
            class="flex z-20 pt-2 relative justify-between px-4"
            :class="{ 'bg-white': isHomePage }"
        >
            <a
                v-if="isHomePage"
                href="tel:+32478023377"
                class="flex items-center gap-2"
            >
                <div class="flex items-center gap-2">
                    <span class="text-xs">Contactez-nous au :</span>
                    <span class="text-sm font-bold text-primary">(+32) 478 02 33 77</span>
                </div>
            </a>
            <div class="ml-auto">
                <LayoutsDropdownLang />
            </div>
        </div>
        <div class="mt-5 z-20 relative flex justify-center">
            <LayoutsLogo class="w-60" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PhoneIcon } from '@heroicons/vue/24/solid';
import { useRoute } from 'vue-router';

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
</script>
