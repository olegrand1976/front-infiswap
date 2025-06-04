<script setup lang="ts">
import { computed } from 'vue';
import { useRuntimeConfig } from '#app';

const props = defineProps<{
    home: {
        title?: string;
        description?: string;
        image?: string | null;
        active?: boolean | number;
    };
}>();

console.log('home:', props.home);

const cleanedDescription = computed(() => {
    return props.home.description
        ?.replace(/^"|"$/g, '')
        .split(/\\r\\n|\\n|\\r/g)
        .filter((p: string) => p.trim() !== '') || [];
});
</script>

<template>
    <div class="h-full w-full flex rounded-2xl overflow-hidden bg-white min-h-[350px]">
        <div class="relative w-1/3 h-full bg-blue-100">
            <LayoutsAppImage
                src="/home/message_home_background.png"
                class="w-full h-full object-cover"
            />
            <img
                v-if="props.home?.image"
                :src="`${useRuntimeConfig().public.API_URL}/storage/${props.home.image}`"
                class="absolute w-32 lg:w-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
                alt="Message image"
            />
            <LayoutsAppImage
                v-else
                src="/home/mail-image.png"
                class="absolute w-32 lg:w-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
        </div>

        <div class="w-2/3 h-full flex flex-col justify-center p-6 lg:p-12 text-start overflow-y-auto">
            <p class="font-bold mb-4">
                {{ props.home.title }}
            </p>
            <div>
                <p
                    v-for="(p, i) in cleanedDescription"
                    :key="i"
                    class="mb-4 text-gray-700 leading-relaxed text-base lg:text-lg"
                >
                    {{ p }}
                </p>
            </div>
        </div>
    </div>
</template>
