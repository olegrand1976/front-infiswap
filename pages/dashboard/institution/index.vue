<template>
    <div class="mb-4">
        <div class="grid md:grid-cols-2 gap-8">
            <div class="md:col-span-1 bg-white shadow rounded-lg p-8 flex gap-8 items-center">
                <LayoutsAppImage
                    :src="'/icons/plus.png'"
                    alt="Medical plus icon"
                    class="w-20 opacity-90"
                />
                <div class="space-y-8">
                    <p class="text-gray-700">
                        <span class="text-gray-900 text-lg font-bold">Besoin d’un infirmier rapidement ?</span> <br>
                        Publiez une mission et recevez des candidatures en quelques minutes.
                    </p>
                    <Button
                        class="rounded-md animate-bounce mt-6"
                        @click="handleCreateMission"
                    >
                        Publier une mission
                    </Button>
                </div>
            </div>

            <div class="md:col-span-1 grid grid-cols-2 gap-4">
                <div class="col-span-1 bg-white shadow rounded-lg p-6 space-y-1">
                    <h4 class="text-sm text-gray-500">
                        Mission en cours
                    </h4>
                    <p class="font-bold text-primary text-3xl">
                        10
                    </p>
                </div>
                <div class="col-span-1 bg-white shadow rounded-lg p-6 space-y-1">
                    <h4 class="text-sm text-gray-500">
                        Mission à pourvoir
                    </h4>
                    <p class="font-bold text-primary text-3xl">
                        8
                    </p>
                </div>
                <div class="col-span-1 bg-white shadow rounded-lg p-6 space-y-1">
                    <h4 class="text-sm text-gray-500">
                        Feuille de temps à valider
                    </h4>
                    <p class="font-bold text-primary text-3xl">
                        1
                    </p>
                </div>
                <div class="col-span-1 bg-white shadow rounded-lg p-6 space-y-1">
                    <h4 class="text-sm text-gray-500">
                        Factures en attente
                    </h4>
                    <p class="font-bold text-primary text-3xl">
                        0
                    </p>
                </div>
            </div>
        </div>

        <div class="mt-12 grid grid-cols-3 items-center">
            <div class="col-span-2">

            </div>

            <div class="col-span-1 shadow">

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
useHead({ title: 'Tableau de bord' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const router = useRouter();

const handleCreateMission = () => {
    router.push('/dashboard/institution/missions/create');
};
</script>
