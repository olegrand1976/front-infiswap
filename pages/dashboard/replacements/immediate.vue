<template>
    <div class="space-y-6">
        <div class="bg-gray-100 flex px-9 rounded-lg items-center w-full h-12">
            <h1 class="text-primary">
                Remplacement immédiat
                <strong>
                    pour aujourd'hui
                </strong>
            </h1>
        </div>

        <Form @submit="submit">
            <div class="bg-gray-100 rounded-xl px-6 py-6 mx-auto max-w-xl">
                <h3 class="text-center text-lg text-primary py-4 font-bold">
                    Création remplacement
                </h3>
                <div class="space-y-4">
                    <div class="flex flex-wrap gap-6 mt-4">
                        <div class="flex-1 min-w-[250px] grid grid-cols-[40%_60%] items-center">
                            <h5 class="text-sm text-gray-700 font-medium">
                                Heure début *
                            </h5>
                            <InputTime
                                v-model="formData.startTime"
                                input-class="rounded-full"
                            />
                        </div>

                        <div class="flex-1 min-w-[250px] grid grid-cols-[40%_60%] items-center">
                            <h5 class="text-sm text-gray-700 font-medium">
                                Heure fin *
                            </h5>
                            <InputTime
                                v-model="formData.endTime"
                                input-class="rounded-full"
                            />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 xl:grid-cols-[35%_65%] border border-primary h-11 rounded-full overflow-hidden">
                        <div class="bg-primary flex items-center justify-center text-white text-sm font-medium px-4">
                            <label for="zipCode">Codes postaux *</label>
                        </div>
                        <Input
                            v-model="formData.zipCode"
                            placeholder="99333,99334"
                            class="w-full bg-white text-sm text-gray-700 focus:outline-none"
                        />
                    </div>
                </div>
                <Button
                    class="my-12 w-80 flex justify-center items-center mx-auto"
                    type="submit"
                    :in-progress="inProgress"
                >
                    Enregistrer
                </Button>
            </div>
        </Form>
    </div>
</template>

<script setup lang="ts">
import { InputTime } from '@/components/ui/input-time';

useHead({
    title: 'Remplacement rapide',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth-help', 'subscribed'],
    ssr: false,
});

const { $toast } = useNuxtApp();
const { sendUrgentReplacement } = useReplacements();

const formData = reactive({
    startTime: '',
    endTime: '',
    zipCode: '',
});

const { submit, inProgress } = useSubmit(async () => {
    try {
        $toast({
            description: 'Création du remplacement rapide effectuée',
        });
        sendUrgentReplacement(formData);
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
    catch (err) {
        console.error('Error:', err);
        $toast({
            description: 'Une erreur s\'est produite',
            status: 'error',
            variant: 'destructive',
        });
    }
});
</script>
