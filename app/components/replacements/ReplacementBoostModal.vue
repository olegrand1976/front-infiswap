<template>
    <Dialog v-model:open="open">
        <DialogContent
            v-if="replacement"
            class="sm:max-w-lg p-0 overflow-hidden gap-0 border-0"
        >
            <div
                class="relative px-6 pt-8 pb-6 text-white overflow-hidden"
                :class="isActiveMode
                    ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600'
                    : 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'"
            >
                <div class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                <div class="absolute -bottom-12 -left-6 w-24 h-24 rounded-full bg-white/10" />

                <div class="relative flex items-start gap-4">
                    <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm shrink-0">
                        <Rocket
                            class="w-6 h-6"
                        />
                    </div>
                    <div>
                        <DialogTitle class="text-xl font-bold text-white">
                            {{ isActiveMode ? 'Remplacement boosté' : 'Booster ce remplacement' }}
                        </DialogTitle>
                        <DialogDescription class="text-amber-50/90 mt-1 text-sm">
                            {{ isActiveMode
                                ? 'Votre annonce bénéficie d\'une visibilité maximale'
                                : 'Mettez votre remplacement en tête de liste' }}
                        </DialogDescription>
                    </div>
                </div>
            </div>

            <div class="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
                <section class="rounded-xl border border-gray-100 bg-gray-50/80 p-4 space-y-3">
                    <h3 class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Votre remplacement
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div class="flex items-start gap-2">
                            <Calendar class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div>
                                <p class="text-gray-500 text-xs">
                                    Période
                                </p>
                                <p class="font-medium text-gray-800">
                                    {{ periodLabel }}
                                </p>
                            </div>
                        </div>
                        <div
                            v-if="citiesLabel"
                            class="flex items-start gap-2"
                        >
                            <MapPin class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div>
                                <p class="text-gray-500 text-xs">
                                    Localité
                                </p>
                                <p class="font-medium text-gray-800 line-clamp-2">
                                    {{ citiesLabel }}
                                </p>
                            </div>
                        </div>
                        <div
                            v-if="zipLabel"
                            class="flex items-start gap-2 sm:col-span-2"
                        >
                            <Hash class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div>
                                <p class="text-gray-500 text-xs">
                                    Codes postaux
                                </p>
                                <p class="font-medium text-gray-800 line-clamp-2">
                                    {{ zipLabel }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="space-y-3">
                    <h3 class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Avantages du boost
                    </h3>
                    <ul class="space-y-2.5">
                        <li
                            v-for="advantage in advantages"
                            :key="advantage.title"
                            class="flex items-start gap-3 rounded-xl p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100/80"
                        >
                            <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-sm shrink-0">
                                <component
                                    :is="advantage.icon"
                                    class="w-4 h-4 text-amber-600"
                                />
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800 text-sm">
                                    {{ advantage.title }}
                                </p>
                                <p class="text-xs text-gray-600 mt-0.5">
                                    {{ advantage.description }}
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>

                <section
                    v-if="!isActiveMode && boostPlan"
                    class="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-4 text-center"
                >
                    <p class="text-xs text-gray-500 uppercase tracking-wide">
                        Tarif
                    </p>
                    <p class="text-2xl font-bold text-amber-700 mt-1">
                        {{ boostPlan.label }}
                    </p>
                    <p
                        v-if="boostPlan.description"
                        class="text-xs text-gray-500 mt-2"
                    >
                        {{ boostPlan.description }}
                    </p>
                </section>

                <section
                    v-else-if="isActiveMode"
                    class="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3"
                >
                    <ReplacementBoostStars size="lg" />
                    <div>
                        <p class="font-semibold text-green-800 text-sm">
                            Boost actif
                        </p>
                        <p class="text-xs text-green-700 mt-0.5">
                            {{ boostedUntilLabel }}
                        </p>
                    </div>
                </section>

                <p
                    v-if="!boostPlan && !isActiveMode && !planLoading"
                    class="text-sm text-center text-gray-500 py-2"
                >
                    L'option boost n'est pas disponible pour le moment.
                </p>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-3">
                <Button
                    variant="outline"
                    class="sm:flex-1 rounded-xl"
                    @click="open = false"
                >
                    {{ isActiveMode ? 'Fermer' : 'Annuler' }}
                </Button>

                <Button
                    v-if="!isActiveMode && boostPlan"
                    class="sm:flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-md"
                    :in-progress="paying"
                    @click="confirmBoost"
                >
                    <Rocket class="w-4 h-4 mr-2" />
                    Booster — {{ boostPlan.label }}
                </Button>

                <Button
                    v-if="isActiveMode && canCancel"
                    variant="outline"
                    class="sm:flex-1 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
                    :in-progress="canceling"
                    @click="handleCancel"
                >
                    Annuler le boost
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Calendar, Eye, Hash, MapPin, MessageCircle, Rocket, TrendingUp } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReplacementBoostStars from '@/components/replacements/ReplacementBoostStars.vue';
import type { Replacement } from '~/lib/types';

