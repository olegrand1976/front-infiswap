<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useReplacements } from '@/composables/useReplacements';

interface Props {
    replacementId: number | null;
    open: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const { showReplacement } = useReplacements();
const replacement = ref<any>(null);
const pending = ref(false);
const error = ref<string | null>(null);

watch(() => props.open, async (isOpen) => {
    if (isOpen && props.replacementId) {
        try {
            pending.value = true;
            error.value = null;
            const data = await showReplacement(props.replacementId);
            replacement.value = data.replacement;
        }
        catch (e) {
            error.value = e?.message || 'Erreur inconnue';
        }
        finally {
            pending.value = false;
        }
    }
},
{ immediate: false },
);

const formattedPeriods = computed(() => {
    if (!replacement.value) return [];
    if (replacement.value.periods?.length) {
        return replacement.value.periods.map((p: any) => ({
            start: new Date(p.start_date).toLocaleDateString('fr-FR'),
            end: new Date(p.end_date).toLocaleDateString('fr-FR'),
        }));
    }
    return [
        {
            start: new Date(replacement.value.start_date).toLocaleDateString('fr-FR'),
            end: new Date(replacement.value.end_date).toLocaleDateString('fr-FR'),
        },
    ];
});

const postalInfo = computed(() => {
    if (!replacement.value) return { zipCodes: '-', cities: '-' };
    const parse = (data) => {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            return Array.isArray(parsed) ? parsed.join(', ') : parsed || '-';
        }
        catch {
            return data || '-';
        }
    };
    return {
        zipCodes: parse(replacement.value.zip_codes),
        cities: parse(replacement.value.cities),
    };
});

const parsedTimeSlots = computed(() => {
    if (!replacement.value) return null;

    try {
        if (replacement.value.timeSlot) {
            const parsed = typeof replacement.value.timeSlot === 'string'
                ? JSON.parse(replacement.value.timeSlot)
                : replacement.value.timeSlot;

            if (parsed.morning || parsed.evening) {
                return {
                    type: 'multi',
                    morning: parsed.morning || null,
                    evening: parsed.evening || null,
                };
            }

            return { type: 'single', single: parsed };
        }

        if (replacement.value.details?.length) {
            return {
                type: 'details',
                slots: replacement.value.details.map((d: any) => ({
                    date: new Date(d.date).toLocaleDateString('fr-FR'),
                    start_at: d.start_at,
                    end_at: d.end_at,
                })),
            };
        }

        return null;
    }
    catch {
        return null;
    }
});

const formatPhone = (num?: string) =>
    num ? num.replace(/(\d{2})(?=\d)/g, '$1 ').trim() : '-';
</script>

