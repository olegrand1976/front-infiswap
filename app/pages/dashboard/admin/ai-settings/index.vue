<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="Intelligence artificielle">
            <template #action>
                <Button
                    variant="outline"
                    class="rounded-md"
                    :disabled="loading || testing"
                    @click="handleTestConnection"
                >
                    <RefreshCw
                        class="h-4 w-4"
                        :class="{ 'animate-spin': testing }"
                    />
                    <span class="hidden md:inline-block ml-2">Tester la connexion</span>
                </Button>
            </template>
        </DashboardAdminPageHeader>

        <DashboardAdminPageContent>
            <div
                v-if="loading"
                class="flex justify-center items-center py-24"
            >
                <RollingLoader :loading="loading" />
            </div>

            <div
                v-else
                class="space-y-6"
            >
                <section class="rounded-xl border bg-white">
                    <div class="grid grid-cols-1 lg:grid-cols-2">
                        <div class="flex flex-col gap-5 p-6 border-b lg:border-b-0 lg:border-r">
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-1">
                                    <h3 class="font-semibold text-gray-900">
                                        Connexion au fournisseur
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        Service et modèle utilisés pour les requêtes IA.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    class="rounded-md shrink-0"
                                    @click="openEditConnectionDialog"
                                >
                                    <Pencil class="h-4 w-4" />
                                    <span class="hidden sm:inline ml-2">Modifier</span>
                                </Button>
                            </div>

                            <div class="space-y-2">
                                <Label for="ai-status">Statut</Label>
                                <Select
                                    id="ai-status"
                                    :model-value="statusValue"
                                    :disabled="saving"
                                    @update:model-value="handleStatusChange"
                                >
                                    <SelectTrigger :class="fieldControlClass">
                                        <SelectValue
                                            placeholder="Statut"
                                            class="w-full"
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Activé
                                        </SelectItem>
                                        <SelectItem value="paused">
                                            En pause
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <dl class="rounded-lg border divide-y text-sm">
                                <div class="flex items-center justify-between gap-4 px-4 py-3">
                                    <dt class="text-muted-foreground">
                                        Fournisseur
                                    </dt>
                                    <dd class="font-medium text-gray-900">
                                        {{ providerLabel }}
                                    </dd>
                                </div>
                                <div class="flex items-center justify-between gap-4 px-4 py-3">
                                    <dt class="text-muted-foreground">
                                        Modèle
                                    </dt>
                                    <dd class="font-medium font-mono text-gray-900 truncate max-w-[55%] text-right">
                                        {{ settings?.model }}
                                    </dd>
                                </div>
                                <div class="flex items-center justify-between gap-4 px-4 py-3">
                                    <dt class="text-muted-foreground">
                                        Clé API
                                    </dt>
                                    <dd class="flex items-center gap-1 min-w-0 justify-end">
                                        <span
                                            class="font-medium truncate"
                                            :class="settings?.has_api_key ? 'font-mono text-gray-900' : 'text-amber-600'"
                                        >
                                            {{ settings?.has_api_key ? settings.masked_api_key : 'Manquante' }}
                                        </span>
                                        <button
                                            v-if="settings?.has_api_key"
                                            type="button"
                                            :disabled="saving"
                                            class="text-destructive cursor-pointer"
                                            @click="handleDeleteApiKey"
                                        >
                                            <Trash2 class="h-4 w-4 mb-0.5 text-destructive" />
                                        </button>
                                    </dd>
                                </div>
                            </dl>

                            <p
                                v-if="settings?.modified_at"
                                class="text-xs text-gray-400"
                            >
                                Modifié le {{ formatToDMY(settings.modified_at, true) }}
                                <span v-if="settings.modified_by"> · {{ settings.modified_by.name }}</span>
                            </p>
                        </div>

                        <div class="flex flex-col gap-5 p-6">
                            <div class="space-y-1">
                                <h3 class="font-semibold text-gray-900">
                                    Clé API
                                </h3>
                                <p class="text-sm text-gray-500">
                                    Identifiant secret chiffré en base de données.
                                </p>
                            </div>

                            <div class="space-y-2">
                                <Label for="ai-api-key">
                                    {{ settings?.has_api_key ? 'Nouvelle clé (remplacement)' : 'Clé API' }}
                                </Label>
                                <div class="relative">
                                    <Input
                                        id="ai-api-key"
                                        v-model="apiKeyInput"
                                        :type="isPasswordVisible ? 'text' : 'password'"
                                        autocomplete="new-password"
                                        placeholder="Collez votre clé ici"
                                        class="pr-10"
                                    />
                                    <button
                                        type="button"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        tabindex="-1"
                                        @click="isPasswordVisible = !isPasswordVisible"
                                    >
                                        <Eye
                                            v-if="!isPasswordVisible"
                                            class="h-4 w-4"
                                        />
                                        <EyeOff
                                            v-else
                                            class="h-4 w-4"
                                        />
                                    </button>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-2 pt-1">
                                <Button
                                    class="rounded-md"
                                    :disabled="!apiKeyInput.trim() || saving"
                                    :loading="saving"
                                    @click="handleSaveApiKey"
                                >
                                    Enregistrer la clé
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Dialog v-model:open="editConnectionDialog">
                <DialogContent class="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Modifier la connexion</DialogTitle>
                        <DialogDescription>
                            Choisissez le fournisseur et le modèle utilisés pour les requêtes IA.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        class="space-y-4"
                        @submit.prevent="handleSaveSettings"
                    >
                        <div class="space-y-2">
                            <Label for="ai-provider">Fournisseur</Label>
                            <Select v-model="modalForm.provider">
                                <SelectTrigger
                                    id="ai-provider"
                                    :class="fieldControlClass"
                                >
                                    <SelectValue
                                        placeholder="Choisir un fournisseur"
                                        class="w-full"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gemini">
                                        Google Gemini
                                    </SelectItem>
                                    <SelectItem value="openai">
                                        OpenAI
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="space-y-2">
                            <Label for="ai-model">Modèle</Label>
                            <Input
                                id="ai-model"
                                v-model="modalForm.model"
                                placeholder="gemini-3.5-flash"
                            />
                        </div>

                        <DialogFooter class="gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                @click="editConnectionDialog = false"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                :loading="saving"
                                class="rounded"
                            >
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardAdminPageContent>
    </div>
