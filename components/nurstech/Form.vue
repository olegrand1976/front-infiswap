<template>
    <div>
        <div class="flex justify-center mb-4">
            <LayoutsNursTech class="w-40" />
        </div>

        <h2 class="text-center font-medium text-gray-700 mb-4 leading-snug">
            Votre espace digital personnel boosté par
            <span class="text-primary font-semibold text-lg">InfiSwap</span>
        </h2>

        <div class="mb-4">
            <Textarea
                v-model="description"
                class="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-primary transition"
                rows="3"
                placeholder="Votre message..."
            />
        </div>

        <p class="text-center text-[0.6rem] text-gray-500 mb-4">
            Ce formulaire vous permet de contacter directement les responsables afin de bénéficier de ce service personnalisé.
        </p>

        <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <button
                class="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition"
                @click="cancel"
            >
                Annuler
            </button>

            <button
                class="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition"
                @click="submitHistory"
            >
                Nous contacter
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { createHistory } = useNursSupp();
const { $toast } = useNuxtApp();
const emit = defineEmits(['close']);

const description = ref('');

const submitHistory = async () => {
    try {
        await createHistory({ description: description.value });
        $toast({
            description: 'Votre demande a été transmise à NursTech avec succès.',
        });
        description.value = '';
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