<template>
    <Dialog
        :open="open"
        @update:open="emit('update:open', $event)"
    >
        <DialogContent class="max-w-4xl h-[500px] flex flex-col">
            <DialogHeader>
                <DialogTitle class="text-2xl font-semibold">
                    Détails du remplacement
                </DialogTitle>
                <DialogDescription>Informations complètes et structurées</DialogDescription>
            </DialogHeader>

            <div class="overflow-y-auto flex-1 pt-4">
                <div
                    v-if="pending"
                    class="flex justify-center py-12"
                >
                    <RollingLoader
                        :loading="pending"
                    />
                </div>

                <div
                    v-else-if="error"
                    class="text-center text-red-500 py-12"
                >
                    <p>{{ error }}</p>
                </div>

                <div v-else-if="replacement">
                    <div class="flex items-center gap-4 mb-2">
                        <div
                            v-if="replacement.type === 'immediate'"
                            class="bg-red-100 text-red-800 font-semibold text-sm px-5 py-2 rounded-md shadow-sm"
                        >
                            URGENT
                        </div>

                        <div
                            :class="[
                                'font-medium text-sm px-5 py-2 rounded-md shadow-sm capitalize',
                                replacement.status === 'open'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-200 text-gray-700']"
                        >
                            {{ replacement.status === 'open' ? 'Ouvert' : 'Fermé' }}
                        </div>
                    </div>

                    <Tabs
                        default-value="infos"
                        class="space-y-6"
                    >
                        <TabsList class="grid grid-cols-4 gap-2">
                            <TabsTrigger value="infos">
                                Infos principales
                            </TabsTrigger>
                            <TabsTrigger value="users">
                                Utilisateurs
                            </TabsTrigger>
                            <TabsTrigger value="localisation">
                                Localisation
                            </TabsTrigger>
                            <TabsTrigger value="desc">
                                Description
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="infos">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Période
                                    </h3>
                                    <div class="mt-2 space-y-2">
                                        <p
                                            v-for="(p, i) in formattedPeriods"
                                            :key="i"
                                            class="text-base"
                                        >
                                            {{ p.start }} → {{ p.end }}
                                        </p>
                                    </div>

                                    <div
                                        v-if="parsedTimeSlots"
                                        class="mt-4 space-y-2"
                                    >
                                        <template v-if="parsedTimeSlots.type === 'multi'">
                                            <div
                                                v-if="parsedTimeSlots.morning && parsedTimeSlots.morning.start_at && parsedTimeSlots.morning.end_at"
                                                class="block bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-medium mb-1"
                                            >
                                                Matin : {{ parsedTimeSlots.morning.start_at }} - {{ parsedTimeSlots.morning.end_at }}
                                            </div>

                                            <div
                                                v-if="parsedTimeSlots.evening && parsedTimeSlots.evening.start_at && parsedTimeSlots.evening.end_at"
                                                class="block bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-medium"
                                            >
                                                Soir : {{ parsedTimeSlots.evening.start_at }} - {{ parsedTimeSlots.evening.end_at }}
                                            </div>
                                        </template>

                                        <div
                                            v-else-if="parsedTimeSlots.type === 'single'"
                                            class="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-medium"
                                        >
                                            Heure : {{ parsedTimeSlots.single.start_at }} - {{ parsedTimeSlots.single.end_at }}
                                        </div>

                                        <div
                                            v-else-if="parsedTimeSlots.type === 'details'"
                                            class="space-y-1"
                                        >
                                            <div
                                                v-for="(d, i) in parsedTimeSlots.slots"
                                                :key="i"
                                                class="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-medium mr-2"
                                            >
                                                {{ d.start_at }} - {{ d.end_at }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Types de soins
                                    </h3>
                                    <div class="mt-2 flex flex-wrap gap-2">
                                        <span
                                            v-for="ct in replacement.care_types"
                                            :key="ct.id"
                                            class="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-medium text-sm"
                                        >
                                            {{ ct.name }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="users">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Créateur
                                    </h3>
                                    <p class="font-medium mt-2">
                                        {{ replacement.user_full_name }}
                                    </p>
                                    <p class="text-sm text-muted-foreground mt-1">
                                        {{ formatPhone(replacement.user_phone_number) }}
                                    </p>
                                    <p class="text-sm text-muted-foreground mt-1">
                                        {{ replacement.user_email }}
                                    </p>
                                </div>

                                <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Remplaçant
                                    </h3>
                                    <p
                                        v-if="replacement.substitute_user"
                                        class="mt-2"
                                    >
                                        <span class="font-medium">{{ replacement.substitute_user.firstname }} {{ replacement.substitute_user.lastname }}</span><br>
                                        <span class="text-sm text-muted-foreground">{{ replacement.substitute_user.email }}</span>
                                    </p>
                                    <p
                                        v-else
                                        class="italic text-muted-foreground mt-2"
                                    >
                                        Aucun remplaçant
                                    </p>
                                </div>
                            </div>

                            <Separator class="my-4" />

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div
                                    v-if="replacement.matching_users?.length"
                                    class="p-4 border rounded-lg shadow-sm bg-gray-50"
                                >
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Notifiés ({{ replacement.matching_users.length }})
                                    </h3>
                                    <div class="max-h-40 overflow-y-auto mt-2 space-y-1">
                                        <p
                                            v-for="u in replacement.matching_users"
                                            :key="u.id"
                                            class="text-sm"
                                        >
                                            {{ u.firstname }} {{ u.lastname }} <span class="text-sm text-muted-foreground mt-1">({{ u.email }})</span>
                                        </p>
                                    </div>
                                </div>

                                <div class="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col justify-center items-start">
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Intéressés
                                    </h3>
                                    <p class="text-2xl font-bold text-primary mt-2">
                                        {{ replacement.response_count }}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="localisation">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Codes Postaux
                                    </h3>
                                    <p class="mt-1 text-base">
                                        {{ postalInfo.zipCodes }}
                                    </p>
                                </div>
                                <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Villes
                                    </h3>
                                    <p class="mt-1 text-base capitalize">
                                        {{ postalInfo.cities }}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="desc">
                            <div class="grid grid-cols-1 gap-6">
                                <div class="p-4 border rounded-lg shadow-sm bg-gray-50">
                                    <h3 class="text-sm font-semibold text-muted-foreground">
                                        Description
                                    </h3>
                                    <p class="mt-2 text-base whitespace-pre-wrap text-gray-800">
                                        {{ replacement.comment || 'Aucune description fournie' }}
                                    </p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
