<template>
    <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm px-10 py-6">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <div>
                    <h2 class="text-2xl font-semibold text-gray-800">
                        Personnes notifiées
                    </h2>
                    <p class="text-gray-500 text-sm">
                        Voici les personnes notifiées pour cette recherche de binôme.
                    </p>
                </div>
                <div class="mt-2 sm:mt-0 text-sm text-gray-600">
                    Total : <span class="font-semibold text-primary">{{ filteredUsers.length }} personne{{ filteredUsers.length > 1 ? 's' : '' }}</span>
                </div>
            </div>

            <div class="mb-4">
                <InputIcon
                    v-model="searchQuery"
                    :icon="CircleUser"
                    type="text"
                    placeholder="Rechercher par nom ou prénom..."
                    rounded="md"
                />
            </div>

            <div v-if="filteredUsers.length">
                <ul class="divide-y divide-gray-100">
                    <li
                        v-for="user in visibleUsers"
                        :key="user.id"
                        class="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-2 rounded hover:bg-gray-50 transition"
                    >
                        <div>
                            <UsersCrm
                                :user="user"
                                class="font-medium text-gray-800"
                            />
                            <div class="text-sm text-gray-500 break-all">
                                {{ user.email }}
                            </div>
                        </div>
                        <div class="mt-1 sm:mt-0 text-sm text-gray-600">
                            Code postal :
                            <span class="font-medium">{{ user.profile?.zip_code ?? '—' }}</span>
                        </div>
                    </li>
                </ul>

                <div
                    v-if="filteredUsers.length > limit"
                    class="flex justify-center mt-8"
                >
                    <button
                        class="px-5 py-2 border border-primary rounded-lg text-sm text-primary hover:bg-gray-100 transition"
                        @click="toggleShowAllNurses"
                    >
                        {{ showAll ? 'Voir moins' : `Voir plus (+${remainingUsersCount})` }}
                    </button>
                </div>
            </div>

            <div
                v-else
                class="mt-10 text-center text-gray-400 italic"
            >
                Aucune personne trouvée pour cette recherche.
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CircleUser, Star } from 'lucide-vue-next';

import type { UserPartner, User } from '~/lib/types';

const props = defineProps<{ partnership?: UserPartner | null }>();
const searchQuery = ref('');

const getInitialValue = (partnership: UserPartner | null | undefined = props.partnership) => ({
    id: partnership?.id ?? null,
    notifiedUser: partnership?.notified_users ?? [],
});

const form = reactive(getInitialValue());

function resetForm(partnership?: UserPartner | null) {
    Object.assign(form, getInitialValue(partnership));
}

watch(
    () => props.partnership,
    (newPartnership) => {
        resetForm(newPartnership);
    },
    { immediate: true },
);

const showAll = ref(false);
const limit = 10;
const notifiedUsers = ref<User[]>([]);

function initializeNotifiedUsers() {
    notifiedUsers.value = Array.isArray(form.notifiedUser) ? form.notifiedUser : [];
}

const filteredUsers = computed(() => {
    if (!searchQuery.value.trim()) return notifiedUsers.value;

    return notifiedUsers.value.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
});

const visibleUsers = computed(() =>
    showAll.value ? filteredUsers.value : filteredUsers.value.slice(0, limit),
);

function toggleShowAllNurses() {
    showAll.value = !showAll.value;
}

const remainingUsersCount = computed(() =>
    Math.max(filteredUsers.value.length - limit, 0),
);

initializeNotifiedUsers();
</script>
