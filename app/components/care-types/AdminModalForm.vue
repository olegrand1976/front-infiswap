<template>
    <form
        @submit.prevent="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    {{ care?.id ? 'Modification' : 'Nouvelle' }} type de soin
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <InputIcon
                    v-model="form.name"
                    rounded="md"
                    label="Nom"
                    placeholder="Nom"
                />
                <InputIcon
                    v-model="form.duration"
                    rounded="md"
                    label="Durée"
                    placeholder="Durée"
                />
                <InputIcon
                    v-model="form.price"
                    rounded="md"
                    label="Prix"
                    placeholder="Prix"
                />
            </div>
        </div>

        <Separator class="my-4 lg:my-10" />

        <div class="col-span-3 grid place-content-center">
            <Button
                type="submit"
                class="rounded-md w-52"
                :in-progress="inProgress"
            >
                {{ care?.id ? 'Mettre à jour' : 'Créer' }}
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { CareType } from '~/lib/types';

const props = defineProps({
    care: {
        type: Object as PropType<CareType>,
        default: () => ({
            id: undefined,
            name: '',
            duration: null,
            price: null,
        }),
    },
});

const { $toast } = useNuxtApp();
const { createOrUpdate } = useCareTypes();

const isEditMode = computed(() => !!props.care.id);

const form = reactive({ ...props.care });
watch(() => props.care, (newVal) => {
    Object.assign(form, newVal);
}, { deep: true });

const resetForm = () => {
    Object.assign(form, {
        name: '',
        duration: null,
        price: null,
    });
};

const { submit, inProgress } = useSubmit(async () => {
    try {
        const response = await createOrUpdate(form);

        $toast({
            title: 'Succès !',
            description: isEditMode.value
                ? 'Contenu mis à jour avec succès'
                : 'Contenu créé avec succès',
        });

        if (!isEditMode.value) {
            resetForm();
        }
        else {
            Object.assign(form, response);
        }
    }
    catch (err) {
        console.log('erreur ', err);
        if (err.data?.errors) {
            const firstError = Object.values(err.data.errors)[0][0];
            $toast({
                description: firstError,
                status: 'error',
                variant: 'destructive',
            });
        }
    }
});
</script>
