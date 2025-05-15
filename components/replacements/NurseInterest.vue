<template>
    <div class="p-6">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
                <tr class="bg-gray-100 text-left">
                    <th class="px-4 py-2 border-b">Nom</th>
                    <th class="px-4 py-2 border-b">Email</th>
                    <th class="px-4 py-2 border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users" :key="index" class="hover:bg-gray-50">
                    <td class="px-4 py-2 border-b">{{ user.name }}</td>
                    <td class="px-4 py-2 border-b">{{ user.email }}</td>
                    <td class="px-4 py-2 border-b">
                        <NuxtLink :to="`/utilisateurs/${user.id}`" class="text-blue-600 hover:underline">
                            Voir détail
                        </NuxtLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const users = [
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@example.com' },
    { id: 2, name: 'Marie Curie', email: 'marie.curie@example.com' },
    { id: 3, name: 'Albert Einstein', email: 'albert.einstein@example.com' },
];
</script>
