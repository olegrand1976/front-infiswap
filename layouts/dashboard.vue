<template>
    <div class="bg-white flex 2xl:mr-4">
        <div
            :class="isCollapsed ? 'lg:w-[5vw] 2xl:w-[2vw]' : 'xl:w-[20vw] 2xl:w-[15vw]'"
            class="transition-all duration-300 bg-white h-screen"
        >
            <LayoutsSideBar
                :collapsed="isCollapsed"
                @toggle-collapse="toggleSidebar"
            />
        </div>

        <div class="flex flex-col flex-grow xl:w-auto lg:w-64 space-y-3 p-4">
            <LayoutsToolbar />
            <NuxtPage />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isCollapsed = ref(false);

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
};

definePageMeta({
    ssr: false,
});
</script>
