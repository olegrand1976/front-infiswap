<template>
    <div>
        <div class="flex justify-center mb-4">
            <LayoutsNursAssur class="w-32" />
        </div>

        <h2 class="text-center text-gray-600 mb-6 leading-snug">
            Bénéficiez d'un conseil personnalisé avec notre
            <span class="text-primaryassur font-semibold">service d'assurances</span>
        </h2>

        <div
            v-if="!isLoggedIn"
        >
            <form
                @submit.prevent="submit"
            >
                <div>
                    <p class="text-primaryassur text-sm mt-1 font-medium">
                        Nom *
                    </p>
                    <input
                        v-model="contact.name"
                        type="text"
                        placeholder="John Doe"
                        class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-primaryassur mt-1.5"
                    >
                </div>
                <div class="mt-4">
                    <p class="text-primaryassur text-sm mt-1 font-medium">
                        Email *
                    </p>
                    <input
                        v-model="contact.email"
                        type="text"
                        placeholder="johndoe@gmail.com"
                        class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-primaryassur mt-1.5"
                    >
                </div>
                <div class="mt-4">
                    <p class="text-primaryassur text-sm mt-1 font-medium">
                        Téléphone *
                    </p>
                    <input
                        v-model="contact.phone"
                        type="text"
                        placeholder="02 374 00 00"
                        class="w-full border border-gray-300 rounded text-sm py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-primaryassur mt-1.5"
                    >
                </div>
                <div class="mt-4">
                    <p class="text-primaryassur text-sm mt-1 font-medium">
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
            <div
                class="mb-4 mt-4"
            >
                <p class="text-xs text-gray-600 mb-2 ml-2">
                    Que souhaitez-vous comme renseignements ?
                </p>

                <div
                    v-if="assurTypes.length > 0"
                    class="grid grid-cols-1 gap-2"
                >
                    <label
                        v-for="type in assurTypes"
                        :key="type.id"
                        class="flex items-center space-x-2 text-sm text-gray-700"
                    >
                        <input
                            v-model="form.types"
                            type="checkbox"
                            :value="type.id"
                            class="accent-primary"
                        >
                        <span>{{ type.label }}</span>
                    </label>
                </div>
                <p
                    v-else
                    class="text-xs text-gray-500 mt-2 ml-2"
                >
                    Chargement des types...
                </p>
            </div>
            <div class="mb-4">
                <Textarea
                    v-model="form.description"
                    placeholder="Votre message..."
                    rows="3"
                    class="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-primary transition"
                />
            </div>

            <p class="text-center text-[0.6rem] text-gray-500 mb-4">
                Ce formulaire vous permet de contacter directement les responsables afin de bénéficier de ce service personnalisé.
            </p>

            <div class="flex flex-col sm:flex-row justify-end gap-3">
                <button
                    class="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition"
                    @click="cancel"
                >
                    Annuler
                </button>

                <button
                    class="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 hover:shadow transition"
                    @click="handleContact"
                >
                    Nous contacter
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const { getAssurTypes, createAssurHistory } = useNursSupp();
const { $toast } = useNuxtApp();
const { isLoggedIn } = useAuth();

const emit = defineEmits(['close']);

const assurTypes = ref<{ id: number; label: string }[]>([]);

const form = ref({
    types: [] as number[],
    description: '',
});

onMounted(async () => {
    if (!isLoggedIn.value) {
        return;
    }

    try {
        assurTypes.value = await getAssurTypes();
    }
    catch (error) {
        $toast({
            description: 'Erreur lors du chargement des types d’assurances.', error,
            status: 'error',
            variant: 'destructive',
        });
    }
});

const handleContact = async () => {
    try {
        await createAssurHistory({
            description: form.value.description,
            types: form.value.types,
        });
        $toast({
            description: 'Votre demande a été transmise à NursAssur avec succès.',
        });
        form.value.types = [];
        form.value.description = '';
        emit('close');
    }
    catch (error) {
        $toast({
            description: error,
            status: 'error',
            variant: 'destructive',
        });
    }
};

const contact = reactive({
    name: '',
    email: '',
    phone: '',
    description: '',
    captcha: false,
});

const { submitassurContact } = useNursSupp();

const { submit, inProgress } = useSubmit(async () => {
    try {
        await submitassurContact(contact);

        $toast({
            description: 'Votre demande de contact a été transmise à NursAssur avec succès.',
        });
        emit('close');
    }
    catch (error) {
        $toast({
            description: error,
            status: 'error',
            variant: 'destructive',
        });
    }
});

const cancel = () => {
    emit('close');
};
</script>
