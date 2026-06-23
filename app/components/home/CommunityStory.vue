<script setup lang="ts">
import { Sparkles, ShieldCheck, UsersRound } from 'lucide-vue-next';

const { copy } = usePlatformStats();
</script>

<template>
    <section
        class="py-14 sm:py-20"
        aria-labelledby="community-story-title"
    >
        <div class="container mx-auto px-4 sm:px-6">
            <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-[#4caf7d] via-[#7bc67e] to-primary shadow-xl">
                <div class="grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12 lg:py-14">
                    <div class="text-white">
                        <div class="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                            <Sparkles
                                class="h-4 w-4"
                                aria-hidden="true"
                            />
                            {{ copy.badgeHint }}
                        </div>

                        <h2
                            id="community-story-title"
                            class="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl"
                        >
                            {{ copy.communityTitle }}
                        </h2>

                        <p class="mt-4 text-base leading-relaxed text-white/95 sm:text-lg">
                            {{ copy.communityLead }}
                        </p>

                        <p class="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
                            {{ copy.communityBody }}
                        </p>

                        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button
                                href="/register"
                                class="rounded-full bg-white px-6 py-3 text-primary hover:bg-white/90"
                            >
                                {{ copy.communityCta }}
                            </Button>
                            <Button
                                variant="outline"
                                href="/about"
                                class="rounded-full border-white/60 bg-transparent px-6 py-3 text-white hover:bg-white/10 hover:text-white"
                            >
                                En savoir plus
                            </Button>
                        </div>
                    </div>

                    <div class="grid gap-4">
                        <div class="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                            <div class="mb-3 flex items-center gap-3 text-white">
                                <ShieldCheck
                                    class="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                />
                                <p class="font-semibold">
                                    Profils vérifiés & messagerie sécurisée
                                </p>
                            </div>
                            <p class="text-sm leading-relaxed text-white/85">
                                Une plateforme pensée pour la continuité des soins, avec des échanges fiables entre professionnels de terrain.
                            </p>
                        </div>

                        <div class="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                            <div class="mb-3 flex items-center gap-3 text-white">
                                <UsersRound
                                    class="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                />
                                <p class="font-semibold">
                                    Une communauté qui grandit chaque jour
                                </p>
                            </div>
                            <p class="text-sm leading-relaxed text-white/85">
                                Infirmiers, sages-femmes et aides-soignants rejoignent InfiSwap pour organiser leurs remplacements plus simplement.
                            </p>
                        </div>

                        <div class="rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-center">
                            <p class="text-3xl font-extrabold text-white">
                                {{ copy.badge }}
                            </p>
                            <p class="mt-1 text-sm text-white/80">
                                Membres inscrits en Belgique & France
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
