<template>
    <div>
        <div class="relative">
            <InputIcon
                v-model="search"
                placeholder="joe@gmail.com"
                class="w-full"
                @update:modelValue="handleSearch"
                @keydown.enter.prevent="handleEnter"
            >
                <template #icon>
                    <i class="i-mdi:account-search-outline"></i>
                </template>
            </InputIcon>

            <ul
                v-if="filteredResults.length > 0"
                class="absolute bg-white border w-full mt-1 z-10 rounded shadow max-h-60 overflow-y-auto"
            >
                <li
                    v-for="user in filteredResults"
                    :key="user.id"
                    @click="selectUser(user)"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    {{ user.firstname }} {{ user.lastname }} - {{ user.email }}
                </li>
            </ul>
        </div>

        <div v-if="selected.length" class="mt-4">
            <ul class="flex flex-wrap gap-2 text-sm">
                <li
                    v-for="user in selected"
                    :key="user.email"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 rounded"
                >
                    {{ user.email }}
                    <button @click="removeUser(user)" class="text-red-600 hover:text-red-800 ml-1">
                        &times;
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const search = ref('');
const results = ref([]);
const selected = ref([]);

const emit = defineEmits(['update:recipients']);

const { $apifetch } = useNuxtApp();

async function handleSearch(value) {
    search.value = value;
    if (value.length < 2) {
        results.value = [];
        return;
    }

    try {
        const data = await $apifetch('api/admin/users/search', {
            params: { query: value },
        });
        results.value = data;
    }
    catch (err) {
        console.error('Erreur fetch:', err);
    }
}

const filteredResults = computed(() => {
    return results.value.filter(user => {
        return !selected.value.some(sel => sel.user_id === user.id?.toString() || sel.email === user.email);
    });
});

function selectUser(user) {
    if (!selected.value.find(u => u.user_id === user.id?.toString())) {
        selected.value.push({
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            user_id: user.id?.toString() || null,
        });
        emit('update:recipients', [...selected.value]);
    }
    search.value = '';
    results.value = [];
}

function removeUser(user) {
    selected.value = selected.value.filter(u => u.email !== user.email);
    emit('update:recipients', [...selected.value]);
}

function handleEnter() {
    const email = search.value.trim();
    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return;
    }

    if (!selected.value.some(u => u.email === email)) {
        selected.value.push({
            email,
            name: null,
            user_id: null,
        });
        emit('update:recipients', [...selected.value]);
    }
    search.value = '';
    results.value = [];
}
</script>
