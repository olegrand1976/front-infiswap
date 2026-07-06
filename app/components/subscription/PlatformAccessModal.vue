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
                    Accédez au réseau InfiSwap
                </AlertDialogTitle>
                <AlertDialogDescription as="div" class="space-y-4 text-left text-sm text-muted-foreground">
                    <p>
                        Pour publier un remplacement ou répondre à une annonce, activez votre accès au réseau InfiSwap.
                        Il s'agit d'un <strong class="text-foreground">paiement unique</strong> : une fois payé, vous accédez
                        durablement à la communauté et à tous les outils de mise en relation — sans abonnement mensuel ni annuel.
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
                                Membres inscrits
                            </p>
                            <p class="text-xs text-muted-foreground">
                                Professionnels actifs en Belgique et en France
                            </p>
                        </div>
                    </div>

                    <div
                        v-if="accessPlan"
                        class="rounded-xl bg-muted/50 px-4 py-3 text-center"
                    >
                        <span class="inline-block rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-success">
                            Paiement unique
                        </span>
                        <p class="mt-2 text-lg font-semibold text-foreground">
                            {{ formattedPrice }} {{ currencySymbol }}
                        </p>
                        <p class="text-xs text-muted-foreground">
                            Accès permanent au réseau
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
                    Obtenir mon accès
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
