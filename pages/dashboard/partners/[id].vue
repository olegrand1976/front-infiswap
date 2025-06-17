<template>
    <div>
        <Button
            class="text-sm w-24 sm:w-auto"
            @click="goBack"
        >
            <span class="text-xs">Retour</span>
        </Button>

        <section className="mt-8 flex justify-center mx-auto 2xl:gap-32">
            <div class="w-96">
                <UsersCard
                    class="max-w-lg"
                    :user="demandPartner.user"
                    :show-full-info="true"
                />
            </div>

            <div class="flex flex-col space-y-16 bg-gray-200 shadow rounded-md w-96">
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
                        {{ demandPartner.description }}
                    </p>
                </div>
            </div>
        </section>

        <div
            v-if="!demandPartner.has_responded"
            class="mt-24"
        >
            <Button
                v-if="user.gender == 'M'"
                class="flex justify-center items-center mx-auto w-96"
                @click="responseDialog = true"
            >
                Je suis intéressé
            </Button>
            <Button
                v-else
                class="flex justify-center items-center mx-auto w-96"
                @click="responseDialog = true"
            >
                Je suis intéressée
            </Button>
        </div>
        <div
            v-else
            class="mt-24 text-success flex justify-center mx-auto gap-3 items-center rounded-full py-4 px-3 bg-gray-100 w-96"
        >
            <CheckBadgeIcon class="w-8" />
            <p class="font-semibold">
                Réponse envoyée
            </p>
        </div>

        <Dialog v-model:open="responseDialog">
            <DialogContent
                class="sm:max-w-xl overflow-y-auto"
            >
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
import { CheckBadgeIcon } from '@heroicons/vue/24/outline';
import { usePartners } from '@/composables/usePartners';
import type { User } from '~/lib/types';

const { detailDemandPartner, demandPartner, sendResponse } = usePartners();

const route = useRoute();
const id = route.params.id;
const user = useState<User>('user');
const responseDialog = ref(false);
let response = null;

const goBack = () => {
    window.history.back();
};

const { $toast } = useNuxtApp();

onMounted(async () => {
    await detailDemandPartner(Number(id));
});

const durations = {
    short: 'court terme',
    long: 'long terme',
};

const formData = reactive({
    userPartnerId: null,
    userInterestedId: null,
    status: 'pending',
    description: '',
});

const { submit, inProgress } = useSubmit(async () => {
    formData.userPartnerId = demandPartner.value.id;
    formData.userInterestedId = demandPartner.value.user.id;

    response = await sendResponse(formData);
}, {
    onSuccess: () => {
        $toast({
            description: response.message,
        });
        responseDialog.value = false;
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
