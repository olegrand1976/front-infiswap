<template>
    <div>
        <LayoutError>
            <template #image>
                <ExclamationCircleIcon
                    class="h-64 text-primary"
                />
            </template>
            <template #title>
                Une erreur est survenue
            </template>
            <template #message>
                Veuillez réessayer plus tard
            </template>
        </LayoutError>
    </div>
</template>

<script lang="ts" setup>
import { ExclamationCircleIcon } from '@heroicons/vue/24/solid';
import LayoutError from '~/layouts/error.vue';
</script>
