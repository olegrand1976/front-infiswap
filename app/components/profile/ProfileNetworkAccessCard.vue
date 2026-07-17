<script setup lang="ts">
import { KeyRound, Medal } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { hasPaidPlatformAccess, isSubjectToPlatformAccessPayment } from '~/utils/platformAccess';

const { trackEvent } = useProductAnalytics();
const { redirectToAccesPlan } = useSubscription();

const user = useUser();

const visible = computed(() =>
    isSubjectToPlatformAccessPayment(user.value) && !hasPaidPlatformAccess(user.value),
);

onMounted(() => {
    if (visible.value) {
        trackEvent('platform_access_impression', { source: 'settings' });
    }
});

function activateAccess() {
    trackEvent('platform_access_cta_click', { source: 'settings', trigger: 'settings' });
    redirectToAccesPlan('/dashboard/settings', { trigger: 'settings' });
}
</script>

<template>
    <section
        v-if="visible"
        class="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3"
    >
        <div class="flex items-start gap-3">
            <div class="rounded-full bg-primary/10 p-2 text-primary">
                <Medal
                    class="size-5"
                    aria-hidden="true"
                />
            </div>
            <div class="space-y-1">
                <h2 class="font-semibold text-primary">
                    Accès réseau non activé
                </h2>
                <p class="text-sm text-muted-foreground">
                    Accès réseau — paiement unique 9,90 €, à vie. Publiez, postulez et affichez le badge membre — sans abonnement.
                </p>
            </div>
        </div>
        <ul class="space-y-1 text-sm text-muted-foreground">
            <li class="flex items-center gap-2">
                <KeyRound class="size-4 text-success shrink-0" />
                Paiement unique — accès à vie
            </li>
            <li class="flex items-center gap-2">
                <Medal class="size-4 text-amber-500 shrink-0" />
                Badge membre visible par les collègues
            </li>
        </ul>
        <Button
            class="w-full sm:w-auto bg-success hover:bg-success/90"
            @click="activateAccess"
        >
            Activer mon accès réseau — 9,90 €
        </Button>
    </section>
</template>
