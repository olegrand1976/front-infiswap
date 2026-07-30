<template>
    <section class="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <h3 class="flex items-center gap-3">
            <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-destructive/15 text-destructive">
                <TriangleAlert class="size-5" />
            </span>
            <span class="text-lg font-secondary">Zone de danger</span>
        </h3>
        <p class="mt-3 text-sm text-foreground">
            Confirmez avec votre mot de passe. Votre compte sera désactivé, vos données personnelles
            anonymisées (droit à l'effacement), et les administrateurs seront informés par e-mail.
            Certaines données de facturation peuvent être conservées selon les obligations légales.
        </p>

        <div class="mt-4">
            <Button
                v-if="!deleteAccountDialog"
                variant="none"
                class="h-auto inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/5 px-3.5 py-2 text-[13px] font-medium text-destructive transition-colors hover:bg-destructive/10 md:text-[13px] lg:text-[13px]"
                @click="deleteAccountDialog = true"
            >
                <Trash2 class="size-4" />
                Se désinscrire du site
            </Button>

            <form
                v-else
                class="space-y-3"
                @submit.prevent="handleDeleteAccount"
            >
                <div class="flex flex-col gap-1.5 sm:max-w-xs">
                    <label class="text-xs font-medium text-muted-foreground">Mot de passe</label>
                    <div class="flex h-11 items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-destructive focus-within:ring-2 focus-within:ring-destructive/15">
                        <KeyRound class="size-4 shrink-0 text-destructive" />
                        <Input
                            v-model="password"
                            type="password"
                            class="h-auto border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                        />
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button
                        type="button"
                        variant="none"
                        class="h-auto rounded-md border border-transparent px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground md:text-[13px] lg:text-[13px]"
                        :disabled="isDeleting"
                        @click="deleteAccountDialog = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="none"
                        class="h-auto rounded-md bg-destructive px-3.5 py-2 text-[13px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 md:text-[13px] lg:text-[13px]"
                        :in-progress="isDeleting"
                        :disabled="isDeleting || !password.trim()"
                    >
                        Valider
                    </Button>
                </div>
            </form>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { KeyRound, Trash2, TriangleAlert } from 'lucide-vue-next';
import { useAuthTokenCookie } from '~/lib/authTokenCookie';
import { getErrorMessage } from '~/lib/utils';
import { useAuth } from '~/composables/useAuth';
import type { User } from '~/lib/types';

const { $toast } = useNuxtApp();
const router = useRouter();
const { deleteAccount } = useAuth();
const user = useState<User | null>('user');

const deleteAccountDialog = ref(false);
const password = ref('');
const isDeleting = ref(false);

const handleDeleteAccount = async () => {
    if (!password.value.trim() || isDeleting.value || !user.value) {
        return;
    }

    isDeleting.value = true;

    try {
        await deleteAccount({ password: password.value });

        user.value = null;
        useAuthTokenCookie().value = '';
        password.value = '';
        deleteAccountDialog.value = false;

        $toast({
            description: 'Votre désinscription a été enregistrée. Vos données personnelles ont été anonymisées.',
        });

        await router.push('/');
    }
    catch (error) {
        $toast({
            variant: 'destructive',
            description: getErrorMessage(error),
        });
    }
    finally {
        isDeleting.value = false;
    }
};
</script>
