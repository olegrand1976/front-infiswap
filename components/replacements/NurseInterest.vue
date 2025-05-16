<template>
    <div class="p-4">
        <div class="w-full overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr class="bg-gray-100 text-left">
                        <th class="px-4 py-2 border-b">Nom</th>
                        <th class="px-4 py-2 border-b">Email</th>
                        <th class="px-4 py-2 border-b">Téléphone</th>
                        <th class="px-4 py-2 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in responses" :key="index" class="hover:bg-gray-50">
                        <td class="px-4 py-2 border-b">{{ item.repondedBy.full_name }}</td>
                        <td class="px-4 py-2 border-b">{{ item.repondedBy.email }}</td>
                        <td class="px-4 py-2 border-b">{{ item.repondedBy.phone_number }}</td>
                        <td class="px-4 py-2 border-b">
                            <NuxtLink :to="`/dashboard/admin/users/${item.repondedBy.id}`" class="text-blue-600 hover:underline">
                                Voir détail
                            </NuxtLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    responses: {
        type: Array,
        required: true,
    },
});
</script>
