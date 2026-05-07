<template>
    <div>
        <div class="relative">
            <Input
                v-model="search"
                placeholder="joe@gmail.com"
                class="w-full rounded-md"
                @update:model-value="handleSearch"
                @keydown.enter.prevent="handleEnter"
                @keydown.space.prevent="handleTokenCommit"
                @blur="handleBlur"
            >
                <template #icon>
                    <i class="i-mdi:account-search-outline" />
                </template>
            </Input>

            <ul
                v-if="filteredResults.length > 0"
                class="absolute bg-white border w-full mt-1 z-10 rounded-md shadow max-h-60 overflow-y-auto"
            >
                <li
                    v-for="user in filteredResults"
                    :key="user.id"
                    class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    @mousedown.prevent="selectUser(user)"
                >
                    {{ getDisplayName(user) }} - {{ user.email }}
                </li>
            </ul>
        </div>

        <div
            v-if="selected.length"
            class="mt-4"
        >
            <ul class="flex flex-wrap gap-2 text-sm">
                <li
                    v-for="user in selected"
                    :key="user.email"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-md"
                >
                    {{ user.email }}
                    <button
                        class="text-red-600 hover:text-red-800 ml-1"
                        @click="removeUser(user)"
                    >
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
    return results.value.filter((user) => {
        return !selected.value.some(sel => sel.user_id === user.id?.toString() || sel.email === user.email);
    });
});

function selectUser(user) {
    if (!selected.value.find(u => u.user_id === user.id?.toString())) {
        const displayName = getDisplayName(user);
        selected.value.push({
            name: displayName === 'Nom indéfini' ? null : displayName,
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
    commitEmailsFromInput();
}

function handleTokenCommit() {
    commitEmailsFromInput();
}

function handleBlur() {
    setTimeout(() => {
        commitEmailsFromInput();
    }, 120);
}

function getDisplayName(user) {
    const first = user?.firstname?.trim?.() || '';
    const last = user?.lastname?.trim?.() || '';
    const full = `${first} ${last}`.trim();
    if (full) return full;
    if (user?.full_name) return String(user.full_name).trim();
    if (user?.name) return String(user.name).trim();
    return 'Nom indéfini';
}

function commitEmailsFromInput() {
    const raw = search.value.trim();
    if (!raw) return;

    const emails = raw
        .split(/[\s,;]+/)
        .map(token => token.trim())
        .filter(Boolean);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let hasChanges = false;
    emails.forEach((email) => {
        if (emailRegex.test(email) && !selected.value.some(u => u.email === email)) {
            selected.value.push({
                email,
                name: null,
                user_id: null,
            });
            hasChanges = true;
        }
    });

    if (hasChanges) {
        emit('update:recipients', [...selected.value]);
    }
    search.value = '';
    results.value = [];
}
</script>
