<template>
    <div class="bg-white flex flex-col font-light">
        <header class="hidden sm:block">
            <LayoutsNurseHeader :theme="currentTheme" />
        </header>
        <header class="sm:hidden">
            <LayoutsNurseHeaderMobile :theme="currentTheme" />
        </header>
        <main class="flex-1 mt-20 lg:mt-[8rem]">
            <NuxtPage />
        </main>
        <footer>
            <LayoutsNurseFooter :theme="currentTheme" />
        </footer>
    </div>
</template>

<script lang="ts" setup>
const route = useRoute();

const currentTheme = computed(() =>
    route.path.includes('/nursassur-by-infiswap') ? 'assur' : 'tech',
);
</script>
