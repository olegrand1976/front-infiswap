<template>
    <div class="lg:ml-20 xl:ml-0">
        <div class="flex items-center justify-between w-full">
            <h1 class="flex w-full py-3 text-primary sm:bg-gray-100 sm:px-9 rounded-lg">
                Liste des <span class="ml-1 font-semibold">intéressées par votre demande</span>
            </h1>
        </div>

        <Tabs
            v-model="activeTab"
            class="my-6"
            @update:model-value="handleTabChange"
        >
            <TabsList class="w-full">
                <TabsTrigger
                    value="in_search"
                    class="w-48"
                >
                    Disponible
                </TabsTrigger>
            </TabsList>

            <TabsContent value="in_search">
                <div class="my-8">
                    <div
                        v-if="loading"
                        class="space-y-6"
                    >
                        <Skeleton class="h-12 w-full bg-gray-100" />
                        <Skeleton class="h-12 w-full bg-gray-100" />
                    </div>
                    <div v-else-if="groupedInSearchResponses.length">
                        <div
                            v-for="(group, userPartnerId) in groupedInSearchResponses"
                            :key="userPartnerId"
                            class="mb-8"
                        >
                            <div class="bg-gray-100 p-4 rounded-lg">
                                <h2 class="text-lg font-semibold">
                                    Demande #{{ group.user_partner.id }}
                                </h2>
                                <p class="text-sm mt-1">
                                    {{ group.user_partner.description || 'Aucune description' }}
                                </p>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mt-8">
                                <div
                                    v-for="response in group.responses"
                                    :key="response.id"
                                    class="relative"
                                >
                                    <UsersCard
                                        class="max-w-lg mx-auto"
                                        :user="response.interested_user"
                                        :show-full-info="false"
                                    />
                                    <div
                                        v-if="response.status === 'pending'"
                                        class="flex justify-center gap-4 mt-8"
                                    >
                                        <Button
                                            @click="handleReject(response)"
                                        >
                                            Refuser
                                        </Button>
                                        <Button
                                            variant="success"
                                            class="rounded-full"
                                            @click="handleAccept(response)"
                                        >
                                            Accepter
                                        </Button>
                                    </div>
                                    <div
                                        v-else
                                        :class="[cn('w-full mt-8  flex justify-center mx-auto gap-3 items-center rounded-full p-3 bg-gray-100', { 'text-success': response.status === 'accepted', 'text-primary': response.status === 'rejected' })]"
                                    >
                                        <CheckBadgeIcon class="w-8" />
                                        <p class="font-semibold">
                                            {{ response.status === 'accepted' ? 'Acceptée' : 'Refusée' }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="text-center text-gray-500 py-8"
                    >
                        Aucune réponse trouvée
                    </div>
                </div>
            </TabsContent>

            <!-- <TabsContent value="available">
                <div class="my-8">
                    <div
                        v-if="loading"
                        class="space-y-6"
                    >
                        <Skeleton class="h-12 w-full bg-gray-100" />
                        <Skeleton class="h-12 w-full bg-gray-100" />
                    </div>
                    <div v-else-if="groupedAvailableResponses.length">
                        <div
                            v-for="(group, userPartnerId) in groupedAvailableResponses"
                            :key="userPartnerId"
                            class="mb-8"
                        >
                            <div class="bg-primary text-white p-4 rounded-lg shadow-md">
                                <h2 class="text-lg font-semibold">
                                    Demande #{{ group.user_partner.id }} - {{ durations[group.user_partner.duration] }}
                                </h2>
                                <p class="text-sm mt-1">
                                    {{ group.user_partner.description || 'Aucune description' }}
                                </p>
                                <p class="text-xs mt-1 opacity-80">
                                    Créée le {{ formatDate(group.user_partner.created_at) }}
                                </p>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12 mt-8">
                                <div
                                    v-for="response in group.responses"
                                    :key="response.id"
                                    class="relative"
                                >
                                    <UsersCard
                                        class="max-w-lg mx-auto"
                                        :user="response.interested_user"
                                        :show-full-info="false"
                                    />
                                    <div
                                        v-if="response.status === 'pending'"
                                        class="flex justify-center gap-4 mt-4"
                                    >
                                        <Button
                                            @click="handleReject(response)"
                                        >
                                            Refuser
                                        </Button>
                                        <Button
                                            variant="success"
                                            class="rounded-full"
                                            @click="handleAccept(response)"
                                        >
                                            Accepter
                                        </Button>
                                    </div>
                                    <div
                                        v-else
                                        :class="[cn('w-full mt-8  flex justify-center mx-auto gap-3 items-center rounded-full p-3 bg-gray-100', { 'text-success': response.status === 'accepted', 'text-primary': response.status === 'rejected' })]"
                                    >
                                        <CheckBadgeIcon class="w-8" />
                                        <p class="font-semibold">
                                            {{ response.status === 'accepted' ? 'Acceptée' : 'Refusée' }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="text-center text-gray-500 py-8"
                    >
                        Aucune réponse trouvée
                    </div>
                </div>
            </TabsContent> -->
        </Tabs>
    </div>
</template>

<script lang="ts" setup>
import { CheckBadgeIcon } from '@heroicons/vue/24/outline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePartners } from '@/composables/usePartners';
import { cn } from '@/lib/utils';

const { fetchResponses, demandResponses, updateStatusResponse, loading } = usePartners();

const activeTab = ref('in_search');
const selectedUserPartnerResponse = ref(null);
// const durations = {
//     short: 'Court terme',
//     long: 'Long terme',
// };

const groupedInSearchResponses = computed(() => {
    if (!demandResponses.value?.responses) return [];
    const grouped = demandResponses.value.responses.reduce((acc, response) => {
        // if (response.user_partner.type !== 'in_search') return acc;
        const key = response.user_partner_id;
        if (!acc[key]) {
            acc[key] = {
                user_partner: response.user_partner,
                responses: [],
            };
        }
        acc[key].responses.push({ ...response, inProgress: false });
        return acc;
    }, {});
    return Object.values(grouped);
});

// const groupedAvailableResponses = computed(() => {
//     if (!demandResponses.value?.responses) return [];
//     const grouped = demandResponses.value.responses.reduce((acc, response) => {
//         if (response.user_partner.type !== 'available') return acc;
//         const key = response.user_partner_id;
//         if (!acc[key]) {
//             acc[key] = {
//                 user_partner: response.user_partner,
//                 responses: [],
//             };
//         }
//         acc[key].responses.push({ ...response, inProgress: false });
//         return acc;
//     }, {});
//     return Object.values(grouped);
// });

const handleTabChange = async (newTab: string) => {
    activeTab.value = newTab;
};

const handleAccept = async (response) => {
    selectedUserPartnerResponse.value = response;
    const result = await updateStatusResponse({ ...response, status: 'accepted' });
    if (result.data.status === 'accepted') {
        const responseIndex = demandResponses.value.responses.findIndex(
            r => r.id === response.id,
        );
        if (responseIndex !== -1) {
            demandResponses.value.responses[responseIndex].status = 'accepted';
        }
    }
};

const handleReject = async (response) => {
    selectedUserPartnerResponse.value = response;
    const result = await updateStatusResponse({ ...response, status: 'rejected' });
    if (result.data.status === 'rejected') {
        const responseIndex = demandResponses.value.responses.findIndex(
            r => r.id === response.id,
        );
        if (responseIndex !== -1) {
            demandResponses.value.responses[responseIndex].status = 'rejected';
        }
    }
};

onMounted(async () => {
    await fetchResponses();
});

useHead({
    title: 'Historique des réponses',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
