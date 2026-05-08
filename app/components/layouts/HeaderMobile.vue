<template>
    <div class="relative flex flex-col">
        <div class="absolute inset-0 z-0">
            <LayoutsAppImage
                src="Mask_group.png"
                class="w-full h-24"
            />
        </div>
        <div
            class="flex z-20 pt-2 relative justify-between px-4"
        >
            <a
                v-show="isHomePage"
                href="tel:+32478023377"
                class="flex items-center"
            >
                <div class="flex items-center gap-1 pt-2">
                    <span class="text-xs text-foreground/70">Contactez-nous au :</span>
                    <span class="text-sm font-bold text-primary">(+32) 478 02 33 77</span>
                </div>
            </a>
            <div class="hidden ml-auto">
                <LayoutsDropdownLang />
            </div>
        </div>
        <div
            v-if="!isHomePage"
            class="mt-5 z-20 relative flex justify-center"
        >
            <LayoutsLogo class="w-60" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Phone, Star } from 'lucide-vue-next';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRoute } from 'vue-router';
import { cn } from '~/lib/utils';

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
</script>
