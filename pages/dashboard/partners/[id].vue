<template>
    <div class="lg:ml-20 xl:ml-0">
        <Button
            class="text-sm w-24 sm:w-auto"
            @click="goBack"
        >
            <span class="text-xs">Retour</span>
        </Button>

        <section class="mt-12 md:mt-8 flex flex-col md:flex-row justify-center mx-auto gap-16 2xl:gap-32">
            <div class="md:w-96">
                <UsersCard
                    class="max-w-lg"
                    :user="demandPartner.user"
                    :show-full-info="false"
                />
            </div>

            <div class="flex flex-col space-y-16 bg-gray-200 shadow rounded-md md:w-96">
                <div class="flex flex-col space-y-3 text-center">
                    <label class="font-semibold bg-primary py-2 text-white">
                        Type de demande
                    </label>
                    <p v-if="demandPartner.type == 'in_search'">
                        À la recherche d'une collaboration
                    </p>
                    <p v-else>
                        Disponible pour une collaboration
                    </p>
                </div>

                <div class="flex flex-col space-y-3 text-center">
                    <label class="font-semibold bg-primary py-2 text-white">
                        Durée de collaboration
                    </label>
                    <p>
                        À {{ durations[demandPartner.duration] }}
                    </p>
                </div>

                <div class="flex flex-col space-y-3 text-center">
                    <label class="font-semibold bg-primary py-2 text-white">
                        Description
                    </label>
                    <p>
                        {{ demandPartner.description || 'Aucune description' }}
                    </p>
                </div>
            </div>
        </section>

        <div
            v-if="demandPartner && !demandPartner.has_responded"
            class="mt-16 md:mt-24"
        >
            <Button
                v-if="user?.gender == 'M'"
                class="flex justify-center items-center mx-auto w-64 md:w-96"
                @click="responseDialog = true"
            >
                Je suis intéressé
            </Button>
            <Button
                v-else
                class="flex justify-center items-center mx-auto w-64 md:w-96"
                @click="responseDialog = true"
            >
                Je suis intéressée
            </Button>
        </div>
        <div
            v-else-if="demandPartner"
            class="mt-16 md:mt-24 text-success flex justify-center mx-auto gap-3 items-center rounded-full py-4 px-3 bg-gray-100 w-64 md:w-96"
        >
            <CheckBadgeIcon class="w-8" />
            <p class="font-semibold">
                Réponse envoyée
            </p>
        </div>

        <Dialog v-model:open="responseDialog">
            <DialogContent class="sm:max-w-xl overflow-y-auto">
                <form @submit.prevent="submit">
                    <div class="flex flex-col space-y-3">
                        <label class="font-semibold text-primary">
                            * Ajouter une description (optionnel)
                        </label>
                        <Textarea
                            v-model="formData.description"
                            placeholder="Écrivez ici"
                            :rows="6"
                            class="border border-gray-300 focus:border-primary focus:ring-primary"
                        />
                    </div>

                    <div class="mt-8 flex gap-3 text-gray-700">
                        <InformationCircleIcon class="w-8" />
                        <p class="text-sm">
                            En vous proposant comme candidat pour cette demande, vous témoignez de votre volonté de collaborer et de former un binôme avec la personne qui a posté cette demande.
                        </p>
                    </div>

                    <div class="my-8">
                        <Button
                            type="submit"
                            class="flex justify-center mx-auto items-center w-64"
                            :in-progress="inProgress"
                        >
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { CheckBadgeIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
import { usePartners } from '@/composables/usePartners';
import type { User } from '~/lib/types';

const route = useRoute();
const id = route.params.id;
const user = useState<User>('user');
const responseDialog = ref(false);
const { $toast } = useNuxtApp();

const { detailDemandPartner, demandPartner, sendResponse } = usePartners();

const durations = {
    short: 'court terme',
    long: 'long terme',
};

const formData = reactive({
    userPartnerId: null as number | null,
    userInterestedId: null as number | null,
    status: 'pending' as string,
    description: '' as string,
});

await detailDemandPartner(Number(id));

const goBack = () => {
    window.history.back();
};

const { submit, inProgress } = useSubmit(async () => {
    formData.userPartnerId = demandPartner.value.id;
    formData.userInterestedId = demandPartner.value.user.id;

    const response = await sendResponse(formData);
    return response;
}, {
    onSuccess: (response) => {
        $toast({
            description: response.message,
        });
        responseDialog.value = false;
        if (demandPartner.value) {
            demandPartner.value.has_responded = true;
        }
    },
});

useHead({
    title: 'Détail de la demande',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>

<style>
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
