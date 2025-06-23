<template>
    <div>
        <h1>
            <span
                class="cursor-pointer"
                @click="showForm = !showForm"
            >
                {{ user?.full_name ?? '' }}
            </span>
        </h1>

        <Dialog
            v-model:open="showForm"
            class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
        >
            <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-2">
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
