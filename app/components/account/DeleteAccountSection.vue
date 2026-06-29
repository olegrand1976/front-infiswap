<template>
    <section class="flex flex-col justify-end items-center pt-8 space-y-4">
        <Button
            class="flex w-48 ml-auto text-end text-primary bg-transparent border border-primary shadow-none hover:text-white"
            @click="deleteAccountDialog = true"
        >
            <Trash2 class="w-5" />
            <span>Supprimer compte</span>
        </Button>

        <Dialog v-model:open="deleteAccountDialog">
            <DialogContent class="w-full max-w-sm sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle class="text-center">
                        Supprimer votre compte
                    </DialogTitle>
                </DialogHeader>
                <div class="mt-8">
                    Veuillez confirmer votre action en entrant votre mot de passe. En le confirmant, vous ne pouvez plus
                    accéder aux informations de votre compte.
                </div>

                <div class="mt-4 space-y-3">
                    <div class="mb-0 sm:mb-12 grid sm:grid-cols-[40%_60%] items-center sm:border sm:border-primary sm:h-9 sm:rounded-full">
                        <p class="text-primary sm:text-white sm:bg-primary flex items-center h-full ps-4 rounded-s-full">
                            Mot de passe
                        </p>
                        <Input
                            v-model="password"
                            type="password"
                            class="mb-12 sm:mb-0 w-full sm:w-auto sm:bg-transparent placeholder:text-black h-9 bg-gray-100 border border-gray-200 sm:border-none rounded-full"
                            @keyup.enter="handleDeleteAccount"
                        />
                    </div>

                    <DialogFooter class="mt-12 flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-8">
                        <Button
                            variant="secondary"
                            class="bg-gray-200 hover:bg-gray-300 w-full sm:w-auto"
                            :disabled="isDeleting"
                            @click="deleteAccountDialog = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            class="w-full sm:w-auto"
                            :in-progress="isDeleting"
                            :disabled="isDeleting || !password.trim()"
                            @click="handleDeleteAccount"
                        >
                            Valider
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    </section>
</template>

<script lang="ts" setup>
import { Trash2 } from 'lucide-vue-next';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AUTH_TOKEN } from '~/lib/constants';
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
        useCookie(AUTH_TOKEN).value = '';
        password.value = '';
        deleteAccountDialog.value = false;

        $toast({
            description: 'Votre compte a été supprimé avec succès.',
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
