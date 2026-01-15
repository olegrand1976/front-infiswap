<template>
    <div class="relative flex flex-col">
        <div class="absolute inset-0 z-0">
            <LayoutsAppImage
                src="Mask_group.png"
                class="w-full h-48"
            />
        </div>
        <div class="flex z-20 pt-2 relative space-x-3 justify-end items-center px-4">
            <div>
                <LayoutsNurseSheetMenu :theme="props.theme" />
            </div>
        </div>
        <div class="z-20 relative flex justify-center">
            <LayoutsAppImage
                :src="imgLogo"
                class="w-[15rem]"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    theme: string;
}>();

const imgLogo = computed(() =>
    props.theme === 'assur' ? '/nurs_assur.png' : '/nurs_tech.png',
);
</script>