</template>

<script setup lang="ts">
import { Eye, EyeOff, Pencil, RefreshCw, Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RollingLoader from '~/components/RollingLoader.vue';
import { formatToDMY } from '~/composables/useDate';
import type { AiProvider, AiTestResult } from '~/composables/useAiSettings';
import { getErrorMessage } from '~/lib/utils';

definePageMeta({
    layout: 'dashboard',
    middleware: ['admin'],
});

useHead({ title: 'Configuration IA' });

const { isSuperAdmin } = useAuth();
const { $toast } = useNuxtApp();
const {
    settings,
    loading,
    saving,
    testing,
    fetchSettings,
    saveSettings,
    saveApiKey,
    removeApiKey,
    testConnection,
} = useAiSettings();

if (!isSuperAdmin.value) {
    await navigateTo('/dashboard/admin', { replace: true });
}

const form = reactive({
    provider: 'gemini' as AiProvider,
    model: 'gemini-3.5-flash',
    active: true,
});

const modalForm = reactive({
    provider: 'gemini' as AiProvider,
    model: 'gemini-3.5-flash',
});

const savedActive = ref(true);
const apiKeyInput = ref('');
const isPasswordVisible = ref(false);
const editConnectionDialog = ref(false);
const testResult = ref<AiTestResult | null>(null);

const fieldControlClass
    = 'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background';

const providerLabel = computed(() =>
    settings.value?.provider === 'openai' ? 'OpenAI' : 'Google Gemini',
);

const statusValue = computed(() => (form.active ? 'active' : 'paused'));

const syncForm = () => {
    if (!settings.value) {
        return;
    }

    form.provider = settings.value.provider;
    form.model = settings.value.model;
    form.active = settings.value.active;
    savedActive.value = settings.value.active;
};

await fetchSettings();
syncForm();

watch(settings, syncForm);

const openEditConnectionDialog = () => {
    modalForm.provider = form.provider;
    modalForm.model = form.model;
    editConnectionDialog.value = true;
};

const handleStatusChange = async (value: string) => {
    const active = value === 'active';
    if (active === form.active) {
        return;
    }

    form.active = active;

    try {
        const response = await saveSettings({ active });
        savedActive.value = active;
        $toast({ title: response.message });
        testResult.value = null;
    }
    catch (error) {
        form.active = savedActive.value;
        $toast({ title: getErrorMessage(error), variant: 'destructive' });
    }
};

const handleSaveSettings = async () => {
    try {
        const response = await saveSettings({
            provider: modalForm.provider,
            model: modalForm.model,
        });
        editConnectionDialog.value = false;
        $toast({ title: response.message });
        testResult.value = null;
    }
    catch (error) {
        $toast({ title: getErrorMessage(error), variant: 'destructive' });
    }
};

const handleSaveApiKey = async () => {
    if (!apiKeyInput.value.trim()) {
        return;
    }

    try {
        const response = await saveApiKey(apiKeyInput.value.trim());
        apiKeyInput.value = '';
        $toast({ title: response.message });
        testResult.value = null;
    }
    catch (error) {
        $toast({ title: getErrorMessage(error), variant: 'destructive' });
    }
};

const handleDeleteApiKey = async () => {
    try {
        const response = await removeApiKey();
        apiKeyInput.value = '';
        $toast({ title: response.message });
        testResult.value = null;
    }
    catch (error) {
        $toast({ title: getErrorMessage(error), variant: 'destructive' });
    }
};

const handleTestConnection = async () => {
    try {
        testResult.value = await testConnection();
        if (testResult.value.success) {
            $toast({ title: testResult.value.message });
        }
    }
    catch (error) {
        testResult.value = {
            success: false,
            message: getErrorMessage(error),
        };
        $toast({ title: testResult.value.message, variant: 'destructive' });
    }
};
</script>
