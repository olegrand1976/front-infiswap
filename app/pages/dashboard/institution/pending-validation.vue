<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div class="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div class="mb-6">
                <div class="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Clock class="w-8 h-8 text-yellow-600" />
                </div>
                <h1 class="text-2xl font-bold text-gray-900 mb-2">
                    Validation en attente
                </h1>
                <p class="text-gray-600 mb-6">
                    Votre compte institution est en attente de validation par notre équipe.
                </p>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div class="flex items-start gap-4">
                    <Info class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div class="text-left">
                        <h2 class="font-semibold text-blue-900 mb-2">
                            Prochaines étapes
                        </h2>
                        <p class="text-blue-800 text-sm mb-4">
                            Vous serez contacté prochainement par InfiSwap pour valider votre compte institution.
                        </p>
                        <div class="flex items-center gap-2 text-blue-900 font-medium">
                            <Phone class="w-5 h-5" />
                            <span>0478 02 33 77</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-sm text-gray-500">
                <p>
                    Une fois votre compte validé, vous recevrez un email de confirmation et vous pourrez accéder à votre tableau de bord.
                </p>
            </div>

            <div class="mt-8">
                <Button
                    variant="outline"
                    @click="handleLogout"
                >
                    Se déconnecter
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Clock, Info, Phone, Star } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { useAuth } from '~/composables/useAuth';

useHead({ title: 'Validation en attente' });

definePageMeta({
    layout: 'dashboard',
    middleware: ['institution'],
});

const { logout } = useAuth();

const handleLogout = async () => {
    await logout();
    await navigateTo('/login');
};
</script>
