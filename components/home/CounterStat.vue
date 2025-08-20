<template>
    <div>
        <div class="bg-white py-24 sm:py-32">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div class="mx-auto max-w-2xl lg:max-w-none">
                    <div class="text-center">
                        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Enfin la platerome ...
                        </h2>
                        <p class="mt-4 text-lg leading-8 text-gray-600">
                            Notre plateforme est reconnue et utilisée par des organisations du monde entier pour améliorer la productivité, optimiser les opérations et enrichir l’expérience client.
                        </p>
                    </div>
                    <dl class="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                        <div class="flex flex-col bg-gray-200/50 p-8">
                            <dt class="text-sm font-semibold leading-6 text-gray-600">
                                Inscriptions de la semaine
                            </dt>
                            <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">
                                {{ counts.registration }}
                            </dd>
                        </div>
                        <div class="flex flex-col bg-gray-200/50 p-8">
                            <dt class="text-sm font-semibold leading-6 text-gray-600">
                                Annonces de la semaine
                            </dt>
                            <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">
                                {{ counts.announce }}
                            </dd>
                        </div>
                        <div class="flex flex-col bg-gray-200/50 p-8">
                            <dt class="text-sm font-semibold leading-6 text-gray-600">
                                Infirmièr(e)
                            </dt>
                            <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">
                                {{ counts.nurses }}
                            </dd>
                        </div>
                        <div
                            v-if="counts.midwife + counts.caregiver >0"
                            class="flex flex-col bg-gray-200/50 p-8"
                        >
                            <dt class="text-sm font-semibold leading-6 text-gray-600">
                                S.Femmes & A.Soignant(e)
                            </dt>
                            <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">
                                {{ counts.midwife + counts.caregiver }}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useHome } from '@/composables/useHome';

const counts = await useHome().count();
</script>
