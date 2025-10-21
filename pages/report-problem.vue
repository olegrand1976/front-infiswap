<template>
    <NuxtLayout name="guest-with-title">
        <template #title>
            <p class="md:mt-2 font-bold">
                Reporter un problème
            </p>
        </template>

        <form
            class="mb-16 md:mb-0 md:mt-10 mx-8 max-w-2xl md:mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-100"
            @submit.prevent="submit"
        >
            <div>
                <Textarea
                    v-model="formData.message"
                    rows="6"
                    placeholder="Décrivez votre problème ici..."
                    class="w-full border border-gray-300 focus-within:border-primary transition rounded-lg p-3"
                />
            </div>

            <div class="flex justify-center">
                <Button
                    type="submit"
                    :in-progress="inProgress"
                    class="mt-4 w-64 bg-primary text-white font-medium shadow hover:bg-primary/90 transition flex justify-center"
                >
                    Soumettre
                </Button>
            </div>

            <p class="text-xs text-gray-600 text-center mt-4">
                Votre rapport sera traité dans les plus brefs délais. Merci pour votre contribution.
            </p>
        </form>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { useMail } from '~/composables/useMail';

useHead({
    title: 'Reporter un problème',
    meta: [{ name: 'description', content: 'Décrivez brièvement le souci rencontré afin que notre équipe puisse l’analyser.' }],
});

definePageMeta({
    layout: false,
});

const token = ref('');
const { reportErrorUser } = useMail();
const { $toast } = useNuxtApp();

const formData = reactive({
    token: '',
    message: '',
});

let response = null;

const { submit, inProgress } = useSubmit(async () => {
    response = await reportErrorUser(formData);
}, {
    onSuccess: () => {
        $toast({
            description: response?.message,
        });

        formData.message = '';
    },
    onError: () => {
        $toast({
            variant: 'destructive',
            description: response,
        });
    },
});

onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    token.value = params.get('token');
    formData.token = token.value;
});
</script>
