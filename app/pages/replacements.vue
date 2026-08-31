<template>
    <div class="container pb-8 relative">
        <div class="text-center my-4">
            <p class="text-muted-foreground font-light text-base md:text-lg">
                Explorez les opportunités près de chez vous
            </p>
        </div>

        <div class="max-w-2xl mx-auto mb-12">
            <div class="bg-surface rounded-md p-2 shadow-sm border border-border flex flex-col md:flex-row items-center gap-2">
                <div class="w-full flex-1 flex items-center px-3 relative">
                    <Search class="w-4 h-4 text-muted-foreground absolute left-4 pointer-events-none" />
                    <Input
                        v-model="searchKeyword"
                        placeholder="Code postal, ville, jour..."
                        class="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent"
                    />
                </div>

                <Button
                    class="w-full md:w-auto rounded-md px-8"
                    type="button"
                    @click="handleSearch"
                >
                    <Search class="w-4 h-4" />
                    Rechercher
                </Button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[22%_1fr_22%] gap-8 items-start">
            <aside class="bg-primary rounded-md p-5">
                <div class="flex items-center justify-between mb-5 pb-4 border-b border-primary-foreground/20">
                    <h2 class="text-base font-bold text-primary-foreground">
                        Filtres
                    </h2>
                    <SlidersHorizontal class="w-4 h-4 text-primary-foreground cursor-pointer" />
                </div>

                <label class="flex items-center justify-between mb-5 p-3 rounded-md cursor-pointer">
                    <span class="text-sm font-medium text-primary-foreground">Top remplacements</span>
                    <Switch
                        id="top-replacements"
                        :checked="filters.topReplacements"
                        @update:checked="filters.topReplacements = $event"
                    />
                </label>

                <div class="mb-5">
                    <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-2">
                        Codes postaux
                    </p>
                    <Input
                        v-model="filters.zipCode"
                        placeholder="Ajouter un code postal"
                        class="rounded-md text-sm bg-surface"
                    />
                </div>

                <div class="mb-5">
                    <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-2">
                        Ville(s)
                    </p>
                    <Input
                        v-model="filters.city"
                        placeholder="Ajouter une ville"
                        class="rounded-md text-sm bg-surface"
                    />
                </div>

                <div class="mb-5">
                    <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-3">
                        Jours
                    </p>
                    <div class="grid grid-cols-2 gap-1.5">
                        <label
                            v-for="day in daysOfWeek"
                            :key="day"
                            class="flex items-center gap-2 p-2.5 rounded-md cursor-pointer hover:bg-primary-foreground/10 select-none transition-colors text-xs font-medium text-primary-foreground"
                        >
                            <Checkbox
                                :checked="filters.days.includes(day)"
                                class="border-primary-foreground/50 data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary"
                                @update:checked="(v) => toggleDay(day, v === true)"
                            />
                            {{ day }}
                        </label>
                    </div>
                </div>

                <div class="mb-5">
                    <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-2">
                        Province
                    </p>
                    <Select v-model="filters.province">
                        <SelectTrigger class="rounded-md w-full text-sm bg-surface">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent class="rounded-md">
                            <SelectItem value="Brabant wallon">
                                Brabant wallon
                            </SelectItem>
                            <SelectItem value="Bruxelles-Capitale">
                                Bruxelles-Capitale
                            </SelectItem>
                            <SelectItem value="Liège">
                                Liège
                            </SelectItem>
                            <SelectItem value="Hainaut">
                                Hainaut
                            </SelectItem>
                            <SelectItem value="Namur">
                                Namur
                            </SelectItem>
                            <SelectItem value="Luxembourg">
                                Luxembourg
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="mb-6">
                    <p class="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider mb-2">
                        Types
                    </p>
                    <label class="flex items-center justify-between mb-2 p-3 rounded-md cursor-pointer">
                        <span class="text-sm font-medium text-primary-foreground">Remplacements</span>
                        <Switch
                            :checked="filters.showReplacements"
                            @update:checked="filters.showReplacements = $event"
                        />
                    </label>
                    <label class="flex items-center justify-between p-3 rounded-md cursor-pointer">
                        <span class="text-sm font-medium text-primary-foreground">Missions</span>
                        <Switch
                            :checked="filters.showMissions"
                            @update:checked="filters.showMissions = $event"
                        />
                    </label>
                </div>

                <div class="flex gap-2">
                    <Button
                        variant="outline"
                        class="flex-1 rounded-md text-xs font-semibold border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                        type="button"
                        @click="resetFilters"
                    >
                        Réinitialiser
                    </Button>
                </div>
            </aside>

            <main class="space-y-10">
                <div>
                    <h3 class="font-secondary text-xl font-extrabold text-foreground flex items-center gap-2 mb-6">
                        <span class="text-primary text-2xl">★</span> À la une
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Card
                            variant="none"
                            class="bg-surface p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-200"
                        >
                            <div>
                                <div class="flex items-center mb-5">
                                    <span class="text-primary text-[10px] font-black uppercase tracking-widest">Remplacement</span>
                                </div>

                                <div class="flex items-start gap-3">
                                    <div class="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                        <Calendar class="w-5 h-5 text-primary" />
                                    </div>
                                    <div class="space-y-1">
                                        <h4 class="font-primary text-sm font-bold text-foreground tabular-nums">
                                            03/07 - 15/07/2026
                                        </h4>
                                        <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                                            <MapPin class="w-3.5 h-3.5 shrink-0" />
                                            <span>1300 Wavre</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex gap-4 mt-5 ml-15">
                                    <div
                                        v-for="slot in ['Matin', 'Après-midi']"
                                        :key="slot"
                                        class="flex items-center gap-1.5"
                                    >
                                        <span class="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                                            <Check class="w-3 h-3" />
                                        </span>
                                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{{ slot }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 pt-4 border-t border-border flex justify-end">
                                <NuxtLink
                                    to="/replacements/101"
                                    class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                                >
                                    Voir plus
                                </NuxtLink>
                            </div>
                        </Card>

                        <Card
                            variant="none"
                            class="bg-surface p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-200"
                        >
                            <div>
                                <div class="flex items-center mb-5">
                                    <span class="text-success text-[10px] font-black uppercase tracking-widest">Mission</span>
                                </div>

                                <div class="flex items-start gap-3">
                                    <div class="w-12 h-12 rounded-md bg-success/10 flex items-center justify-center shrink-0">
                                        <Briefcase class="w-5 h-5 text-success" />
                                    </div>
                                    <div class="space-y-0.5 text-muted-foreground">
                                        <h4 class="text-sm font-bold text-foreground">
                                            CHU Liège
                                        </h4>
                                        <p class="text-xs font-semibold text-primary">
                                            Contrat : CDI
                                        </p>
                                        <p class="text-xs">
                                            Infirmier(e) en soins généraux
                                        </p>
                                    </div>
                                </div>

                                <div class="flex gap-4 mt-5 ml-15">
                                    <div
                                        v-for="slot in ['Matin', 'Après-midi']"
                                        :key="slot"
                                        class="flex items-center gap-1.5"
                                    >
                                        <span class="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                                            <Check class="w-3 h-3" />
                                        </span>
                                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{{ slot }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 pt-4 border-t border-border flex justify-end">
                                <NuxtLink
                                    to="/replacements/102"
                                    class="inline-flex items-center gap-1 text-xs font-bold text-success hover:underline"
                                >
                                    Voir plus
                                </NuxtLink>
                            </div>
                        </Card>
                    </div>
                </div>

                <div>
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
                        <h3 class="font-secondary text-xl font-extrabold text-foreground">
                            Tous les résultats <span class="text-primary tabular-nums">(47)</span>
                        </h3>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trier par :</span>
                            <Select v-model="sortBy">
                                <SelectTrigger class="rounded-md h-8 text-xs font-semibold w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent class="rounded-md">
                                    <SelectItem value="Plus récents">
                                        Plus récents
                                    </SelectItem>
                                    <SelectItem value="Plus anciens">
                                        Plus anciens
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-5">
                        <Card
                            v-for="(item, index) in listResults"
                            :key="index"
                            variant="none"
                            class="relative bg-surface border rounded-md p-5 flex flex-col gap-3 hover:shadow-xl transition-shadow duration-200"
                        >
                            <Badge
                                v-if="item.isNew"
                                variant="outline"
                                class="!h-auto !w-auto absolute top-0 right-4 -translate-y-1/2 rounded-full bg-accent-green text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest shadow-md"
                            >
                                Nouveau
                            </Badge>

                            <div class="flex items-start gap-3">
                                <div :class="['w-10 h-10 rounded-md flex items-center justify-center shrink-0', item.type === 'replacement' ? 'bg-primary/10' : 'bg-success/10']">
                                    <Calendar
                                        v-if="item.type === 'replacement'"
                                        class="w-4.5 h-4.5 text-primary"
                                    />
                                    <Briefcase
                                        v-else
                                        class="w-4.5 h-4.5 text-success"
                                    />
                                </div>
                                <div>
                                    <h4 class="font-primary text-sm font-bold text-foreground tabular-nums">
                                        {{ item.date }}
                                    </h4>
                                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs mt-0.5">
                                        <MapPin class="w-3 h-3 shrink-0" />
                                        {{ item.city }}
                                    </div>
                                </div>
                                <div
                                    v-if="item.isUrgent"
                                    class="flex flex-col text-destructive items-center gap-0.5 shrink-0 ml-auto"
                                >
                                    <ShieldAlert class="size-10" />
                                    <span class="text-[8px] uppercase font-bold">urgent</span>
                                </div>
                            </div>

                            <div
                                v-if="item.institution"
                                class="flex items-center gap-2 bg-surface-subtle rounded-md px-2.5 py-2"
                            >
                                <span class="w-6 h-6 rounded shrink-0 bg-success/20 text-success flex items-center justify-center text-[10px] font-black">
                                    {{ item.institution.initial }}
                                </span>
                                <div class="leading-tight">
                                    <p class="text-xs font-bold text-foreground">
                                        {{ item.institution.name }}
                                    </p>
                                    <p class="text-[10px] text-muted-foreground">
                                        {{ item.institution.contract }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-start gap-2">
                                <MapPin class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                <p class="text-xs font-semibold text-foreground">
                                    {{ visibleTags(item.zipCodes).shown.join(', ') }}
                                    <span
                                        v-if="visibleTags(item.zipCodes).extra > 0"
                                        class="text-primary font-bold"
                                    >
                                        +{{ visibleTags(item.zipCodes).extra }}
                                    </span>
                                </p>
                            </div>

                            <div class="flex items-start gap-2">
                                <Activity class="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                <p class="text-xs font-semibold text-foreground">
                                    {{ visibleTags(item.careTypes).shown.join(', ') }}
                                    <span
                                        v-if="visibleTags(item.careTypes).extra > 0"
                                        class="text-primary font-bold"
                                    >
                                        +{{ visibleTags(item.careTypes).extra }}
                                    </span>
                                </p>
                            </div>

                            <p
                                v-if="item.description"
                                class="text-xs text-muted-foreground italic line-clamp-2"
                            >
                                {{ item.description }}
                            </p>

                            <div class="flex items-center justify-between gap-3 pt-3 border-t border-border mt-auto">
                                <div class="flex gap-3">
                                    <div
                                        v-for="slot in item.slots"
                                        :key="slot"
                                        class="flex items-center gap-1"
                                    >
                                        <span class="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                                            <Check class="w-3 h-3" />
                                        </span>
                                        <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{{ slot }}</span>
                                    </div>
                                </div>

                                <div class="flex items-center gap-3">
                                    <span
                                        v-if="item.patientsPerDay"
                                        class="flex items-center gap-1 text-xs font-semibold text-muted-foreground"
                                    >
                                        <Users class="w-3.5 h-3.5 text-primary" />
                                        {{ item.patientsPerDay }}/j
                                    </span>
                                    <NuxtLink
                                        :to="`/replacements/${item.id}`"
                                        class="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                                        :class="item.type === 'replacement' ? 'text-primary' : 'text-success'"
                                    >
                                        Voir plus
                                    </NuxtLink>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div class="mt-6 flex justify-center">
                    <nav class="flex items-center gap-1">
                        <button
                            class="w-9 h-9 flex items-center justify-center rounded-md border border-border hover:bg-surface-subtle text-muted-foreground transition-colors"
                            type="button"
                        >
                            <ArrowLeft class="w-3.5 h-3.5" />
                        </button>

                        <button
                            v-for="p in [1, 2, 3]"
                            :key="p"
                            type="button"
                            :class="[
                                'w-9 h-9 flex items-center justify-center rounded-md font-bold text-sm transition-colors border',
                                p === currentPage
                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                    : 'bg-surface text-foreground border-border hover:bg-surface-subtle hover:border-border/70',
                            ]"
                            @click="currentPage = p"
                        >
                            {{ p }}
                        </button>

                        <span class="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">...</span>

                        <button
                            type="button"
                            :class="[
                                'w-9 h-9 flex items-center justify-center rounded-md font-bold text-sm transition-colors border',
                                8 === currentPage
                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                    : 'bg-surface text-foreground border-border hover:bg-surface-subtle',
                            ]"
                            @click="currentPage = 8"
                        >
                            8
                        </button>

                        <button
                            class="w-9 h-9 flex items-center justify-center rounded-md border border-border hover:bg-surface-subtle text-muted-foreground transition-colors"
                            type="button"
                        >
                            <ArrowRight class="w-3.5 h-3.5" />
                        </button>
                    </nav>
                </div>
            </main>

            <div class="hidden xl:flex flex-col gap-6 self-stretch">
                <div class="bg-surface rounded-md border border-border p-5">
                    <h2 class="font-secondary text-sm font-extrabold text-foreground mb-4">
                        Ça commence bientôt
                    </h2>
                    <div class="divide-y divide-border">
                        <div
                            v-for="soonItem in soonItems"
                            :key="soonItem.title"
                            class="py-3 first:pt-0 last:pb-0 flex flex-col gap-1"
                        >
                            <div class="flex items-start justify-between gap-2">
                                <div class="flex items-center gap-1.5 min-w-0">
                                    <Calendar
                                        v-if="soonItem.type === 'replacement'"
                                        class="w-3.5 h-3.5 text-primary shrink-0"
                                    />
                                    <Briefcase
                                        v-else
                                        class="w-3.5 h-3.5 text-success shrink-0"
                                    />
                                    <span class="font-primary text-xs font-bold text-foreground tabular-nums truncate">{{ soonItem.title }}</span>
                                </div>
                                <Badge
                                    variant="outline"
                                    class="!h-auto !w-auto shrink-0 rounded-full text-[10px] font-black px-2 py-0.5"
                                    :class="soonItem.urgency === 'critical' ? 'bg-destructive/12 text-destructive' : soonItem.urgency === 'soon' ? 'bg-warning/20 text-warning' : 'bg-surface-subtle text-muted-foreground'"
                                >
                                    {{ soonItem.countdown }}
                                </Badge>
                            </div>
                            <p class="text-xs text-muted-foreground pl-5">
                                {{ soonItem.meta }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="bg-primary rounded-md p-6 flex flex-col items-center text-center gap-3 sticky top-20">
                    <div class="w-11 h-11 rounded-md bg-primary-foreground/15 flex items-center justify-center text-primary-foreground shrink-0">
                        <UserPlus class="w-5 h-5" />
                    </div>
                    <h3 class="font-secondary text-sm font-extrabold text-primary-foreground leading-snug">
                        Créez un compte gratuit pour postuler aux missions
                    </h3>
                    <p class="text-primary-foreground/70 text-xs font-light">
                        Accédez à toutes les missions, postulez en 1 clic et gérez vos disponibilités.
                    </p>
                    <Button
                        href="/register"
                        class="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
                    >
                        Créer mon compte
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
    SlidersHorizontal,
    Calendar,
    MapPin,
    Check,
    Briefcase,
    Search,
    ArrowLeft,
    ArrowRight,
    UserPlus,
    Activity,
    Users,
    ShieldAlert,
} from 'lucide-vue-next';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

useHead({
    title: 'Remplacements & Missions disponibles',
    meta: [
        {
            name: 'description',
            content: 'Découvrez les dernières offres de remplacements et missions disponibles pour les infirmières et infirmiers. Filtrez par région, date et spécialité.',
        },
    ],
});

definePageMeta({
    layout: 'replacements',
});

const searchKeyword = ref('');
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

const filters = reactive({
    topReplacements: true,
    days: [] as string[],
    province: 'Brabant wallon',
    showReplacements: true,
    showMissions: true,
    zipCode: '',
    city: '',
});

const toggleDay = (day: string, checked: boolean) => {
    if (checked) {
        if (!filters.days.includes(day)) filters.days.push(day);
        return;
    }
    filters.days = filters.days.filter(d => d !== day);
};

const sortBy = ref('Plus récents');
const currentPage = ref(1);

// Zip codes / care types can hold anywhere from 1 to 10+ values — only the
// first 3 are shown, the rest collapse into a "+N" chip (see visibleTags).
const listResults = ref([
    {
        id: 1,
        type: 'replacement',
        date: '03/07 → 15/07/2026',
        city: 'Wavre',
        zipCodes: ['1300', '1301'],
        careTypes: ['Soins généraux'],
        slots: ['Matin', 'Après-midi'],
        description: 'Remplacement suite à un congé maternité, service de médecine interne, équipe de 6 infirmiers.',
    },
    {
        id: 2,
        type: 'mission',
        date: '10/07 → 31/07/2026',
        city: 'Liège',
        zipCodes: ['4000'],
        careTypes: ['Soins intensifs'],
        slots: ['Matin'],
        isBoosted: true,
        patientsPerDay: 8,
        institution: { initial: 'CH', name: 'CHU Liège', contract: 'Contrat CDI · Infirmier(e) en soins intensifs' },
    },
    {
        id: 3,
        type: 'replacement',
        date: '17/07 → 24/07/2026',
        city: 'Bierges +6 autres',
        zipCodes: ['1301', '1300', '1340', '1341', '1342', '1348', '1367'],
        careTypes: ['Gériatrie', 'Soins palliatifs', 'Pansements', 'Toilette', 'Aide au repas', 'Kinésithérapie', 'Suivi médical', 'Prise de sang', 'Diabétologie', 'Cardiologie'],
        slots: ['Matin', 'Après-midi'],
        isUrgent: true,
        description: 'Remplacement suite à un arrêt maladie en maison de repos, plusieurs sites, ambiance calme et familiale.',
    },
    {
        id: 4,
        type: 'mission',
        date: '01/08 → 30/09/2026',
        city: 'Nivelles',
        zipCodes: ['1400'],
        careTypes: ['Maternité'],
        slots: ['Après-midi'],
        patientsPerDay: 5,
        institution: { initial: 'CS', name: 'Clinique Saint-Pierre', contract: 'Contrat CDD 6 mois · Sage-femme' },
    },
    {
        id: 5,
        type: 'replacement',
        date: '05/08 → 12/08/2026',
        city: 'Namur +9 autres',
        zipCodes: ['5000', '5001', '5002', '5003', '5004', '5010', '5020', '5024', '5030', '5031'],
        careTypes: ['Pédiatrie', 'Néonatologie', 'Vaccination', 'Suivi de croissance', 'Urgences pédiatriques'],
        slots: ['Matin', 'Après-midi'],
        description: 'Service de pédiatrie générale, plusieurs implantations, ambiance familiale et bienveillante.',
    },
    {
        id: 6,
        type: 'replacement',
        date: '20/08 → 27/08/2026',
        city: 'Arlon',
        zipCodes: ['6700', '6717', '6721'],
        careTypes: ['Soins à domicile', 'Pansements', 'Injections'],
        slots: ['Matin'],
        isNew: true,
        description: 'Tournée de soins à domicile, patientèle fidélisée, véhicule non fourni.',
    },
]);

const visibleTags = (tags: string[], max = 3) => ({
    shown: tags.slice(0, max),
    extra: Math.max(0, tags.length - max),
});

const soonItems = ref([
    { type: 'replacement', title: '30/08 → Wavre', meta: 'Soins généraux', countdown: 'J-2', urgency: 'critical' },
    { type: 'mission', title: '03/09 → Liège', meta: 'CHU Liège · Soins intensifs', countdown: 'J-6', urgency: 'critical' },
    { type: 'replacement', title: '06/09 → Namur', meta: 'Pédiatrie', countdown: 'J-9', urgency: 'soon' },
    { type: 'mission', title: '13/09 → Nivelles', meta: 'Clinique Saint-Pierre · Maternité', countdown: 'J-16', urgency: 'calm' },
]);

const handleSearch = () => {
    console.log('Search:', searchKeyword.value);
};

const resetFilters = () => {
    filters.topReplacements = false;
    filters.days = [];
    filters.province = 'Brabant wallon';
    filters.showReplacements = true;
    filters.showMissions = true;
    filters.zipCode = '';
    filters.city = '';
};
</script>

<style scoped>
.ml-15 {
    margin-left: 3.75rem;
}
@media (max-width: 640px) {
    .ml-15 {
        margin-left: 0;
    }
}
</style>
