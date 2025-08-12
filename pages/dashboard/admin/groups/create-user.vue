<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="flex items-center justify-between w-full mb-4">
            <h1 class="py-3 text-primary sm:bg-gray-100 w-full sm:px-9 rounded-lg">
                Ajout utilisateur
                <template v-if="groupName">
                    <span class="font-bold">au groupe "{{ groupName }}"</span>
                </template>
                <template v-else>
                    <span class="font-bold">au groupement</span>
                </template>
            </h1>
        </div>
        <div>
            <UsersAdminForm />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useGroup } from '~/composables/useGroup';
import { useState } from '#imports';

useHead({
    title: 'Ajout utilisateur groupement',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const selectedGroupIdState = useState<number | null>('selectedGroupId', () => null);
const { groups, myGroups } = useGroup();

await myGroups();

const groupName = computed(() => {
    const id = selectedGroupIdState.value;
    if (!id) return '';
    const group = groups.value.find(g => g.id === id);
    return group ? group.name : '';
});
</script>
