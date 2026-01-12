<template>
    <form
        class="mb-12"
        @submit.prevent="submit"
    >
        <Separator class="my-4 lg:my-10" />

        <div class="mt-8 grid grid-cols-3 gap-4 lg:gap-8">
            <div class="p-4 hidden lg:block">
                <h1 class="font-semibold text-gray-600">
                    Nouvelle mission
                </h1>
                <p class="mt-2 text-md text-gray-500">
                    Les informations à compléter
                </p>
            </div>

            <div class="col-span-3 lg:col-span-2 bg-white p-4 rounded-md flex flex-col gap-8">
                <div class="grid sm:grid-cols-2 gap-4">
                    <InputIcon
                        v-model="formData.startDate"
                        type="datetime-local"
                        rounded="md"
                        label="Date de début"
                        placeholder="Date de début"
                    />
                    <InputIcon
                        v-model="formData.endDate"
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
                    v-model="formData.requiredDiploma"
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
                        Créer une mission
                    </Button>
                </div>
            </div>
        </div>
    </form>
</template>

<script lang="ts" setup>
import type { User } from '~/lib/types';

const user = useState<User>('user');
const { create } = useMissions();

const { $toast } = useNuxtApp();

const formData = reactive({
    institutionId: user.value.id || null,
    startDate: '',
    endDate: '',
    service: '',
    requiredDiploma: '',
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
        formData.institutionId = user.value.id;
        await create(formData);
        $toast({
            description: 'Mission créé avec succès',
        });

        resetForm();
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
