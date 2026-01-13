<template>
    <form
        class="mb-12"
        @submit.prevent="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="mt-8 grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    {{ mission?.id ? 'Mettre à jour la mission' : 'Nouvelle mission' }}
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-8">
                <div class="grid sm:grid-cols-2 gap-4">
                    <InputIcon
                        v-model="startDate"
                        type="datetime-local"
                        rounded="md"
                        label="Date de début"
                        placeholder="Date de début"
                    />
                    <InputIcon
                        v-model="endDate"
                        type="datetime-local"
                        rounded="md"
                        label="Date de fin (* optionnel)"
                        placeholder="Date de fin"
                    />
                </div>

                <div>
                    <label class="text-gray-500">Service</label>
                    <Textarea
                        v-model="formData.service"
                        :rows="8"
                        class="w-full border border-gray-300 rounded-md focus-within:border-primary focus-within:border-2"
                        placeholder="Décrivez le service offert dans cette mission..."
                    />
                </div>

                <InputIcon
                    v-model="formData.required_diploma"
                    rounded="md"
                    label="Diplôme requis"
                    placeholder="Diplôme requis"
                />

                <Separator class="my-4 lg:my-10" />

                <div class="col-span-3 grid place-content-center">
                    <Button
                        type="submit"
                        class="rounded-md w-52"
                        :in-progress="inProgress"
                    >
                        {{ mission?.id ? 'Mettre à jour' : 'Créer une mission' }}
                    </Button>
                </div>
            </div>
        </div>
    </form>
</template>

<script lang="ts" setup>
import type { Mission, User } from '~/lib/types';

const props = defineProps({
    mission: {
        type: Object as PropType<Mission>,
        default: () => ({
            id: undefined,
            institution_id: undefined,
            start_date: '',
            end_date: '',
            service: '',
            status: '',
            required_diploma: '',
        }),
    },
});

const user = useState<User>('user');
const { create, update } = useMissions();

const { $toast } = useNuxtApp();

const formData = reactive({ ...props.mission });
watch(() => props.mission, (newVal) => {
    Object.assign(formData, newVal);
}, { deep: true });

function toDatetimeLocal(value?: string | null) {
    if (!value) return null;

    const date = new Date(value);
    return date.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value?: string | null) {
    if (!value) return null;

    return new Date(value).toISOString();
}

const startDate = computed({
    get() {
        return toDatetimeLocal(formData.start_date);
    },
    set(value) {
        formData.start_date = fromDatetimeLocal(value);
    },
});

const endDate = computed({
    get() {
        return toDatetimeLocal(formData.end_date);
    },
    set(value) {
        formData.end_date = fromDatetimeLocal(value);
    },
});

const resetForm = () => {
    Object.assign(formData, {
        startDate: '',
        endDate: '',
        service: '',
        requiredDiploma: '',
    });
};

const { submit, inProgress } = useSubmit(async () => {
    try {
        if (formData.id == undefined) {
            formData.institution_id = user.value.id;
            await create(formData);
            $toast({
                description: 'Mission créé avec succès',
            });

            resetForm();
        }
        else {
            await update(formData.id, formData);
            $toast({
                description: 'Mission mis à jour avec succès',
            });
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
