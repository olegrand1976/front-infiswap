<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Mes Favoris (Pools)
                </h1>
                <p class="text-gray-500">
                    Gérez vos listes d'infirmiers préférés pour vos missions.
                </p>
            </div>
            <Button
                class="rounded-md flex items-center gap-2"
                @click="showCreateModal = true"
            >
                <PlusIcon class="w-5 h-5" />
                Nouveau Pool
            </Button>
        </div>

        <div
            v-if="loading && !pools.data.length"
            class="flex justify-center py-12"
        >
            <RollingLoader />
        </div>

        <div
            v-else-if="!pools.data.length"
            class="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center"
        >
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <UsersIcon class="w-8 h-8" />
            </div>
            <h3 class="text-lg font-medium text-gray-900">
                Aucun pool de favoris
            </h3>
            <p class="text-gray-500 mt-2 max-w-sm mx-auto">
                Créez des listes d'infirmiers (ex: "Mes habitués Urgences") pour leur envoyer vos missions en priorité.
            </p>
            <Button
                variant="outline"
                class="mt-6 rounded-md"
                @click="showCreateModal = true"
            >
                Créer mon premier pool
            </Button>
        </div>

        <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            <div
                v-for="p in pools.data"
                :key="p.id"
                class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col cursor-pointer"
                @click="openPool(p)"
            >
                <div class="flex justify-between items-start mb-4">
                    <div class="bg-primary/10 text-primary p-2 rounded-lg">
                        <UsersIcon class="w-6 h-6" />
                    </div>
                    <div class="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            class="h-8 w-8 text-gray-400 hover:text-red-500"
                            @click.stop="confirmDelete(p)"
                        >
                            <TrashIcon class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <h3 class="font-bold text-gray-900 text-lg mb-1">
                    {{ p.name }}
                </h3>
                <p class="text-gray-500 text-sm line-clamp-2 grow">
                    {{ p.description || 'Aucune description' }}
                </p>
                <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                    <span class="text-gray-600 font-medium">{{ p.users_count }} membre(s)</span>
                    <span class="text-primary hover:underline flex items-center gap-1">
                        Gérer
                        <ChevronRightIcon class="w-4 h-4" />
                    </span>
                </div>
            </div>
        </div>

        <Dialog v-model:open="showCreateModal">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>{{ editingPool ? 'Modifier le Pool' : 'Créer un nouveau Pool' }}</DialogTitle>
                    <DialogDescription>
                        Donnez un nom et une description à votre liste de favoris.
                    </DialogDescription>
                </DialogHeader>
                <form
                    class="space-y-4 mt-4"
                    @submit.prevent="savePool"
                >
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">Nom du Pool *</label>
                        <InputIcon
                            v-model="poolForm.name"
                            placeholder="ex: Mes habitués Urgences"
                            required
                            rounded="md"
                        />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-gray-700">Description</label>
                        <Textarea
                            v-model="poolForm.description"
                            placeholder="Optionnel..."
                            rows="3"
                            class="rounded-md border-gray-300"
                        />
                    </div>
                    <div class="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            @click="closeModal"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            :in-progress="saving"
                        >
                            {{ editingPool ? 'Enregistrer' : 'Créer' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showMembersModal">
            <DialogContent class="max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{{ selectedPool?.name }}</DialogTitle>
                    <DialogDescription>
                        Gérez les membres de ce pool de favoris.
                    </DialogDescription>
                </DialogHeader>

                <div class="mt-4 space-y-6 overflow-y-auto pr-2">
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 class="text-sm font-semibold text-gray-900 mb-3">
                            Ajouter un infirmier au pool
                        </h4>
                        <div class="flex gap-2">
                            <div class="grow relative">
                                <InputIcon
                                    v-model="searchQuery"
                                    placeholder="Rechercher par nom ou email..."
                                    rounded="md"
                                    @input="searchUsers"
                                />
                                <div
                                    v-if="isSearching"
                                    class="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                                <div
                                    v-if="searchResults.length > 0"
                                    class="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
                                >
                                    <div
                                        v-for="u in searchResults"
                                        :key="u.id"
                                        class="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                                        @click="addNurse(u)"
                                    >
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                                                {{ u.firstname?.[0] }}{{ u.lastname?.[0] }}
                                            </div>
                                            <div>
                                                <p class="text-sm font-medium">
                                                    {{ u.full_name }}
                                                </p>
                                                <p class="text-xs text-gray-500">
                                                    {{ u.email }}
                                                </p>
                                            </div>
                                        </div>
                                        <PlusIcon class="w-4 h-4 text-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 class="text-sm font-semibold text-gray-900 mb-3">
                            Membres actuels ({{ selectedPool?.users?.length || 0 }})
                        </h4>
                        <div
                            v-if="!selectedPool?.users?.length"
                            class="text-center py-8 text-gray-500 italic border rounded-lg"
                        >
                            Aucun membre dans ce pool.
                        </div>
                        <div
                            v-else
                            class="grid grid-cols-1 gap-3"
                        >
                            <div
                                v-for="member in sortedMembers"
                                :key="member.id"
                                class="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 bg-white shadow-sm"
                            >
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                                        {{ member.firstname?.[0] }}{{ member.lastname?.[0] }}
                                    </div>
                                    <div class="overflow-hidden">
                                        <p class="text-sm font-medium truncate">
                                            {{ member.firstname }} {{ member.lastname }}
                                        </p>
                                        <div class="flex items-center gap-0.5 mt-0.5">
                                            <StarIcon
                                                v-for="i in 5"
                                                :key="i"
                                                class="w-4 h-4 cursor-pointer transition-all hover:scale-110"
                                                :class="i <= (member.pivot?.stars || 0) ? 'text-yellow-400' : 'text-gray-200'"
                                                @click="setStars(member, i)"
                                            />
                                            <span class="text-[10px] text-gray-400 ml-1 font-medium">({{ member.pivot?.stars || 0 }})</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    @click="removeNurse(member.id)"
                                >
                                    <XMarkIcon class="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6 border-t pt-4">
                    <Button
                        variant="outline"
                        @click="showMembersModal = false"
                    >
                        Fermer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showDeleteDialog">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Supprimer le Pool ?</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer le pool <strong>{{ poolToDelete?.name }}</strong> ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <div class="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        @click="showDeleteDialog = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        :in-progress="deleting"
                        @click="handleDelete"
                    >
                        Supprimer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import {
    UsersIcon,
    PlusIcon,
    TrashIcon,
    ChevronRightIcon,
    XMarkIcon,
    MagnifyingGlassIcon,
    StarIcon as StarIconOutline,
} from '@heroicons/vue/24/outline';
import { StarIcon } from '@heroicons/vue/24/solid';
import { toast } from 'vue-sonner';
import { usePools } from '~/composables/usePools';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import RollingLoader from '~/components/RollingLoader.vue';
import { debounce } from '~/lib/utils';

const { pools, loading, getAll, getById, create, update, remove, addUsers, removeUsers, updateStars } = usePools();
const { $apifetch } = useNuxtApp();

const showCreateModal = ref(false);
const showMembersModal = ref(false);
const showDeleteDialog = ref(false);
const editingPool = ref<any>(null);
const selectedPool = ref<any>(null);
const poolToDelete = ref<any>(null);
const saving = ref(false);
const deleting = ref(false);

const poolForm = reactive({
    name: '',
    description: '',
});

const searchQuery = ref('');
const isSearching = ref(false);
const searchResults = ref<any[]>([]);

const closeModal = () => {
    showCreateModal.value = false;
    editingPool.value = null;
    poolForm.name = '';
    poolForm.description = '';
};

const openPool = async (p: any) => {
    await getById(p.id);
    selectedPool.value = pools.value.data.find(item => item.id === p.id) || p;
    const res = await getById(p.id);
    selectedPool.value = res.data;
    showMembersModal.value = true;
};

const savePool = async () => {
    if (!poolForm.name.trim()) return;

    saving.value = true;
    try {
        if (editingPool.value) {
            await update(editingPool.value.id, poolForm);
            toast.success('Pool mis à jour');
        }
        else {
            await create(poolForm);
            toast.success('Pool créé');
        }
        closeModal();
        await getAll();
    }
    catch (err) {
        toast.error('Une erreur est survenue');
    }
    finally {
        saving.value = false;
    }
};

const confirmDelete = (p: any) => {
    poolToDelete.value = p;
    showDeleteDialog.value = true;
};

const handleDelete = async () => {
    if (!poolToDelete.value) return;

    deleting.value = true;
    try {
        await remove(poolToDelete.value.id);
        toast.success('Pool supprimé');
        await getAll();
        showDeleteDialog.value = false;
        poolToDelete.value = null;
    }
    catch (err) {
        toast.error('Erreur lors de la suppression');
    }
    finally {
        deleting.value = false;
    }
};

const searchUsers = debounce(async () => {
    if (searchQuery.value.length < 2) {
        searchResults.value = [];
        return;
    }

    isSearching.value = true;
    try {
        const data = await $apifetch('api/users/search', {
            params: {
                query: searchQuery.value,
                roles: 'nurse,midwife,caregiver',
            },
        });
        const currentIds = selectedPool.value?.users?.map((u: any) => u.id) || [];
        searchResults.value = data.filter((u: any) => !currentIds.includes(u.id));
    }
    catch (err) {
        console.error(err);
    }
    finally {
        isSearching.value = false;
    }
}, 300);

const addNurse = async (user: any) => {
    try {
        await addUsers(selectedPool.value.id, [user.id]);
        toast.success(`${user.firstname} ajouté au pool`);
        const res = await getById(selectedPool.value.id);
        selectedPool.value = res.data;
        searchQuery.value = '';
        searchResults.value = [];
        await getAll();
    }
    catch (err) {
        toast.error('Erreur lors de l\'ajout');
    }
};

const removeNurse = async (userId: number) => {
    try {
        await removeUsers(selectedPool.value.id, [userId]);
        toast.success('Utilisateur retiré');
        const res = await getById(selectedPool.value.id);
        selectedPool.value = res.data;
        await getAll();
    }
    catch (err) {
        toast.error('Erreur lors du retrait');
    }
};

const sortedMembers = computed(() => {
    if (!selectedPool.value?.users) return [];
    return [...selectedPool.value.users].sort((a, b) => {
        const starsA = a.pivot?.stars || 0;
        const starsB = b.pivot?.stars || 0;
        if (starsA !== starsB) return starsB - starsA;
        return (a.lastname || '').localeCompare(b.lastname || '');
    });
});

const setStars = async (member: any, count: number) => {
    const newStars = member.pivot?.stars === count ? 0 : count;

    try {
        await updateStars(selectedPool.value.id, member.id, newStars);
        if (member.pivot) {
            member.pivot.stars = newStars;
        }
        else {
            member.pivot = { stars: newStars };
        }
        toast.success('Note mise à jour');
    }
    catch (err) {
        toast.error('Erreur lors de la notation');
    }
};

onMounted(() => {
    getAll();
});
</script>