const open = defineModel<boolean>('open', { default: false });

const props = defineProps<{
    replacement: Replacement | null;
}>();

const emit = defineEmits<{
    cancelled: [];
}>();

const { $toast } = useNuxtApp();
const { boostReplacement, cancelBoost } = useSubscription();
const { boostPlan, fetchBoostPlan } = useReplacementBoost();

const paying = ref(false);
const canceling = ref(false);
const planLoading = ref(false);

const isActiveMode = computed(() => props.replacement?.is_boosted === true);

watch(open, async (isOpen) => {
    if (!isOpen) return;
    planLoading.value = true;
    try {
        await fetchBoostPlan(true);
    }
    finally {
        planLoading.value = false;
    }
});

const advantages = [
    {
        icon: TrendingUp,
        title: 'En haut de la liste',
        description: 'Votre remplacement apparaît en premier dans les recherches.',
    },
    {
        icon: Eye,
        title: 'Vite vu par les utilisateurs',
        description: 'Maximum de visibilité dès l\'ouverture des listes.',
    },
    {
        icon: MessageCircle,
        title: 'Réponses plus rapides',
        description: 'Les remplaçants vous contactent plus vite grâce à la position en tête.',
    },
];

const parseList = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String);
    try {
        const parsed = JSON.parse(String(value));
        return Array.isArray(parsed) ? parsed.map(String) : [];
    }
    catch {
        return [];
    }
};

const formatDate = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const periodLabel = computed(() => {
    const r = props.replacement;
    if (!r) return '—';

    const periods = r.periods ?? [];
    if (periods.length > 0) {
        const p = periods[0];
        return `${formatDate(p.start_date)} → ${formatDate(p.end_date)}${periods.length > 1 ? ` (+${periods.length - 1})` : ''}`;
    }

    if (r.start_date && r.end_date) {
        return `${formatDate(r.start_date)} → ${formatDate(r.end_date)}`;
    }

    return r.start_date ? formatDate(r.start_date) : '—';
});

const citiesLabel = computed(() => {
    const list = parseList(props.replacement?.cities);
    return list.length ? list.join(', ') : '';
});

const zipLabel = computed(() => {
    const list = parseList(props.replacement?.zip_codes);
    return list.length ? list.join(', ') : '';
});

const boostedUntilLabel = computed(() => {
    const until = props.replacement?.boosted_until;
    if (!until) return 'Renouvellement automatique chaque semaine tant que le boost est actif.';
    return `Actif jusqu'au ${formatDate(until)} (non annulable avant cette date)`;
});

/** Annulation manuelle : abonnement Stripe uniquement (pas les boosts one-time avec date de fin). */
const canCancel = computed(() => {
    const until = props.replacement?.boosted_until;
    return !until || new Date(until) <= new Date();
});

const confirmBoost = async () => {
    const id = props.replacement?.id;
    if (!id) return;

    paying.value = true;
    try {
        const response = await boostReplacement(id);
        const checkoutUrl = response?.url;
        if (checkoutUrl) {
            window.location.assign(checkoutUrl);
            return;
        }
        $toast({
            variant: 'destructive',
            description: 'Impossible d\'ouvrir la page de paiement.',
        });
    }
    finally {
        paying.value = false;
    }
};

const handleCancel = async () => {
    const id = props.replacement?.id;
    if (!id) return;

    canceling.value = true;
    try {
        await cancelBoost(id);
        emit('cancelled');
        open.value = false;
    }
    finally {
        canceling.value = false;
    }
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
