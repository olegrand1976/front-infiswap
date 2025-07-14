<template>
    <div class="max-w-sm mx-auto mt-10">
        <div class="flex justify-center mb-4">
            <LayoutsNursAssur class="w-32" />
        </div>

        <h2 class="text-center text-lg font-medium text-gray-700 mb-6 leading-snug">
            Bénéficiez d'un conseil personnalisé avec notre
            <span class="text-cyan-500 font-semibold">service d'assurances</span>
        </h2>

        <div class="mb-4">
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

            <p class="text-xs text-gray-500 mt-2 ml-2">
                Types sélectionnés :
                <span class="font-medium">{{ displayType }}</span>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const { getAssurTypes, createAssurHistory } = useNursSupp();
const { $toast } = useNuxtApp();
const emit = defineEmits(['close']);

const assurTypes = ref<{ id: number; label: string }[]>([]);

const form = ref({
    types: [] as number[],
    description: '',
});

const displayType = computed(() => {
    if (form.value.types.length === 0) {
        return 'Aucun type sélectionné';
    }
    return form.value.types
        .map(typeId => assurTypes.value.find(type => type.id === typeId)?.label || typeId)
        .join(', ');
});

onMounted(async () => {
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

const cancel = () => {
    emit('close');
};
</script>
