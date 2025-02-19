<template>
    <NuxtLayout name="guest">
        <template #title>
            Mon <strong>Planning</strong>
        </template>
        <template #logo>
            <LayoutsLogo class="w-96 md:w-80" />
        </template>

        <section class="grid grid-cols-2 gap-24 items-center pt-40 pb-24 container">
            <div>
                <NuxtImg
                    src="/home/Rectangle_24.png"
                    alt="Planning"
                    class="rounded-lg"
                />
            </div>

            <div class="text-primary flex flex-col space-y-8">
                <div>
                    <h2 class="text-3xl">
                        <strong>Le module "Planning"</strong> <br>
                        de notre plateforme
                    </h2>
                    <h2 class="text-xl text-black/90 font-bold mt-4">
                        Offre une solution en ligne intuitive
                    </h2>
                </div>

                <p class="text-gray-700 mt-4 leading-relaxed">
                    Offre une solution en ligne intuitive pour les bureaux de tarification
                    et les infirmiers indépendants, simplifiant la gestion des tournées et
                    des agences. Accessible depuis un PC ou un smartphone, ce module
                    garantit une organisation efficace, où que vous soyez.
                </p>

                <Button class="mt-4 w-40">
                    Contactez-nous
                </Button>
            </div>
        </section>

        <section class="container grid grid-cols-[5%_50%_40%] gap-x-12 py-16">
            <div class="relative bg-primary text-primary w-1 h-[58rem] mt-6">
                <div
                    v-for="n in 5"
                    :key="n"
                    class="absolute -left-3 w-6 h-6 rounded-full bg-primary"
                    :style="{ top: `${(n - 1) * 21.5}%` }"
                />
            </div>

            <div>
                <h3 class="-mt-20 text-primary text-3xl">
                    <strong>Fonctionnalités clés</strong> <br>
                    du module "Planning"
                </h3>

                <div
                    v-for="(card, index) in cards"
                    :key="index"
                    class="mt-6"
                >
                    <Card class="bg-gray-100 hover:bg-transparent hover:scale-100 cursor-default mb-6">
                        <CardHeader class="p-4 rounded-lg text-primary font-bold">
                            <CardTitle>
                                {{ card.title }}
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="p-4 text-sm text-black">
                            <p>
                                {{ card.content }}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-y-4 container">
                <div>
                    <NuxtImg
                        src="/home/nurse_with_pink_bg.png"
                        alt="Infirmière faisant un planning"
                    />
                </div>

                <div class="border border-gray-200">
                    <h3 class="bg-primary text-white p-4 rounded-t-lg text-center font-bold">
                        SOUSCRIRE
                    </h3>
                    <div class="p-4 text-sm">
                        <p class="text-center">
                            Inscrivez-vous à notre newsletter pour recevoir nos futures communications.
                            Vous pouvez vous désabonner à tout moment. Pour en savoir plus sur notre
                            politique de protection des données.
                            <NuxtLink
                                to="/"
                                class="text-primary"
                            >
                                Cliquez-ici
                            </NuxtLink>
                        </p>
                        <div class="mt-8 bg-primary w-full rounded-full h-10">
                            <Form class="flex justify-between">
                                <FormField name="email">
                                    <FormItem class="flex rounded-full border border-transparent">
                                        <FormControl>
                                            <div class="flex items-center">
                                                <EnvelopeIcon class="text-white w-5 h-5 ms-4" />
                                                <Input
                                                    v-model="email"
                                                    placeholder="Email"
                                                    class="text-sm text-white bg-transparent placeholder:text-white lg:w-80 sm:w-64"
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                </FormField>
                                <Button
                                    variant="secondary"
                                    type="submit"
                                    class="mt-0.5 -ml-24 text-primary"
                                >
                                    Enregistrer
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>

                <div>
                    <NuxtImg
                        src="/home/cc62cd9.png"
                        alt="Infirmière avec un homme agé"
                        class="rounded-xl w-full xl:h-80 xl:object-cover"
                    />
                </div>
            </div>
        </section>

        <section class="mt-16 container">
            <Accordion
                type="single"
                class="space-y-6 w-full"
                collapsible
                :default-value="defaultValue"
            >
                <AccordionItem
                    v-for="item in accordionItems"
                    :key="item.value"
                    :value="item.value"
                >
                    <AccordionTrigger class="bg-primary text-white p-4 rounded-md">
                        {{ item.title }}
                    </AccordionTrigger>
                    <AccordionContent class="w-full p-3">
                        <p class="font-semibold mb-3">
                            {{ item.text }}
                        </p>
                        <ul>
                            <li
                                v-for="(subitem, key) in item.content"
                                :key="key"
                                class="mb-2 list-disc"
                            >
                                {{ subitem }}
                            </li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>

        <div class="container">
            <div class="my-8 w-full bg-primary h-64 flex items-center justify-center rounded-xl container">
                <h4 class="text-white text-center px-96">
                    Simplifiez vos tournées, restez connectés et offrez un service optimal grâce au module "Planning", disponible partout, à tout moment.
                </h4>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { EnvelopeIcon } from '@heroicons/vue/24/solid';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const cards = [
    {
        title: 'Création et gestion des tournées',
        content: 'Planifiez vos tournées selon vos plages horaires: matin, midi, soir. Définissez les heures de début et de fin théoriques pour chaque passage, en optimisant les déplacements. Ajoutez les détails des visites: nom et adresse des patients, type de soin à pratiquer (exemple: pansement, injection, perfusion, etc.)',
    },
    {
        title: 'Tableau de bord interactif',
        content: 'Visualisez l\'ensemble des tournées sur une période définie (jour, semaine, mois). Accédez aux informations détaillées des patients en un clic pour une organisation fluide. Modification en temps réel avec notifications automatiques en cas de changements.',
    },
    {
        title: 'Agenda synchronisé et mobile-friendly',
        content: 'Synchronisez vos tournées avec un agenda personnel pour y accéder en permanence. Compatible sur PC et smartphone, la plateforme permet aux infirmiers de consulter leur planning, même en déplacement. Notifications sur mobile pour rappeler les horaires ou signaler des modifications de dernière minute.',
    },
    {
        title: 'Personnalisation avancée',
        content: 'Paramétrez chaque tournée selon vos besoins (durée des soins, distances, contraintes spécifiques). Dupliquez des tournées récurrentes pour un gain de temps significatif. Gérez les absences ou disponibilités directement via la plateforme',
    },
    {
        title: 'Collaboration fluide',
        content: 'Les bureaux de tarification peuvent attribuer, modifier ou réorganiser les tournées en temps réel pour les infirmiers affiliés. Suivi simplifié de l\'exécution des tournées avec une traçabilité complète.',
    },
];

const accordionItems = [
    {
        value: 'item-1',
        title: 'Avantage pour les infirmiers et bureaux de tarification',
        text: '',
        content: [
            'Accessibilité 24/7: Disponible en version PC & mobile, le module s\'adapte aux besoins des professionnels, qu\'ils soient au bureau ou sur le terrain.',
            'Organisation optimale: une planification détaillée pour éviter les chevauchements ou oublis de soins',
            'Réactivité: gestion en temps réel rapidement des changements ou des imprévus.',
            'Conformité et traçabilité: Archivage sécurisé des données liées aux tournées pour des audits ou contrôles éventuels',
        ],
    },
    {
        value: 'item-2',
        title: 'Un Outil Moderne et Performant au Service des Soins',
        text: 'Grâce au module "Planning", vous bénéficiez d’une solution tout-en-un pour :',
        content: [
            'Améliorer la qualité de service auprès des patients, avec des horaires respectés et des soins bien coordonnés.',
            'Optimiser le temps et les trajets des infirmiers, augmentant ainsi leur efficacité.',
            'Travailler sans contrainte d’emplacement, grâce à une plateforme accessible sur PC et mobile.',
        ],
    },
];

useHead ({
    title: 'Mon planning',
});
</script>
