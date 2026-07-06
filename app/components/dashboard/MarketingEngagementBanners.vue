<script setup lang="ts">
import { hasPaidPlatformAccess, isSubjectToPlatformAccessPayment } from '~/utils/platformAccess';

const user = useState<{ id?: number; created_at?: string | null; platform_access_paid_at?: string | null; roles?: string[]; account_type?: string | null } | null>('user');
const { notifications, getAll } = useNotifications();

const showAccessBanner = computed(() =>
    isSubjectToPlatformAccessPayment(user.value) && !hasPaidPlatformAccess(user.value),
);

const pendingResponseCount = computed(() =>
    (notifications.value?.data ?? []).filter(
        (notification) => notification.type === 'replacement.response' && !notification.read_at,
    ).length,
);

onMounted(async () => {
    try {
        await getAll(1, 25, { unread_only: true });
    }
    catch {
        // ignore — banner is optional
    }
});
</script>

<template>
    <div
        v-if="showAccessBanner || pendingResponseCount > 0"
        class="mx-6 mt-4 space-y-2"
    >
        <div
            v-if="showAccessBanner"
            class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
            Activez votre accès réseau pour publier et répondre aux remplacements.
            <NuxtLink
                to="/acces-plan"
                class="ml-2 font-semibold underline"
            >
                Activer maintenant
            </NuxtLink>
        </div>

        <div
            v-if="pendingResponseCount > 0"
            class="rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-sky-900"
        >
            {{ pendingResponseCount }} candidature(s) en attente de votre réponse.
            <NuxtLink
                to="/dashboard/notifications"
                class="ml-2 font-semibold underline"
            >
                Traiter maintenant
            </NuxtLink>
        </div>
    </div>
</template>
