<template>
    <form @submit.prevent="submit">
        <Separator class="my-4 lg:my-10" />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 px-4 lg:px-0">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    {{ institution?.id ? 'Modification' : 'Nouvelle' }} institution
                </h1>
                <p class="mt-2 text-sm text-gray-500">
                    Les informations à compléter
                </p>
            </div>
            <div class="col-span-1 lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-sm flex flex-col gap-4">
                <InputIcon
                    v-model="form.name"
                    rounded="md"
                    label="Nom de l'institution"
                    placeholder="Nom de l'institution"
                />
            </div>
        </div>

        <Separator class="my-4 lg:my-10" />
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 px-4 lg:px-0">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    Services
                </h1>
                <p class="mt-2 text-sm text-gray-500">
                    Services rattachés à cette institution
                </p>
            </div>

            <div class="col-span-1 lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-sm flex flex-col gap-4">
                <p class="font-semibold text-gray-600 text-sm lg:hidden">
                    Services
                </p>

                <div
                    v-if="services.length"
                    class="flex flex-col gap-3"
                >
                    <div
                        v-for="(service, i) in services"
                        :key="service.id ?? i"
                        class="relative flex flex-col gap-3 border border-gray-100 rounded-xl p-4 bg-gray-50/50"
                    >
                        <span class="absolute top-3 right-3 text-[10px] font-bold text-gray-300">#{{ i + 1 }}</span>
                        <InputIcon
                            v-model="service.name"
                            rounded="md"
                            label="Nom du service"
                            placeholder="Nom du service"
                        />
                        <div class="flex items-end gap-2">
                            <InputIcon
                                v-model="service.phone_number"
                                rounded="md"
                                label="Téléphone (optionnel)"
                                placeholder="Ex: 01 23 45 67 89"
                                class="flex-1"
                            />
                            <button
                                type="button"
                                class="mb-0.5 p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                                title="Supprimer ce service"
                                @click="removeService(i)"
                            >
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <p
                    v-else
                    class="text-sm text-gray-400 italic"
                >
                    Aucun service pour l'instant.
                </p>

                <Button
                    type="button"
                    variant="outline"
                    class="rounded-lg w-full sm:w-fit"
                    @click="addService"
                >
                    <CirclePlus class="w-4 h-4 mr-2" />
                    Ajouter un service
                </Button>
            </div>
        </div>

        <Separator class="my-4 lg:my-10" />
        <div class="px-4 lg:px-0 grid place-content-center pb-6">
            <Button
                type="submit"
                class="rounded-xl w-full sm:w-52 h-11"
                :in-progress="inProgress"
            >
                {{ institution?.id ? 'Mettre à jour' : 'Créer' }}
            </Button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { CirclePlus, Trash2 } from 'lucide-vue-next';
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PropType } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import type { Institution, InstitutionService } from '~/lib/types';

const props = defineProps({
    institution: {
        type: Object as PropType<Institution | null>,
        default: () => ({
            id: undefined,
            name: '',
        }),
    },
});
const { createOrUpdate, syncServices } = useInstitutions();

const isEditMode = computed(() => !!props.institution?.id);

const form = reactive({
    id: props.institution?.id,
    name: props.institution?.name ?? '',
});

const services = reactive<Partial<InstitutionService>[]>(
    props.institution?.services ? [...props.institution.services] : [],
);

watch(
    () => props.institution,
    (newVal) => {
        Object.assign(form, { id: newVal?.id, name: newVal?.name ?? '' });
        services.splice(0, services.length, ...(newVal?.services ?? []));
    },
    { deep: true },
);

const addService = () => services.push({ name: '', phone_number: '' });
const removeService = (index: number) => services.splice(index, 1);

const resetForm = () => {
    Object.assign(form, { id: undefined, name: '' });
    services.splice(0, services.length);
};

const { submit, inProgress } = useSubmit(async () => {
    try {
        const response = await createOrUpdate(form);
        const institutionId = response?.data?.id ?? form.id;

        if (institutionId && services.length) {
            await syncServices(institutionId, services);
        }

        toast.success(isEditMode.value
            ? 'Institution mise à jour avec succès'
            : 'Institution créée avec succès');

        if (!isEditMode.value) {
            resetForm();
        }
        else {
            Object.assign(form, response?.data);
        }
    }
    catch (err: any) {
        console.error(err);
        if (err?.data?.errors) {
            const firstError = Object.values(err.data.errors)[0] as string[];
            toast.error(firstError[0]);
        }
    }
});
</script>
