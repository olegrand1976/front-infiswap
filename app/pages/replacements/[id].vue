<template>
    <div class="container pb-28 lg:pb-10">
        <NuxtLink
            to="/replacements"
            class="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mt-6 mb-4"
        >
            <ArrowLeft class="w-4 h-4" />
            Retour aux résultats
        </NuxtLink>

        <div class="max-w-4xl mx-auto space-y-10">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                <NuxtLink
                    to="/"
                    class="hover:text-primary"
                >
                    Accueil
                </NuxtLink>
                <ChevronRight class="w-3.5 h-3.5" />
                <NuxtLink
                    to="/replacements"
                    class="hover:text-primary"
                >
                    Remplacements &amp; Missions
                </NuxtLink>
                <ChevronRight class="w-3.5 h-3.5" />
                <span class="text-foreground font-semibold">{{ item.institution?.name || item.city }}</span>
            </div>

            <!-- Detail card -->
            <div class="bg-surface border border-border rounded-md p-6 md:p-8 flex flex-col gap-6">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span
                            class="inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest"
                            :class="item.type === 'mission' ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'"
                        >
                            {{ item.type === 'mission' ? 'Mission' : 'Remplacement' }}
                        </span>
                        <span
                            v-if="item.isUrgent"
                            class="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-destructive"
                        >
                            <ShieldAlert class="w-3.5 h-3.5" />
                            Urgent
                        </span>
                    </div>
                    <Button
                        href="/register"
                        class="rounded-md gap-2 font-bold"
                    >
                        Postuler {{ item.type === 'mission' ? 'à cette mission' : 'à ce remplacement' }}
                        <ArrowRight class="w-4 h-4" />
                    </Button>
                </div>

                <h1 class="font-secondary text-2xl md:text-3xl font-bold text-foreground">
                    {{ item.date }}
                </h1>

                <div class="flex flex-col gap-2.5">
                    <div class="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin class="w-4 h-4 shrink-0" />
                        <span>{{ item.city }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <MapPin class="w-4 h-4 text-primary shrink-0" />
                        <span>{{ item.zipCodes.join(', ') }}</span>
                    </div>
                    <div class="flex items-start gap-2 text-sm font-semibold">
                        <Activity class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="careType in item.careTypes"
                                :key="careType"
                                class="inline-flex items-center rounded-md bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-foreground"
                            >
                                {{ careType }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-6 py-4 border-t border-b border-border">
                    <div
                        v-if="item.patientsPerDay"
                        class="flex items-center gap-2 text-sm font-semibold"
                    >
                        <Users class="w-4.5 h-4.5 text-primary" />
                        <span>{{ item.patientsPerDay }} patients / jour</span>
                    </div>
                    <div class="flex items-center gap-5">
                        <div
                            v-for="slot in item.slots"
                            :key="slot"
                            class="flex items-center gap-1.5"
                        >
                            <span class="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                                <Check class="w-3 h-3" />
                            </span>
                            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{{ slot }}</span>
                        </div>
                    </div>
                </div>

                <div
                    v-if="item.institution"
                    class="flex items-center gap-3.5 bg-surface-subtle rounded-md px-4 py-3.5"
                >
                    <span class="w-10 h-10 rounded-md shrink-0 bg-success/20 text-success flex items-center justify-center text-sm font-black">
                        {{ item.institution.initial }}
                    </span>
                    <div>
                        <p class="text-sm font-bold text-foreground">
                            {{ item.institution.name }}
                        </p>
                        <p class="text-xs text-muted-foreground mt-0.5">
                            {{ item.institution.contract }}
                        </p>
                    </div>
                </div>

                <p
                    v-if="item.description"
                    class="text-sm text-muted-foreground leading-relaxed"
                >
                    {{ item.description }}
                </p>
            </div>

            <!-- Nearby -->
            <div
                v-if="nearby.length"
                class="flex flex-col gap-5"
            >
                <h2 class="font-secondary text-xl font-extrabold text-foreground">
                    Remplacements et missions aux alentours
                </h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <Card
                        v-for="nearbyItem in nearby"
                        :key="nearbyItem.id"
                        variant="none"
                        class="relative bg-surface border rounded-md p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-200"
                    >
                        <Badge
                            v-if="nearbyItem.isNew"
                            variant="outline"
                            class="!h-auto !w-auto absolute top-0 right-4 -translate-y-1/2 rounded-full bg-accent-green text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest shadow-md"
                        >
                            Nouveau
                        </Badge>
                        <Badge
                            v-else-if="nearbyItem.isUrgent"
                            variant="outline"
                            class="!h-auto !w-auto absolute top-0 right-4 -translate-y-1/2 rounded-full bg-destructive text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest shadow-md"
                        >
                            Urgent
                        </Badge>

                        <div :class="['w-10 h-10 rounded-md flex items-center justify-center shrink-0', nearbyItem.type === 'replacement' ? 'bg-primary/10' : 'bg-success/10']">
                            <Calendar
                                v-if="nearbyItem.type === 'replacement'"
                                class="w-4.5 h-4.5 text-primary"
                            />
                            <Briefcase
                                v-else
                                class="w-4.5 h-4.5 text-success"
                            />
                        </div>
                        <div>
                            <p class="font-primary text-sm font-bold text-foreground tabular-nums">
                                {{ nearbyItem.date }}
                            </p>
                            <div class="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5">
                                <MapPin class="w-3 h-3 shrink-0" />
                                {{ nearbyItem.city }}
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <div
                                v-for="slot in nearbyItem.slots"
                                :key="slot"
                                class="flex items-center gap-1"
                            >
                                <span class="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                                    <Check class="w-3 h-3" />
                                </span>
                                <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{{ slot }}</span>
                            </div>
                        </div>
                        <NuxtLink
                            :to="`/replacements/${nearbyItem.id}`"
                            class="inline-flex items-center gap-1 text-xs font-bold hover:underline mt-auto"
                            :class="nearbyItem.type === 'replacement' ? 'text-primary' : 'text-success'"
                        >
                            Voir plus
                        </NuxtLink>
                    </Card>
                </div>
            </div>

            <!-- Create free account banner -->
            <div
                v-if="!isLoggedIn"
                class="bg-primary rounded-md p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 md:justify-between text-center md:text-left"
            >
                <div class="flex flex-col md:flex-row items-center gap-4">
                    <span class="w-12 h-12 rounded-md bg-primary-foreground/15 flex items-center justify-center shrink-0 text-primary-foreground">
                        <UserPlus class="w-6 h-6" />
                    </span>
                    <div>
                        <h3 class="font-secondary text-lg font-bold text-primary-foreground">
                            Créez un compte gratuit pour postuler aux missions
                        </h3>
                        <p class="text-primary-foreground/75 text-sm mt-1">
                            Accédez à toutes les missions, postulez en 1 clic et gérez vos disponibilités.
                        </p>
                    </div>
                </div>
                <Button
                    href="/register"
                    class="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold shrink-0"
                >
                    Créer mon compte
                </Button>
            </div>
        </div>

        <!-- Sticky mobile apply bar -->
        <div class="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-surface border-t border-border p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
            <Button
                href="/register"
                class="w-full rounded-md gap-2 font-bold justify-center"
            >
                Postuler {{ item.type === 'mission' ? 'à cette mission' : 'à ce remplacement' }}
                <ArrowRight class="w-4 h-4" />
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, ArrowRight, Activity, Briefcase, Calendar, Check, ChevronRight, MapPin, ShieldAlert, UserPlus, Users } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { replacementListings } from '~/lib/replacements-data';

definePageMeta({
    layout: 'replacements',
});

const { isLoggedIn } = useAuth();
const route = useRoute();
const id = computed(() => Number(route.params.id));

// Mock data, not yet wired to the API — falls back to the first listing so
// the page always has something to show while the real endpoint is missing.
const item = computed(() =>
    replacementListings.find(listing => listing.id === id.value) ?? replacementListings[0],
);

const nearby = computed(() =>
    replacementListings.filter(listing => listing.id !== item.value.id).slice(0, 4),
);

useHead({
    title: `${item.value.type === 'mission' ? 'Mission' : 'Remplacement'} — ${item.value.city} — InfiSwap`,
});
</script>
