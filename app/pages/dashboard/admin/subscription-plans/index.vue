<template>
    <div>
        <DashboardAdminPageHeader title="Plan d'accès">
            <template #action>
                <Button
                    v-if="isSuperAdmin"
                    class="rounded"
                    href="/dashboard/admin/subscription-plans/create"
                >
                    <CirclePlus />
                    <span class="hidden md:inline-block">Nouvelle accès</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div
                v-if="loading"
                class="flex justify-center py-16"
            >
                <Skeleton class="h-48 w-full max-w-lg rounded-xl" />
            </div>

            <div
                v-else-if="plan"
                class="max-w-lg mx-auto bg-white border border-gray-100 rounded-lg p-6 space-y-4"
            >
                <div class="text-center">
                    <h2 class="text-xl font-semibold text-success">
                        {{ plan.name }}
                    </h2>
                    <p
                        v-if="plan.description"
                        class="mt-2 text-gray-500 text-sm"
                    >
                        {{ plan.description }}
                    </p>
                    <p class="mt-4 text-3xl font-bold text-gray-800">
                        {{ plan.amount }} {{ currencySymbol(plan.currency) }}
                    </p>
                    <p class="text-sm text-gray-400 mt-1">
                        Paiement unique — accès permanent
                    </p>
                </div>

                <div class="border-t border-gray-100 pt-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-500">Statut</span>
                        <span class="font-medium text-success">Actif</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">Priorité</span>
                        <span>{{ plan.priority }}</span>
                    </div>
                    <div>
                        <span class="text-gray-500">Stripe Price ID</span>
                        <p class="font-mono text-xs mt-1 break-all text-gray-700">
                            {{ plan.stripe_price_id }}
                        </p>
                    </div>
                </div>

                <div
                    v-if="isSuperAdmin"
                    class="flex gap-3 justify-center pt-2"
                >
                    <Button
                        class="rounded"
                        :href="`/dashboard/admin/subscription-plans/${plan.id}`"
                    >
                        Modifier
                    </Button>
                    <Button
                        class="rounded"
                        variant="outline"
                        href="/dashboard/admin/subscription-plans/create"
                    >
                        Nouvelle accès
                    </Button>
                </div>
            </div>

            <div
                v-else
                class="text-center py-16 space-y-4"
            >
                <p class="text-gray-500">
                    Aucun plan d'accès actif pour le moment.
                </p>
                <Button
                    v-if="isSuperAdmin"
                    class="rounded"
                    href="/dashboard/admin/subscription-plans/create"
                >
                    Créer le plan d'accès
                </Button>
            </div>

            <p class="text-center text-xs text-gray-400 mt-8 max-w-md mx-auto">
                Ce plan est celui proposé aux infirmières. Pour changer le tarif, créez un nouveau prix — l'ancien sera désactivé automatiquement.
            </p>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

useHead({ title: 'Plan d\'accès' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

const { plan, loading, getCurrentPlan } = useSubscriptionPlansAdmin();
const { isSuperAdmin } = useAuth();

const currencySymbol = (currency: string) => (currency === 'gbp' ? '£' : '€');

await getCurrentPlan();
</script>
