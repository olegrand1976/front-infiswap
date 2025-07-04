<template>
    <div>
        <div class="flex items-center justify-between w-full">
            <h1 class="flex lg:ml-20 w-full py-3 text-primary sm:bg-gray-100 sm:px-9 rounded-lg 2xl:ml-0">
                Demander <span class="ml-1 font-semibold">une collaboration</span>
            </h1>
        </div>

        <form
            class="mt-4 w-full bg-gray-50 flex flex-col mx-auto shadow p-8 rounded-lg sm:mt-8 sm:bg-white sm:w-[80%] lg:mt-20 lg:w-[65%] 2xl:w-[50%]"
            @submit.prevent="submit"
        >
            <div class="flex flex-col space-y-3">
                <label class="font-semibold text-primary">
                    * Choisir le type de demande que vous souhaitez faire
                </label>
                <div class="flex flex-col space-y-2">
                    <label>
                        <input
                            v-model="formData.type"
                            type="radio"
                            name="type"
                            value="in_search"
                            checked
                        >
                        Je suis à la recherche d’un binôme
                    </label>
                    <label>
                        <input
                            v-model="formData.type"
                            type="radio"
                            name="type"
                            value="available"
                        >
                        Je suis disponible pour collaborer
                    </label>
                </div>
            </div>

            <div class="mt-8 flex flex-col space-y-3">
                <label class="font-semibold text-primary">
                    * Sélectionner la durée de la collaboration
                </label>
                <Select v-model:model-value="formData.duration">
                    <SelectTrigger
                        position="right"
                    >
                        <SelectValue
                            placeholder="Durée de collaboration"
                            class="w-[200%] truncate"
                        />
                    </SelectTrigger>
                    <SelectContent class="border border-none">
                        <SelectGroup>
                            <SelectItem
                                v-for="[key, value] in Object.entries(durations)"
                                :key="key"
                                :value="key"
                            >
                                {{ value }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div class="mt-8 flex flex-col space-y-3">
                <label class="font-semibold text-primary">
                    * Ajouter une description (optionnel)
                </label>
                <Textarea
                    v-model="formData.description"
                    placeholder="Écrivez ici"
                    :rows="6"
                    class="border border-gray-300 focus:border-primary focus:ring-primary"
                />
            </div>

            <div class="mt-16 flex gap-2 text-gray-700">
                <InformationCircleIcon class="w-8" />
                <p class="text-sm">
                    En soumettant cette demande, vous proposez de former un binôme professionnel. Celle-ci devra être acceptée avant d’être effective.
                </p>
            </div>

            <Button
                class="mt-12 flex justify-center items-center mx-auto w-64"
                type="submit"
                :in-progress="inProgress"
            >
                Enregistrer
            </Button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { InformationCircleIcon } from '@heroicons/vue/24/outline';
import { usePartners } from '@/composables/usePartners';
import type { User } from '~/lib/types';

const user = useState<User>('user');
const { create } = usePartners();
const router = useRouter();

const { $toast } = useNuxtApp();

const durations = {
    short: 'Court terme',
    long: 'Long terme',
};

const formData = reactive({
    id: user.value.id,
    type: 'in_search',
    duration: '',
    description: '',
});

const resetForm = () => {
    formData.type = 'in_search';
    formData.duration = '';
    formData.description = '';
};

const { submit, inProgress } = useSubmit(async () => {
    await create(formData);
}, {
    onSuccess: () => {
        $toast({
            description: 'Demande de collaboration effectuée',
        });
        resetForm();
        setTimeout(() => {
            router.push('/dashboard/partners');
        }, 2000);
    },
});

useHead({
    title: 'Demander une collaboration',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth', 'verified'],
});
</script>
