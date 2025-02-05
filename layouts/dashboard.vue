<template>
    <div class="bg-white flex h-screen">
        <div
            :class="isCollapsed ? 'w-[4vw]' : 'w-[20vw]'"
            class="transition-all duration-300 bg-white h-screen"
        >
            <LayoutsSideBar
                :collapsed="isCollapsed"
                @toggle-collapse="toggleSidebar"
            />
        </div>

        <div class="flex flex-col flex-grow space-y-3 p-4">
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
</script>
