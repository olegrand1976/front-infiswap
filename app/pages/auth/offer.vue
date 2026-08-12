<template>
    <div class="flex min-h-screen items-center justify-center px-4">
        <div class="w-full max-w-sm space-y-4 text-center">
            <LayoutsLogo class="mx-auto w-40" />

            <template v-if="failed">
                <h1 class="text-lg font-semibold">
                    Ce lien n'est plus valable
                </h1>
                <p class="text-sm text-muted-foreground">
                    Les liens de connexion expirent après 30 minutes et ne servent qu'une fois.
                    Connectez-vous avec votre mot de passe pour retrouver votre offre.
                </p>
                <Button
                    class="min-h-11 w-full"
                    @click="navigateTo('/login')"
                >
                    Aller à la connexion
                </Button>
            </template>

            <template v-else>
                <h1 class="text-lg font-semibold">
                    Connexion en cours…
                </h1>
                <p class="text-sm text-muted-foreground">
                    Nous ouvrons votre offre Infiswap Premium.
                </p>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { clearAuthSessionCookie, persistAuthTokenCookie, useAuthTokenCookie } from '~/lib/authTokenCookie';

definePageMeta({
    layout: false,
    ssr: false,
});

useHead({
    title: 'Votre offre Infiswap Premium',
});

const route = useRoute();
const authToken = useAuthTokenCookie();
const { $apifetch } = useNuxtApp();
const { refresh } = useAuth();
const user = useUser();
const failed = ref(false);

onMounted(async () => {
    const token = typeof route.query.token === 'string' ? route.query.token : null;

    if (!token) {
        failed.value = true;

        return;
    }

    persistAuthTokenCookie(authToken, token);
    await refresh(token);

    if (!user.value) {
        clearAuthSessionCookie(authToken);
        failed.value = true;

        return;
    }

    // Échange le bearer court (query) contre un jeton de session ; les
    // proOfferLogin sont révoqués côté API dès que l'échange réussit.
    try {
        const response = await $apifetch<{ token?: string }>('api/subscription/pro/offer/finalize-login', {
            method: 'POST',
        });

        if (response?.token) {
            persistAuthTokenCookie(authToken, response.token);
            await refresh(response.token);
        }
    }
    catch {
        clearAuthSessionCookie(authToken);
        failed.value = true;

        return;
    }

    if (!user.value) {
        clearAuthSessionCookie(authToken);
        failed.value = true;

        return;
    }

    await navigateTo('/dashboard/subscriptions', { replace: true });
});
</script>
