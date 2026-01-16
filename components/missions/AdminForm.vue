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
                        type="date"
                        rounded="md"
                        label="Date de début"
                        placeholder="Date de début"
                    />
                    <InputIcon
                        v-model="endDate"
                        type="date"
                        rounded="md"
                        label="Date de fin (* optionnel)"
                        placeholder="Date de fin"
                    />
                </div>

                <div class="space-y-3">
                    <label class="text-gray-500">
                        Horaire
                    </label>

                    <div class="flex gap-6 items-center">
                        <InputTime
                            v-model="formData.time_start_at"
                            class="w-full"
                            input-class="rounded-md"
                        />
                        <p>
                            à
                        </p>
                        <InputTime
                            v-model="formData.time_end_at"
                            class="w-full"
                            input-class="rounded-md"
                        />
                    </div>
                </div>

                <div class="space-y-3">
                    <label class="text-gray-500">
                        Associer à un service
                    </label>

                    <Select v-model="formData.service_id">
                        <SelectTrigger
                            class="flex w-full space-x-4 text-sm justify-start items-center rounded-md border-2 border-gray-300 disabled:opacity-100 disabled:cursor-default"
                            position="right"
                        >
                            <BriefcaseIcon class="text-gray-500 w-9 h-9 sm:w-7 sm:h-7" />
                            <SelectValue
                                placeholder="Service"
                                class="text-nowrap w-full text-sm ml-3 my-auto"
                            />
                        </SelectTrigger>
                        <SelectContent class="border border-none">
                            <SelectGroup>
                                <div
                                    v-for="service in dataServices"
                                    :key="service.id"
                                    class="flex justify-center items-center -ms-3"
                                >
                                    <SelectItem :value="service.id">
                                        <span class="xl:text-sm sm:text-xs">{{ service.name }}</span>
                                    </SelectItem>
                                </div>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label class="text-gray-500">Description</label>
                    <Textarea
                        v-model="formData.description"
                        :rows="8"
                        class="w-full border border-gray-300 rounded-md focus-within:border-primary focus-within:border-2"
                        placeholder="Décrivez la mission..."
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
import { BriefcaseIcon } from '@heroicons/vue/24/outline';
import type { Mission, User } from '~/lib/types';

const props = defineProps({
    mission: {
        type: Object as PropType<Mission>,
        default: () => ({
            id: undefined,
            institution_id: undefined,
            service_id: undefined,
            start_date: '',
            end_date: '',
            time_start_at: '',
            time_end_at: '',
            description: '',
            status: '',
            required_diploma: '',
        }),
    },
});

const user = useState<User>('user');
const { create, update } = useMissions();
const { getAll, services } = useInstitutionServices();

const dataServices = computed(() => services.value.data ?? []);

await getAll(1, 50);

const { $toast } = useNuxtApp();

const formData = reactive({ ...props.mission });
watch(() => props.mission, (newVal) => {
    Object.assign(formData, newVal);
}, { deep: true });

function toDateLocal(value?: string | null) {
    if (!value) return null;

    const date = new Date(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function fromDateLocal(value?: string | null) {
    if (!value) return null;

    return value;
}

const startDate = computed({
    get() {
        return toDateLocal(formData.start_date);
    },
    set(value) {
        formData.start_date = fromDateLocal(value);
    },
});

const endDate = computed({
    get() {
        return toDateLocal(formData.end_date);
    },
    set(value) {
        formData.end_date = fromDateLocal(value);
    },
});

const resetForm = () => {
    Object.assign(formData, {
        start_date: '',
        end_date: '',
        time_start_at: '',
        time_end_at: '',
        description: '',
        required_diploma: '',
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
