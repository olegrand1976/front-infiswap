<template>
    <div>
        <h4 class="text-primary font-semibold">
            {{ title }}
        </h4>
        <div class="border-2 border-gray-200 rounded p-4 my-3">
            <h6 class="flex first-letter:uppercase font-bold items-center space-x-4 text-sm">
                <span class="text-primary first-letter:uppercase">{{ currentMonth }}</span>
            </h6>
            <div class="flex justify-center items-center gap-3 mt-3">
                <p class="text-5xl font-semibold text-primary text-center">
                    {{ count }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

defineProps<{
    title: string;
    count: number;
}>();

const currentMonth = computed(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
});
</script>
