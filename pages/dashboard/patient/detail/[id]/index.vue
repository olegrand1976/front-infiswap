<template>
    <div class="grid grid-cols-[40%_60%]">
        <section class="flex flex-col space-y-5">
            <div class="bg-primary p-6 rounded-xl flex flex-col space-y-3 justify-center items-center px-auto">
                <NuxtImg
                    src="/home/infirmier_homme.png"
                    alt="Profile nurse"
                    class="w-28 h-28 rounded-full"
                />
                <p class="text-white">
                    <span class="font-semibold">
                        {{ patient.lastname }}
                    </span>
                    {{ patient.firstname }}
                </p>
                <Button
                    variant="secondary"
                    class="text-primary"
                    @click="openDialog"
                >
                    Mettre à jour
                </Button>
            </div>

            <div class="bg-gray-100 rounded-b">
                <h3 class="bg-primary text-white p-6 rounded-t">
                    Information
                </h3>
            </div>
        </section>

        <section>
            .
        </section>
    </div>
</template>

<script setup>
import { detailPatient } from '~/composables/usePatients';

const route = useRoute();
const patientId = route.params.id;

const { patient, fetchDetailPatient } = detailPatient(patientId);

const isOpenDialog = ref(false);

const openDialog = () => {
    isOpenDialog.value = true;
};

const closeDialog = () => {
    isOpenDialog.value = false;
};

useHead({
    title: 'Editer le profil',
});

onMounted(() => {
    fetchDetailPatient();
});

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});
</script>
