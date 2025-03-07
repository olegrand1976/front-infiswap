<template>
    <div class="space-y-6">
        <section class="grid grid-cols-[80%_18%] items-center gap-4 mt-4">
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
                                    26
                                </p>
                                <div class="w-20 h-20 rounded-full text-xl flex items-center justify-center border-8 border-primary">
                                    75%
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
                                    26
                                </p>
                                <div class="w-20 h-20 rounded-full text-xl flex items-center justify-center border-8 border-primary">
                                    75%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-primary font-semibold">
                            Taux de satisfaction
                        </h4>
                        <div class="border-2 border-gray-200 rounded p-4 my-3">
                            <h6 class="flex items-center space-x-4 text-sm">
                                <span>Le dernier mois</span>
                                <span class="text-primary">Janvier</span>
                            </h6>
                            <div class="grid grid-cols-2 items-center gap-3 mt-3">
                                <p class="text-5xl font-semibold text-primary">
                                    26
                                </p>
                                <div class="w-20 h-20 rounded-full text-xl flex items-center justify-center border-8 border-primary">
                                    75%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-100 h-full rounded-b-lg">
                <h2 class="bg-primary text-white p-3 rounded-t-lg">
                    Bénéfices
                </h2>
                <div class="flex items-center p-4 justify-center">
                    <p class="font-bold mt-12 text-4xl text-gray-600/50">
                        8000 €
                    </p>
                </div>
            </div>
        </section>

        <section class="grid grid-cols-[35%_63%] gap-4">
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

            <div class="bg-gray-100 rounded-b-lg">
                <h3 class="text-white bg-primary p-3 rounded-t-lg">
                    Nombres d'annonces auxquelles j'ai répondu sur Infiswap par mois
                </h3>
                <div class="p-4">
                    <LineChart
                        :data="chartData"
                        index="month"
                        :categories="['Pourcentage']"
                        :colors="['hsl(var(--primary))']"
                        :y-formatter="(tick) => `${tick} %`"
                        :x-axis="{
                            tickFormat: (value, index) => {
                                const monthPoints = chartData.filter(point => point.month === value);
                                const firstPointOfMonth = monthPoints[0];
                                return firstPointOfMonth === chartData[index] ? value : '';
                            },
                        }"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { LineChart } from '@/components/ui/chart-line';

const formData = ref({
    zipCode: '',
    city: '',
});

const rawData = [
    {
        month: 'Jan 2025',
        weeks: [3, 4.2, 4.4, 5],
    },
    {
        month: 'Fév 2025',
        weeks: [3.4, 2.6, 6, 4],
    },
    {
        month: 'Mar 2025',
        weeks: [3.2, 4.6, 5.4, 4.8],
    },
    {
        month: 'Avr 2025',
        weeks: [3.8, 4.4, 5.2, 4.6],
    },
    {
        month: 'Mai 2025',
        weeks: [3.6, 4.8, 5.6, 4.2],
    },
    {
        month: 'Juin 2025',
        weeks: [3.4, 4.2, 5.4, 4.4],
    },
    {
        month: 'Juil 2025',
        weeks: [3.2, 4.6, 5.2, 4.8],
    },
];

const chartData = ref(
    rawData.flatMap(entry =>
        entry.weeks.map(week => ({
            month: entry.month,
            Pourcentage: week,
        })),
    ),
);

useHead({
    title: 'Tableau de bord',
});

definePageMeta({
    layout: 'dashboard',
});
</script>
