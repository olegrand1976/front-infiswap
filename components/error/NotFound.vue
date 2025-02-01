<template>
    <div>
        <LayoutError>
            <template #image>
                <NuxtImg
                    src="/svg/not_found.svg"
                    class="h-72"
                />
            </template>
            <template #title>
                <span v-if="isAuthenticated">
                    Votre tournée s'est mal passé, vous êtes tombé dans une impasse!
                </span>
                <span v-else>
                    Oups ! Page introuvable.
                </span>
            </template>
            <template #message>
                La page que vous avez demandée est introuvable.
            </template>
        </LayoutError>
    </div>
</template>

<script lang="ts" setup>
import LayoutError from '~/layouts/error.vue';

const isAuthenticated = computed(() => {
    return false;
});
</script>
