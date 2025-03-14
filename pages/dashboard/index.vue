<template>
    <div class="space-y-6">
        <section class="grid grid-cols-1 items-center gap-4 mt-4">
            <div class="bg-gray-100 rounded-b-lg">
                <div class="bg-primary h-8 rounded-t-lg" />

                <div class="p-4 grid grid-cols-3 gap-4">
                    <div>
                        <h4 class="text-primary font-semibold">
                            Remplacements effectués
                        </h4>
                        <div class="border-2 border-gray-200 rounded p-4 my-3">
                            <h6 class="flex items-center space-x-4 text-sm">
                                <span>Le dernier mois</span>
                                <span class="text-primary">Janvier</span>
                            </h6>
                            <div class="grid grid-cols-2 items-center gap-3 mt-3">
                                <p class="text-5xl font-semibold text-primary">
                                    {{ reports.replacement.done.count }}
                                </p>
                                <div class="w-20 h-20 rounded-full text-xl flex items-center justify-center border-8 border-primary">
                                    {{ reports.replacement.done.percentage }} %
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-primary font-semibold">
                            Nombre d'annonces passées
                        </h4>
                        <div class="border-2 border-gray-200 rounded p-4 my-3">
                            <h6 class="flex items-center space-x-4 text-sm">
                                <span>Le dernier mois</span>
                                <span class="text-primary">Janvier</span>
                            </h6>
                            <div class="grid grid-cols-2 items-center gap-3 mt-3">
                                <p class="text-5xl font-semibold text-primary">
                                    {{ reports.replacement.ignored.count }}
                                </p>
                                <div class="w-20 h-20 rounded-full text-xl flex items-center justify-center border-8 border-primary">
                                    {{ reports.replacement.ignored.percentage }}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-primary font-semibold">
                            Réponse en attente
                        </h4>
                        <div class="border-2 border-gray-200 rounded p-4 my-3">
                            <h6 class="flex items-center space-x-4 text-sm">
                                <span>Le dernier mois</span>
                                <span class="text-primary">Janvier</span>
                            </h6>
                            <div class="grid grid-cols-2 items-center gap-3 mt-3">
                                <p class="text-5xl font-semibold text-primary">
                                    {{ reports.replacement.pending.count }}
                                </p>
                                <div class="w-20 h-20 rounded-full text-xl flex items-center justify-center border-8 border-primary">
                                    {{ reports.replacement.pending.percentage }}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- <div class="bg-gray-100 h-full rounded-b-lg">
                <h2 class="bg-primary text-white p-3 rounded-t-lg">
                    Bénéfices
                </h2>
                <div class="flex items-center p-4 justify-center">
                    <p class="font-bold mt-12 text-4xl text-gray-600/50">
                        8000 €
                    </p>
                </div>
            </div> -->
        </section>

        <section class="grid grid-cols-[45%_53%] gap-4">
            <div class="flex flex-col space-y-4">
                <div class="bg-gray-100 rounded p-4">
                    <h3 class="text-primary">
                        Mes préférences
                    </h3>

                    <Form class="mt-6 space-y-4">
                        <div class="grid grid-cols-[40%_60%] border border-primary h-9 rounded-full">
                            <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                                <label for="zipCode">
                                    Code postal
                                </label>
                            </div>
                            <Input
                                v-model="formData.zipCode"
                                type="text"
                                class="w-full bg-transparent"
                            />
                        </div>
                        <div class="grid grid-cols-[40%_60%] border border-primary h-9 rounded-full">
                            <div class="bg-primary flex items-center text-white ps-4 rounded-s-full">
                                <label for="city">
                                    Ville
                                </label>
                            </div>
                            <Input
                                v-model="formData.city"
                                type="text"
                                class="w-full bg-transparent"
                            />
                        </div>
                    </Form>
                </div>

                <div class="bg-gray-100 rounded p-4">
                    <h3 class="text-primary">
                        Tournée du jour
                    </h3>

                    <div class="my-3">
                        <Table>
                            <TableHeader class="w-full">
                                <TableRow class="grid grid-cols-3 overflow-x-hidden gap-2 border border-none">
                                    <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white s">
                                        Patient
                                    </TableHead>
                                    <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white s">
                                        Code postal
                                    </TableHead>
                                    <TableHead class="bg-primary flex justify-center items-center rounded-lg text-white s">
                                        Ville
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                <template v-if="reports.tours != 0">
                                    <div
                                        v-for="(tournee, index) in reports.tours"
                                        :key="index"
                                    >
                                        <TableRow class="cursor-pointer grid grid-cols-3 gap-2 border border-none overflow-x-hidden">
                                            <TableCell class="bg-gray-100">
                                                <div class="flex h-10 rounded mt-3 bg-gray-200 justify-center items-center">
                                                    <span class="truncate w-full px-2 text-center mx-auto">
                                                        {{ tournee.lastname }} {{ tournee.firstname }}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell class="bg-gray-100">
                                                <div class="flex h-10 rounded mt-3 bg-gray-200 justify-center items-center">
                                                    <span class="truncate w-full px-2 text-center mx-auto">
                                                        {{ tournee.profile.zip_code }}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell class="bg-gray-100">
                                                <div class="flex h-10 rounded mt-3 bg-gray-200 justify-center items-center">
                                                    <span class="truncate w-full px-2 text-center mx-auto">
                                                        {{ tournee.profile.city }}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <hr class="border-t border-gray-300">
                                    </div>
                                </template>
                                <template v-else>
                                    <p class="text-center text-black/70 mt-6">
                                        Aucune tournée à afficher pour le moment
                                    </p>
                                </template>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 rounded-b-lg">
                <h3 class="text-white bg-primary p-3 rounded-t-lg">
                    Nombres d'annonces auxquelles j'ai répondu sur Infiswap par mois
                </h3>
                <div class="p-4">
                    <LineChart
                        :data="formattedData"
                        index="month"
                        :categories="['Pourcentage']"
                        :colors="['hsl(var(--primary))']"
                        :y-formatter="(tick) => `${tick} %`"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { LineChart } from '@/components/ui/chart-line';

import { useReports } from '~/composables/useReports';

const { getReports } = useReports();

const reports = await getReports();

const formData = ref({
    zipCode: '',
    city: '',
});

const formatDate = (dateString: string) => {
    const [year, month] = dateString.split('-');
    return `${month}/${year}`;
};

const formattedData = computed(() => {
    return reports.replacement.reponded_per_month.map(item => ({
        month: formatDate(item.month),
        Pourcentage: item.count,
    }));
});

onMounted(async () => {
    await getReports();
});

useHead({
    title: 'Tableau de bord',
});

definePageMeta({
    layout: 'dashboard',
    middleware: ['verified'],
    ssr: false,
});
</script>
