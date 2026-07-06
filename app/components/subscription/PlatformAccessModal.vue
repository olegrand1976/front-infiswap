<script setup lang="ts">
import { Users } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const {
    platformAccessModalOpen,
    platformAccessRedirectTo,
    closePlatformAccessModal,
    redirectToAccesPlan,
    accessPlan,
    getAccessPlan,
    loading,
} = useSubscription();

const { getKpiValue, fetchStats, loading: statsLoading } = usePlatformStats();

onMounted(async () => {
    await Promise.all([
        getAccessPlan(),
        fetchStats(),
    ]);
});

const membersCount = computed(() => getKpiValue('members_total'));

const formattedMembersCount = computed(() =>
    membersCount.value.toLocaleString('fr-BE'),
);

const formattedPrice = computed(() => {
    const amount = accessPlan.value?.amount;
    if (amount === undefined || amount === null || amount === '') {
        return '9,90';
    }

    const num = Number(amount);

    if (Number.isNaN(num)) {
        return String(amount);
    }

    return num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

const currencySymbol = computed(() => {
    const currency = accessPlan.value?.currency ?? 'eur';

    return currency === 'gbp' ? '£' : '€';
});

function handleObtainAccess() {
    const redirectTo = platformAccessRedirectTo.value ?? undefined;
    closePlatformAccessModal();
    redirectToAccesPlan(redirectTo);
}
</script>

<template>
    <AlertDialog
        :open="platformAccessModalOpen"
        @update:open="(open) => { if (!open) closePlatformAccessModal(); }"
    >
        <AlertDialogContent class="max-w-lg">
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Rejoignez le réseau n°1 des remplacements infirmiers
                </AlertDialogTitle>
                <AlertDialogDescription as="div" class="space-y-4 text-left text-sm text-muted-foreground">
                    <div class="rounded-xl border-2 border-success/30 bg-success/5 px-4 py-3">
                        <p class="text-sm font-semibold text-foreground">
                            Un seul paiement. Un accès à vie.
                        </p>
                        <p class="mt-1.5 text-sm leading-relaxed">
                            Pour publier votre remplacement et le rendre visible auprès des infirmiers et aides-soignant(e)s
                            de votre région, activez votre accès avec un
                            <strong class="text-foreground">paiement unique de {{ formattedPrice }} {{ currencySymbol }}</strong>.
                            Aucun abonnement, aucun renouvellement : vous accédez
                            <strong class="text-foreground">à vie</strong>
                            au réseau n°1 des remplacements infirmiers en Belgique et en France.
                        </p>
                    </div>

                    <p>
                        Sans cet accès, votre annonce ne sera pas diffusée sur le réseau.
                        En souscrivant, vous rejoignez une communauté active de professionnels
                        qui publient, répondent et trouvent des remplacements près de chez eux — en quelques clics.
                    </p>

                    <div class="flex items-center gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-4">
                        <div class="rounded-2xl bg-primary/10 p-3 text-primary">
                            <Users
                                class="size-6"
                                aria-hidden="true"
                            />
                        </div>
                        <div>
                            <p
                                v-if="statsLoading"
                                class="text-2xl font-extrabold text-primary"
                            >
                                …
                            </p>
                            <p
                                v-else
                                class="text-2xl font-extrabold text-primary"
                            >
                                {{ formattedMembersCount }}+
                            </p>
                            <p class="text-sm font-medium text-foreground">
                                Membres actifs sur le réseau
                            </p>
                            <p class="text-xs text-muted-foreground">
                                Infirmiers, aides-soignant(e)s et sages-femmes en Belgique et en France
                            </p>
                        </div>
                    </div>

                    <div class="rounded-xl bg-muted/50 px-4 py-3 text-center">
                        <span class="inline-block rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-success">
                            Paiement unique
                        </span>
                        <p class="mt-2 text-lg font-semibold text-foreground">
                            {{ formattedPrice }} {{ currencySymbol }}
                        </p>
                        <p class="text-xs text-muted-foreground">
                            Paiement unique — accès à vie au réseau
                        </p>
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter class="flex-col gap-2 sm:flex-row">
                <AlertDialogCancel class="w-full sm:w-auto">
                    Plus tard
                </AlertDialogCancel>
                <Button
                    class="w-full sm:w-auto bg-success hover:bg-success/90"
                    :in-progress="loading"
                    @click="handleObtainAccess"
                >
                    Obtenir mon accès à vie
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
