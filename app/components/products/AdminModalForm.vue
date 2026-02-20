<template>
    <form
        @submit.prevent="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    {{ product?.id ? 'Modification' : 'Nouveau' }} produit
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
                <label
                    for="description"
                    class="text-sm font-medium text-gray-500 mt-3"
                >
                    Description
                </label>
                <Textarea
                    id="description"
                    v-model="form.description"
                    placeholder="Description du produit"
                    class="mt-[-0.6rem] h-36 p-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
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
                {{ product?.id ? 'Mettre à jour' : 'Créer' }}
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { Product } from '~/lib/types';

const props = defineProps({
    product: {
        type: Object as PropType<Product>,
        default: () => ({
            id: undefined,
            name: '',
            description: '',
        }),
    },
});

const { $toast } = useNuxtApp();
const { createOrUpdate } = useProduct();

const isEditMode = computed(() => !!props.product.id);

const form = reactive({ ...props.product });
watch(() => props.product, (newVal) => {
    Object.assign(form, newVal);
}, { deep: true });

const resetForm = () => {
    Object.assign(form, {
        name: '',
        description: '',
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
