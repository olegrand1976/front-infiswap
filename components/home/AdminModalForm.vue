<template>
    <form @submit.prevent="submit" enctype="multipart/form-data">
        <Separator class="my-4 lg:my-10" />

        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    {{ home?.id ? 'Modification' : 'Nouvelle' }} page d'accueil
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-4">
                <InputIcon
                    v-model="form.title"
                    rounded="md"
                    label="Titre"
                    placeholder="Titre"
                />

                <div class="h-40 rounded-lg border-2 border-gray-300">
                    <Textarea
                        v-model="form.description"
                        rounded="md"
                        label="Description"
                        placeholder="Description"
                        class="w-full h-full resize-none rounded-xl p-4 bg-transparent outline-none"
                    />
                </div>

                <Select v-model="form.active" label="Statut">
                    <SelectTrigger position="right" class="rounded-md">
                        <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent class="border border-none">
                        <SelectGroup>
                            <SelectItem :value="1">
                                <span class="text-sm">Active</span>
                            </SelectItem>
                            <SelectItem :value="0">
                                <span class="text-sm">Inactive</span>
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
                    <input
                        type="file"
                        @change="onFileChange"
                        accept="image/*"
                        class="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-gray-50 file:text-gray-700
                              hover:file:bg-gray-100"
                    />
                    <p v-if="home?.image" class="mt-2 text-sm text-gray-500">
                        Image actuelle : {{ home.image }}
                        <img
                            class="w-48 h-48 object-cover object-center"
                            :src="useRuntimeConfig().public.API_URL + '/storage/' + home?.image"
                        >
                    </p>
                </div>
            </div>
        </div>

        <Separator class="my-4 lg:my-10" />

        <div class="col-span-3 grid place-content-center">
            <Button
                type="submit"
                class="rounded-md w-52"
                :in-progress="inProgress"
            >
                {{ home?.id ? 'Mettre à jour' : 'Créer' }}
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { HomeType } from '~/lib/types';
import { useRuntimeConfig } from '#app';

const props = defineProps({
    home: {
        type: Object as PropType<HomeType>,
        default: () => ({
            id: undefined,
            title: '',
            description: '',
            active: 1,
            image: null,
        }),
    },
});

const { $toast } = useNuxtApp();
const { createOrUpdate } = useHome();

const isEditMode = computed(() => !!props.home.id);

const form = reactive({ ...props.home });
watch(() => props.home, (newVal) => {
    Object.assign(form, newVal);
}, { deep: true });

const imageFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const onFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    imageFile.value = input.files?.[0] || null;
};

const resetForm = () => {
    Object.assign(form, {
        title: '',
        description: '',
        active: 1,
    });
    imageFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const { submit, inProgress } = useSubmit(async () => {
    try {
        const response = await createOrUpdate(form, imageFile.value);

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
