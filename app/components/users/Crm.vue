<template>
    <div>
        <NuxtLink
            :to="{
                path: '/dashboard/admin/users/crm',
                query: { name: user.full_name },
            }"
            class="text-gray-800 cursor-pointer hover:text-primary"
        >
            {{ user?.full_name ?? '' }}
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
import type { User } from '~/lib/types';

defineProps<{
    user: User;
}>();
</script>
