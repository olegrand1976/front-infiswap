<script setup lang="ts">
import { useToast } from '~/components/ui/toast/use-toast';
import { Switch } from '~/components/ui/switch';

const { settings, loading, saving, fetchSettings, saveSettings } = useInamiSettings();
const { toast } = useToast();

onMounted(async () => {
    try {
        await fetchSettings();
    }
    catch {
        toast({
            title: 'Erreur',
            description: 'Impossible de charger la configuration INAMI.',
            variant: 'destructive',
        });
    }
});

async function handleToggle(enabled: boolean) {
    try {
        await saveSettings({ cobrha_enabled: enabled });
        toast({
            title: 'Enregistré',
            description: enabled
                ? 'Vérification CoBRHA activée.'
                : 'Vérification CoBRHA désactivée.',
        });
    }
    catch {
        toast({
            title: 'Erreur',
            description: 'Impossible d\'enregistrer la configuration.',
            variant: 'destructive',
        });
    }
}
</script>

<template>
    <div class="w-full">
        <DashboardAdminPageHeader title="INAMI / CoBRHA" />

        <DashboardAdminPageContent>
            <div
                v-if="loading"
                class="flex justify-center items-center py-24"
            >
                <RollingLoader :loading="loading" />
            </div>

            <div
                v-else
                class="space-y-6 max-w-2xl"
            >
                <section class="rounded-xl border bg-card text-card-foreground p-6 space-y-4">
                    <div class="space-y-1">
                        <h3 class="font-semibold text-foreground">
                            Vérification CoBRHA
                        </h3>
                        <p class="text-sm text-foreground/60">
                            Contrôle asynchrone du numéro INAMI via le registre eHealth (profils Belgique uniquement).
                            Désactivé par défaut tant que l'accès partenaire n'est pas validé.
                        </p>
                    </div>

                    <div class="flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
                        <div class="space-y-0.5">
                            <p class="text-sm font-medium">
                                Activer CoBRHA
                            </p>
                            <p class="text-xs text-foreground/50">
                                À la connexion : job de vérification + notification si invalide.
                            </p>
                        </div>
                        <Switch
                            :checked="!!settings?.cobrha_enabled"
                            :disabled="saving"
                            @update:checked="handleToggle"
                        />
                    </div>

                    <dl
                        v-if="settings?.modified_at"
                        class="rounded-lg border divide-y text-sm"
                    >
                        <div class="flex items-center justify-between gap-4 px-4 py-3">
                            <dt class="text-foreground/60">
                                Modifié le
                            </dt>
                            <dd class="font-medium text-foreground">
                                {{ new Date(settings.modified_at).toLocaleString('fr-BE') }}
                            </dd>
                        </div>
                        <div
                            v-if="settings.modified_by"
                            class="flex items-center justify-between gap-4 px-4 py-3"
                        >
                            <dt class="text-foreground/60">
                                Par
                            </dt>
                            <dd class="font-medium text-foreground">
                                {{ settings.modified_by.name }}
                            </dd>
                        </div>
                    </dl>
                </section>
            </div>
        </DashboardAdminPageContent>
    </div>
</template>
