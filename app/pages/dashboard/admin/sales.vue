<template>
    <div class="px-4 py-6 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-4xl space-y-6">
            <header class="space-y-1">
                <h1 class="text-2xl font-semibold">
                    Canal téléphonique — dépôt d'offre
                </h1>
                <p class="text-sm text-muted-foreground">
                    Recherchez une infirmière déjà inscrite, puis déposez une offre nominative
                    valable 48 h. Elle reçoit un email avec un lien de connexion et voit
                    l'offre en tête de son tableau de bord.
                </p>
            </header>

            <form
                class="flex flex-col gap-2 sm:flex-row"
                @submit.prevent="runSearch"
            >
                <Input
                    v-model="term"
                    type="search"
                    class="min-h-11"
                    placeholder="Email ou numéro de téléphone (3 caractères min.)"
                    aria-label="Rechercher une infirmière"
                />
                <Button
                    type="submit"
                    class="min-h-11 sm:w-40"
                    :disabled="loading || term.trim().length < 3"
                >
                    Rechercher
                </Button>
            </form>

            <p
                v-if="searched && prospects.length === 0 && !loading"
                class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground"
            >
                Aucune infirmière inscrite ne correspond. Le canal téléphonique est réservé
                aux membres existants.
            </p>

            <article
                v-for="prospect in prospects"
                :key="prospect.id"
                class="space-y-4 rounded-xl border p-5 dark:border-gray-700"
            >
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 class="font-semibold">
                            {{ prospect.name || prospect.email }}
                        </h2>
                        <p class="text-sm text-muted-foreground">
                            {{ prospect.email }}<span v-if="prospect.phone_number"> · {{ prospect.phone_number }}</span>
                        </p>
                    </div>
                    <span
                        v-if="prospect.is_premium"
                        class="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success"
                    >
                        Déjà abonnée
                    </span>
                </div>

                <dl class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                        <dt class="text-xs uppercase tracking-wide text-muted-foreground">
                            Membre depuis
                        </dt>
                        <dd>{{ formatDate(prospect.member_since) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs uppercase tracking-wide text-muted-foreground">
                            Dernière connexion
                        </dt>
                        <dd>{{ formatDate(prospect.last_login_at) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs uppercase tracking-wide text-muted-foreground">
                            Annonces publiées
                        </dt>
                        <dd>{{ prospect.replacements_published }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs uppercase tracking-wide text-muted-foreground">
                            Candidatures sans réponse
                        </dt>
                        <dd>{{ prospect.pending_applications }}</dd>
                    </div>
                </dl>

                <p
                    v-if="prospect.active_offer"
                    class="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900"
                >
                    Offre {{ prospect.active_offer.plan?.label }} déjà en cours, valable jusqu'au
                    {{ formatDateTime(prospect.active_offer.expires_at) }}.
                    En déposer une nouvelle annulera la précédente.
                </p>

                <div
                    v-if="!prospect.is_premium"
                    class="flex flex-col gap-2 sm:flex-row sm:items-center"
                >
                    <select
                        v-model="selectedPlan[prospect.id]"
                        class="min-h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                        :aria-label="`Formule à proposer à ${prospect.name || prospect.email}`"
                    >
                        <option
                            v-for="plan in plans"
                            :key="plan.lookup_key"
                            :value="plan.lookup_key"
                        >
                            {{ plan.label }} — {{ formatEuro(plan.amount) }}
                            <template v-if="plan.monthly_equivalent">
                                ({{ formatEuro(plan.monthly_equivalent) }}/mois)
                            </template>
                        </option>
                    </select>
                    <Button
                        class="min-h-11 sm:w-48"
                        :disabled="loading || !selectedPlan[prospect.id]"
                        @click="deposit(prospect)"
                    >
                        Déposer l'offre
                    </Button>
                </div>
            </article>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SalesProspect } from '~/composables/useSalesChannel';

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({
    title: 'Canal téléphonique',
});

const { plans, prospects, loading, fetchPlans, searchProspects, depositOffer } = useSalesChannel();

const term = ref('');
const searched = ref(false);
const selectedPlan = reactive<Record<number, string>>({});

async function runSearch() {
    await searchProspects(term.value);
    searched.value = true;

    for (const prospect of prospects.value) {
        selectedPlan[prospect.id] ??= plans.value[0]?.lookup_key ?? '';
    }
}

async function deposit(prospect: SalesProspect) {
    const lookupKey = selectedPlan[prospect.id];

    if (!lookupKey) {
        return;
    }

    if (await depositOffer(prospect.id, lookupKey)) {
        await runSearch();
    }
}

function formatDate(value: string | null): string {
    return value
        ? new Date(value).toLocaleDateString('fr-BE', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—';
}

function formatDateTime(value: string | null): string {
    return value
        ? new Date(value).toLocaleString('fr-BE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
        : '—';
}

function formatEuro(amount: number): string {
    return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(amount);
}

onMounted(fetchPlans);
</script>
