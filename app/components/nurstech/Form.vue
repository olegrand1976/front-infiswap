<template>
    <div>
        <div class="flex justify-center mb-4">
            <LayoutsNursTech class="w-40" />
        </div>

        <h2 class="text-center text-gray-600 mb-4 leading-snug">
            Votre espace digital personnel boosté par
            <span class="text-primary font-semibold text-lg">InfiSwap</span>
        </h2>
        <div
            v-if="!isLoggedIn"
        >
            <form
                @submit.prevent="submit"
            >
                <div>
                    <p class="text-primary text-sm mt-1 font-medium">
                        Nom *
                    </p>
                    <input
                        v-model="contact.name"
                        type="text"
                        placeholder="John Doe"
                        class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-1.5"
                        @focus="onFirstFocus"
                    >
                </div>
                <div class="mt-4">
                    <p class="text-primary text-sm mt-1 font-medium">
                        Email *
                    </p>
                    <input
                        v-model="contact.email"
                        type="text"
                        placeholder="johndoe@gmail.com"
                        class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-1.5"
                    >
                </div>
                <div class="mt-4">
                    <p class="text-primary text-sm mt-1 font-medium">
                        Téléphone *
                    </p>
                    <input
                        v-model="contact.phone"
                        type="text"
                        placeholder="02 374 00 00"
                        class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-primary mt-1.5"
                    >
                </div>
                <div class="mt-4">
                    <p class="text-primary text-sm mt-1 font-medium">
                        Description *
                    </p>
                    <textarea
                        v-model="contact.description"
                        rows="4"
                        placeholder="votre message . . ."
                        class="w-full border border-gray-300 rounded text-sm p-2 focus:outline-none focus:ring-1 focus:ring-primary mt-1.5"
                    />
                </div>
                <div class="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <button
                        class="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition"
                        type="button"
                        @click="cancel"
                    >
                        Annuler
                    </button>

                    <Button
                        type="submit"
                        :in-progress="inProgress"
                        class="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 hover:shadow transition"
                    >
                        Nous contacter
                    </Button>
                </div>
            </form>
        </div>
        <div
            v-else
        >
            <div class="mb-4">
                <Textarea
                    v-model="contact.description"
                    class="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-primary transition"
                    rows="3"
                    placeholder="Votre message..."
                    @focus="onFirstFocus"
                />
            </div>

            <p class="text-center text-[0.6rem] text-gray-500 mb-4">
                Ce formulaire vous permet de contacter directement les responsables afin de bénéficier de ce service personnalisé.
            </p>

            <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                    class="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition"
                    type="button"
                    @click="cancel"
                >
                    Annuler
                </button>

                <Button
                    :in-progress="inProgressLoggedIn"
                    class="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition"
                    @click="submitLoggedIn"
                >
                    Nous contacter
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { User } from '~/lib/types';

const { submitContact } = useService();
const { $toast } = useNuxtApp();
const { trackPartnerFormStartOnce, trackPartnerFormSubmit } = usePartnerServices();
const { onFirstFocus } = trackPartnerFormStartOnce('nurstech', 'dashboard_modal');
const emit = defineEmits(['close']);
const { isLoggedIn } = useAuth();
const user = useState<User | null>('user');

const contact = reactive({
    product: 'NursTech',
    name: '',
    email: '',
    phone: '',
    description: '',
    captcha: false,
});

function prefillFromUser() {
    if (!user.value) {
        return;
    }

    contact.name = user.value.full_name ?? `${user.value.firstname ?? ''} ${user.value.lastname ?? ''}`.trim();
    contact.email = user.value.email ?? '';
    contact.phone = user.value.phone_number ?? '';
}

onMounted(() => {
    prefillFromUser();
});

const { submit, inProgress } = useSubmit(async () => {
    try {
        trackPartnerFormSubmit('nurstech', 'dashboard_modal_guest');
        await submitContact(contact);

        $toast({
            description: 'Votre demande de contact a été transmise à NursTech avec succès.',
        });
        emit('close');
    }
    catch (error) {
        const message = error?.data?.message || error?.message || 'Une erreur est survenue.';
        $toast({
            description: message,
            status: 'error',
            variant: 'destructive',
        });
    }
});

const { submit: submitLoggedIn, inProgress: inProgressLoggedIn } = useSubmit(async () => {
    try {
        prefillFromUser();
        trackPartnerFormSubmit('nurstech', 'dashboard_modal');
        await submitContact(contact);

        $toast({
            description: 'Votre demande de contact a été transmise à NursTech avec succès.',
        });
        contact.description = '';
        emit('close');
    }
    catch (error) {
        const message = error?.data?.message || error?.message || 'Une erreur est survenue.';
        $toast({
            description: message,
            status: 'error',
            variant: 'destructive',
        });
    }
});

const cancel = () => {
    emit('close');
};
</script>
