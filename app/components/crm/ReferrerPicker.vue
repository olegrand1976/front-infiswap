<template>
    <div>
        <div class="flex flex-wrap gap-4 mb-4">
            <label class="inline-flex items-center">
                <input
                    v-model="mode"
                    type="radio"
                    value="account"
                    class="form-radio"
                >
                <span class="ml-2">Porteur d'affaire</span>
            </label>
            <label class="inline-flex items-center">
                <input
                    v-model="mode"
                    type="radio"
                    value="text"
                    class="form-radio"
                >
                <span class="ml-2">Texte libre</span>
            </label>
        </div>

        <div
            v-if="mode === 'text'"
            class="mb-4"
        >
            <label
                :for="textInputId"
                class="block mb-1 text-sm font-medium text-gray-700"
            >
                Nom ou source
            </label>
            <InputIcon
                :id="textInputId"
                v-model="referrerText"
                type="text"
                class="w-full"
                :placeholder="textPlaceholder"
            />
        </div>

        <template v-else>
            <RollingLoader
                v-if="isLoading"
                :loading="isLoading"
            />

            <template v-else>
                <label
                    :for="autocompleteInputId"
                    class="block mb-1 text-sm font-medium text-gray-700"
                >
                    Porteur d'affaire
                </label>
                <InputIcon
                    :id="autocompleteInputId"
                    v-model="searchQuery"
                    type="text"
                    class="w-full mb-2"
                    placeholder="Rechercher un commercial ou admin…"
                    autocomplete="off"
                />
                <p
                    v-if="searchQuery.trim() && filteredReferrers.length === 0"
                    class="text-sm text-gray-500 italic py-2"
                >
                    Aucun porteur d'affaire trouvé
                </p>
                <ul
                    v-else-if="filteredReferrers.length > 0"
                    class="max-h-48 overflow-y-auto rounded-md border bg-white shadow-sm"
                >
                    <li
                        v-for="ref in filteredReferrers"
                        :key="ref.id ?? `ref-${ref.full_name}`"
                        class="cursor-pointer px-3 py-2 text-sm hover:bg-primary hover:text-white"
                        :class="{ 'bg-primary text-white font-semibold': selectedReferrer?.id === ref.id }"
                        @click="selectReferrer(ref)"
                    >
                        {{ ref.full_name }} ({{ ref.email }})
                    </li>
                </ul>
                <p
                    v-else
                    class="text-gray-500 italic text-center py-4 text-sm"
                >
                    Pas encore de porteur d'affaire enregistré
                </p>
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
import { InputIcon } from '~/components/ui/input-with-icon';
import type { Referrer } from '~/lib/types';

const props = withDefaults(defineProps<{
    referrers?: Referrer[];
    loading?: boolean;
    textInputId?: string;
    autocompleteInputId?: string;
    textPlaceholder?: string;
}>(), {
    textInputId: 'referrerFreeText',
    autocompleteInputId: 'referrerAutocomplete',
    textPlaceholder: 'Ex. Dr Dupont, salon Infirmiers 2025…',
});

const mode = defineModel<'account' | 'text'>('mode', { default: 'account' });
const selectedReferrer = defineModel<Referrer | null>('selectedReferrer', { default: null });
const referrerText = defineModel<string>('referrerText', { default: '' });

const { userReferrer, getUserReferrer, loading: referrerFetchLoading } = useReferrer();

const searchQuery = ref('');

const isLoading = computed(() => props.loading ?? referrerFetchLoading.value);

const referrersList = computed(() => {
    if (props.referrers !== undefined) {
        return props.referrers;
    }

    return userReferrer.value ?? [];
});

const filteredReferrers = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    const list = referrersList.value;

    if (!query) {
        return list;
    }

    return list.filter((ref) => {
        const name = (ref.full_name ?? '').toLowerCase();
        const email = (ref.email ?? '').toLowerCase();

        return name.includes(query) || email.includes(query);
    });
});

function referrerLabel(ref: Referrer | null): string {
    if (!ref?.id) {
        return '';
    }

    const name = ref.full_name?.trim() || 'Sans nom';
    const email = ref.email?.trim();

    return email ? `${name} (${email})` : name;
}

function syncSearchFromSelection(): void {
    if (mode.value !== 'account') {
        return;
    }

    searchQuery.value = referrerLabel(selectedReferrer.value);
}

function selectReferrer(ref: Referrer): void {
    selectedReferrer.value = ref;
    searchQuery.value = referrerLabel(ref);
}

watch(searchQuery, (value) => {
    if (mode.value !== 'account' || !selectedReferrer.value) {
        return;
    }

    if (value !== referrerLabel(selectedReferrer.value)) {
        selectedReferrer.value = null;
    }
});

watch(selectedReferrer, () => {
    syncSearchFromSelection();
}, { immediate: true });

watch(referrersList, () => {
    syncSearchFromSelection();
});

watch(mode, (value) => {
    if (value === 'text') {
        selectedReferrer.value = null;
        searchQuery.value = '';
        return;
    }

    referrerText.value = '';
    syncSearchFromSelection();

    if (referrersList.value.length === 0) {
        getUserReferrer();
    }
});

onMounted(() => {
    getUserReferrer();
});
</script>
