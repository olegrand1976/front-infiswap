<template>
    <form
        class="mb-12"
        @submit.prevent="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    Nouveau tutoriel
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-5">
                <InputIcon
                    v-model="form.title"
                    rounded="md"
                    label="Titre"
                    placeholder="Titre"
                />

                <div class="flex flex-col space-y-3 text-gray-500 text-sm">
                    <label>Type de ressources</label>
                    <div class="flex gap-8 items-center">
                        <div class="flex gap-3 items-center">
                            <input
                                id="upload"
                                v-model="selectedType"
                                type="radio"
                                value="file"
                            >
                            <label
                                for="upload"
                                class="text-sm"
                            >
                                Fichier à téléverser
                            </label>
                        </div>

                        <div class="flex gap-3 items-center">
                            <input
                                id="link"
                                v-model="selectedType"
                                type="radio"
                                value="link"
                            >
                            <label
                                for="link"
                                class="text-sm"
                            >Lien externe</label>
                        </div>
                    </div>
                </div>

                <Separator />

                <div
                    v-if="selectedType === 'file'"
                    class="flex space-x-8 items-center"
                >
                    <FileUpload
                        accept="image/*, audio/*, video/*"
                        button-class="rounded-md"
                        @file-selected="tutorialFile = $event"
                    />

                    <p class="text-sm w-80 text-gray-500">
                        * Vous pouvez téléverser uniquement des fichiers audio, vidéo ou image jusqu'à la taille de 10MB
                    </p>
                </div>

                <InputIcon
                    v-if="selectedType === 'link'"
                    v-model="form.media_path"
                    rounded="md"
                    label="Lien de la ressource"
                    placeholder="Lien"
                />

                <div class="flex flex-col space-y-3 text-sm text-gray-500">
                    <label
                        for="description"
                        class="focus-within:text-primary"
                    >
                        Description
                    </label>

                    <Textarea
                        id="description"
                        v-model="form.description"
                        class="border-2 border-gray-300 text-gray-800 focus-within:border-2 focus-within:border-primary"
                        :rows="5"
                    />
                </div>

                <Separator class="my-4 lg:my-10" />

                <div class="col-span-3 grid place-content-center">
                    <Button
                        type="submit"
                        class="rounded-md w-52"
                        :in-progress="inProgress"
                    >
                        {{ tutorial?.id ? 'Mettre à jour' : 'Créer' }}
                    </Button>
                </div>
            </div>
        </div>
    </form>
</template>

<script lang="ts" setup>
import FileUpload from '~/components/ui/form/FileUpload.vue';
import { useTutorials } from '@/composables/useTutorials';

import type { Tutorial } from '~/lib/types';

const { createTutorial, getMediaTutorial, updateTutorial } = useTutorials();

const { $toast } = useNuxtApp();
const router = useRouter();

const props = defineProps({
    tutorial: {
        type: Object as PropType<Tutorial | null>,
        default: () => ({
            id: undefined,
            title: '',
            description: '',
            media_path: '',
            media_type: null,
            mimes_type: '',
        }),
    },
});

const form = reactive({ ...props.tutorial });
watch(() => props.tutorial, (newVal) => {
    Object.assign(form, newVal);
}, { deep: true });

const resetForm = () => {
    Object.assign(form, {
        id: undefined,
        title: '',
        description: '',
        media_path: '',
        media_type: null,
        mimes_type: '',
    });
};

const selectedType = ref<'file' | 'link'>('file');
const tutorialFile = ref<File | null>(null);

const loadMedia = () => {
    if (form.id != undefined && form.media_type != 'link') {
        getMediaTutorial(form.id).then((blob) => {
            const file = new File([blob], 'media', { type: blob.type });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            const input = document.getElementById('fileInput') as HTMLInputElement;
            if (input) {
                input.files = dataTransfer.files;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
};

onMounted(() => {
    loadMedia();

    if (form.media_type == 'link') {
        selectedType.value = 'link';
    }
    else {
        form.media_path = '';
    }
});

watch(selectedType, (newVal) => {
    if (newVal === 'file') {
        loadMedia();
    }
});

const { submit, inProgress } = useSubmit(async () => {
    const payload = new FormData();

    payload.append('title', form.title);
    payload.append('description', form.description);

    if (selectedType.value === 'file') {
        if (tutorialFile.value) {
            payload.append('media_type', tutorialFile.value.type.split('/')[0]);
            payload.append('file', tutorialFile.value);
        }
        else {
            $toast({
                description: 'Veuillez sélectionner un fichier.',
                variant: 'destructive',
            });
            return;
        }
    }
    else if (selectedType.value === 'link') {
        payload.append('path', form.media_path);
        payload.append('media_type', 'link');
    }

    if (form.id == undefined) {
        try {
            const result = await createTutorial(payload);

            resetForm();

            $toast({
                description: result.message,
            });

            setTimeout(() => {
                router.push('/dashboard/admin/tutorials');
            }, 2000);
        }
        catch (err) {
            if (err.data?.errors) {
                const firstError = Object.values(err.data.errors)[0][0];
                $toast({
                    description: firstError,
                    variant: 'destructive',
                });
            }
        }
    }
    else {
        payload.append('id', String(form.id));
        payload.append('_method', 'PUT');

        try {
            const result = await updateTutorial(form.id, payload);
            resetForm();

            $toast({
                description: result.message,
            });

            setTimeout(() => {
                router.push('/dashboard/admin/tutorials');
            }, 2000);
        }
        catch (err) {
            if (err.data?.errors) {
                const firstError = Object.values(err.data.errors)[0][0];
                $toast({
                    description: firstError,
                    variant: 'destructive',
                });
            }
        }
    }
});
</script>
