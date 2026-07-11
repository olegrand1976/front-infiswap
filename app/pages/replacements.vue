<template>
    <div class="container py-8 md:py-12">
        <div class="text-center mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-2">
                Remplacements & Missions disponibles
            </h1>
            <p class="text-muted-foreground font-light text-base md:text-lg">
                Explorez les opportunités près de chez vous
            </p>
        </div>

        <div class="max-w-4xl mx-auto mb-12">
            <div class="bg-surface rounded-md p-2 shadow-sm border border-border flex flex-col md:flex-row items-center gap-2">
                <Button
                    class="w-full md:w-auto rounded-md px-6 py-5 text-sm font-semibold"
                    type="button"
                >
                    Recherche remplacement
                </Button>

                <div class="w-full flex-1 flex items-center px-3 relative">
                    <Search class="w-4 h-4 text-muted-foreground absolute left-4 pointer-events-none" />
                    <Input
                        v-model="searchKeyword"
                        placeholder="Code postal, ville, jour..."
                        class="pl-9 border-0 shadow-none focus-visible:ring-0 bg-transparent"
                    />
                </div>

                <Button
                    class="w-full md:w-auto rounded-md px-8 py-5 text-sm font-semibold"
                    type="button"
                    @click="handleSearch"
                >
                    Rechercher
                </Button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <aside class="bg-surface-overlay rounded-md border border-border p-5">
                <div class="flex items-center justify-between mb-5 pb-4 border-b border-border">
                    <h2 class="text-base font-bold text-foreground">
                        Filtres
                    </h2>
                    <SlidersHorizontal class="w-4 h-4 text-primary cursor-pointer" />
                </div>

                <div class="flex items-center justify-between mb-5 bg-surface p-3 rounded-md border border-border shadow-xs">
                    <span class="text-sm font-medium text-foreground">Top remplacements</span>
                    <Switch
                        id="top-replacements"
                        :checked="filters.topReplacements"
                        @update:checked="filters.topReplacements = $event"
                    />
                </div>

                <div class="mb-5">
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Jours
                    </p>
                    <div class="grid grid-cols-2 gap-1.5">
                        <label
                            v-for="day in daysOfWeek"
                            :key="day"
                            class="flex items-center gap-2 p-2.5 bg-surface border border-border rounded-md cursor-pointer hover:bg-surface-subtle select-none transition-colors text-xs font-medium text-foreground"
                        >
                            <input
                                v-model="filters.days"
                                type="checkbox"
                                :value="day"
                                class="rounded border-border text-primary h-3.5 w-3.5 accent-primary"
                            >
                            {{ day }}
                        </label>
                    </div>
                </div>

                <div class="mb-5">
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Province
                    </p>
                    <Select v-model="filters.province">
                        <SelectTrigger class="rounded-md w-full text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent class="rounded-md">
                            <SelectItem value="Brabant wallon">Brabant wallon</SelectItem>
                            <SelectItem value="Bruxelles-Capitale">Bruxelles-Capitale</SelectItem>
                            <SelectItem value="Liège">Liège</SelectItem>
                            <SelectItem value="Hainaut">Hainaut</SelectItem>
                            <SelectItem value="Namur">Namur</SelectItem>
                            <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div class="mb-5">
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Type
                    </p>
                    <div class="flex gap-2">
                        <button
                            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border rounded-md text-[11px] font-bold transition-all outline-none"
                            type="button"
                            :class="filters.type === 'replacement' ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground bg-surface hover:border-border/70'"
                            @click="filters.type = 'replacement'"
                        >
                            <span
                                class="w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all"
                                :class="filters.type === 'replacement' ? 'border-primary bg-primary' : 'border-border'"
                            >
                                <svg v-if="filters.type === 'replacement'" class="w-2 h-2 fill-white" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" /></svg>
                            </span>
                            Remplacement
                        </button>
                        <button
                            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border rounded-md text-[11px] font-bold transition-all outline-none"
                            type="button"
                            :class="filters.type === 'mission' ? 'border-success text-success bg-success/5' : 'border-border text-muted-foreground bg-surface hover:border-border/70'"
                            @click="filters.type = 'mission'"
                        >
                            <span
                                class="w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all"
                                :class="filters.type === 'mission' ? 'border-success bg-success' : 'border-border'"
                            >
                                <svg v-if="filters.type === 'mission'" class="w-2 h-2 fill-white" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" /></svg>
                            </span>
                            Mission
                        </button>
                    </div>
                </div>

                <div class="mb-5">
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Codes postaux
                    </p>
                    <Input
                        v-model="filters.zipCode"
                        placeholder="Ajouter un code postal"
                        class="rounded-md text-sm"
                    />
                </div>

                <div class="mb-6">
                    <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Ville(s)
                    </p>
                    <Input
                        v-model="filters.city"
                        placeholder="Ajouter une ville"
                        class="rounded-md text-sm"
                    />
                </div>

                <div class="flex gap-2">
                    <Button
                        variant="outline"
                        class="flex-1 rounded-md text-xs font-semibold"
                        type="button"
                        @click="resetFilters"
                    >
                        Réinitialiser
                    </Button>
                    <Button
                        class="flex-1 rounded-md text-xs font-semibold"
                        type="button"
                        @click="applyFilters"
                    >
                        Appliquer
                    </Button>
                </div>
            </aside>

            <main class="col-span-1 lg:col-span-3 space-y-10">
                <div>
                    <h3 class="text-xl font-extrabold text-foreground flex items-center gap-2 mb-6">
                        <span class="text-primary text-2xl">★</span> À la une
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div class="bg-surface rounded-md border border-border p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200">
                            <div>
                                <div class="flex justify-between items-center mb-5">
                                    <span class="bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest">
                                        TOP
                                    </span>
                                    <span class="border border-primary/25 text-primary text-[10px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 bg-primary/5">
                                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        Remplacement
                                    </span>
                                </div>

                                <div class="flex items-start gap-3">
                                    <div class="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                        <Calendar class="w-5 h-5 text-primary" />
                                    </div>
                                    <div class="space-y-1">
                                        <h4 class="text-sm font-bold text-foreground">
                                            03/07 - 15/07/2026
                                        </h4>
                                        <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                                            <MapPin class="w-3.5 h-3.5 shrink-0" />
                                            <span>1300 Wavre</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex gap-5 mt-5 ml-15">
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Matin</span>
                                        <CheckCircle2 class="w-4 h-4 text-success" />
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Après-midi</span>
                                        <CheckCircle2 class="w-4 h-4 text-success" />
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 pt-4 border-t border-border flex justify-end">
                                <Button
                                    variant="outline"
                                    class="rounded-md text-xs font-bold px-4 h-8 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary"
                                    href="#"
                                >
                                    Voir détails
                                    <ChevronRight class="w-3.5 h-3.5 ml-0.5" />
                                </Button>
                            </div>
                        </div>

                        <div class="bg-surface rounded-md border border-border p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200">
                            <div>
                                <div class="flex justify-between items-center mb-5">
                                    <span class="bg-success text-success-foreground text-[10px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest flex items-center gap-1">
                                        <Briefcase class="w-3 h-3" />
                                        Mission
                                    </span>
                                </div>

                                <div class="flex items-start gap-3">
                                    <div class="w-12 h-12 rounded-md bg-success/10 flex items-center justify-center shrink-0">
                                        <svg class="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div class="space-y-0.5 text-muted-foreground">
                                        <h4 class="text-sm font-bold text-foreground">CHU Liège</h4>
                                        <p class="text-xs font-semibold text-primary">Contrat : CDI</p>
                                        <p class="text-xs">Infirmier(e) en soins généraux</p>
                                    </div>
                                </div>

                                <div class="flex gap-5 mt-5 ml-15">
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Matin</span>
                                        <CheckCircle2 class="w-4 h-4 text-success" />
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Après-midi</span>
                                        <CheckCircle2 class="w-4 h-4 text-success" />
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 pt-4 border-t border-border flex justify-end">
                                <Button
                                    variant="outline"
                                    class="rounded-md text-xs font-bold px-4 h-8 border-success/40 text-success hover:bg-success/5 hover:border-success"
                                    href="#"
                                >
                                    Postuler
                                    <ChevronRight class="w-3.5 h-3.5 ml-0.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
                        <h3 class="text-xl font-extrabold text-foreground">
                            Tous les résultats <span class="text-primary">(47)</span>
                        </h3>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trier par :</span>
                            <Select v-model="sortBy">
                                <SelectTrigger class="rounded-md h-8 text-xs font-semibold w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent class="rounded-md">
                                    <SelectItem value="Plus récents">Plus récents</SelectItem>
                                    <SelectItem value="Plus anciens">Plus anciens</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <div
                            v-for="(item, index) in listResults"
                            :key="index"
                            class="bg-surface hover:bg-surface-subtle rounded-md border border-border px-4 py-3.5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs cursor-pointer group"
                        >
                            <div class="flex items-center gap-3 shrink-0 sm:w-1/4">
                                <div :class="['w-9 h-9 rounded-md flex items-center justify-center shrink-0', item.type === 'replacement' ? 'bg-primary/10' : 'bg-success/10']">
                                    <Calendar v-if="item.type === 'replacement'" class="w-4 h-4 text-primary" />
                                    <Briefcase v-else class="w-4 h-4 text-success" />
                                </div>
                                <span :class="['text-[10px] font-black px-2.5 py-1 rounded-sm border uppercase tracking-wider', item.type === 'replacement' ? 'border-primary/20 text-primary bg-primary/5' : 'border-success/25 text-success bg-success/5']">
                                    {{ item.type === 'replacement' ? 'Remplacement' : 'Mission' }}
                                </span>
                            </div>

                            <div class="text-xs font-bold text-foreground sm:w-[16%]">
                                {{ item.date }}
                            </div>

                            <div class="text-xs text-foreground flex items-center gap-1 sm:w-[16%]">
                                <span class="font-bold">{{ item.zipCode }}</span>
                                <span class="text-muted-foreground">{{ item.city }}</span>
                            </div>

                            <div class="text-xs text-muted-foreground sm:w-[22%] font-medium truncate">
                                {{ item.specialty }}
                            </div>

                            <div class="flex items-center justify-between md:justify-end gap-5 sm:w-1/5 shrink-0">
                                <div class="flex gap-3">
                                    <div class="flex items-center gap-1">
                                        <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Matin</span>
                                        <CheckCircle2 class="w-3.5 h-3.5 text-success" />
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <span class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Midi</span>
                                        <CheckCircle2 class="w-3.5 h-3.5 text-success" />
                                    </div>
                                </div>
                                <ChevronRight class="w-4 h-4 text-border group-hover:text-primary transition-colors" />
                            </div>
                        </div>
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
                                    : 'bg-surface text-foreground border-border hover:bg-surface-subtle hover:border-border/70'
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
                                    : 'bg-surface text-foreground border-border hover:bg-surface-subtle'
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

                <div class="bg-linear-to-br from-primary/5 to-primary/10 border border-primary/10 rounded-md p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-primary-foreground shrink-0 shadow-md shadow-primary/20">
                            <UserPlus class="w-5 h-5" />
                        </div>
                        <div class="space-y-0.5">
                            <h4 class="text-base md:text-lg font-extrabold text-foreground leading-snug">
                                <span class="text-primary">Créez un compte gratuit</span> pour postuler aux missions
                            </h4>
                            <p class="text-muted-foreground text-sm font-light">
                                Accédez à toutes les missions, postulez en 1 clic et gérez vos disponibilités.
                            </p>
                        </div>
                    </div>
                    <Button
                        href="/register"
                        class="w-full md:w-auto rounded-md px-6 py-5 text-sm font-bold shadow-lg shadow-primary/15 whitespace-nowrap"
                    >
                        Créer mon compte gratuitement
                        <ChevronRight class="w-4 h-4" />
                    </Button>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
    SlidersHorizontal,
    Calendar,
    MapPin,
    CheckCircle2,
    Briefcase,
    Search,
    ChevronRight,
    ArrowLeft,
    ArrowRight,
    UserPlus,
} from 'lucide-vue-next';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    type: 'replacement',
    zipCode: '',
    city: '',
});

const sortBy = ref('Plus récents');
const currentPage = ref(1);

const listResults = ref([
    { type: 'replacement', date: '03/07 - 15/07/2026', zipCode: '1300', city: 'Wavre', specialty: 'Soins généraux' },
    { type: 'mission', date: '10/07 - 31/07/2026', zipCode: '1340', city: 'Ottignies', specialty: 'Soins intensifs' },
    { type: 'replacement', date: '17/07 - 24/07/2026', zipCode: '1301', city: 'Bierges', specialty: 'Gériatrie' },
    { type: 'mission', date: '01/08 - 30/09/2026', zipCode: '1400', city: 'Nivelles', specialty: 'Pédiatrie' },
]);

const handleSearch = () => {
    console.log('Search:', searchKeyword.value);
};

const applyFilters = () => {
    console.log('Filters:', { ...filters });
};

const resetFilters = () => {
    filters.topReplacements = false;
    filters.days = [];
    filters.province = 'Brabant wallon';
    filters.type = 'replacement';
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
