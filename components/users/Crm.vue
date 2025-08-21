<template>
    <div>
        <h1>
            <NuxtLink
                :to="{
                    path: '/dashboard/admin/users/crm',
                    query: { name: user.full_name },
                }"
                class="text-gray-800"
            >
                <span
                    class="cursor-pointer"
                >
                    {{ user?.full_name ?? '' }}
                </span>
            </NuxtLink>
        </h1>

        <Dialog
            v-model:open="showForm"
            class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
        >
            <DialogContent class="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-auto">
                <UsersCard :user="user" />
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { User } from '~/lib/types';

defineProps<{
    user: User;
}>();

const showForm = ref(false);
</script>
