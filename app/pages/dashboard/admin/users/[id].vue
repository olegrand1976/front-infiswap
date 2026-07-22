<template>
    <div>
        <DashboardAdminPageHeader title="Mise à jour utilisateur" />
        <DashboardAdminPageContent class="bg-gray-100 space-y-6">
            <div
                v-if="user"
                class="bg-white rounded-lg shadow p-6"
            >
                <CrmCommercialFollowUpPanel
                    ref="followUpPanelRef"
                    :crm-user-id="user.crm?.id ?? null"
                    :user-id="user.id"
                    :client-type="user.crm?.client_type ?? 'user'"
                    :entity-label="user.full_name"
                    :counters="userCrmCounters"
                    :last-contact-date="user.crm?.last_contact_date"
                    :last-contact-method="user.crm?.last_contact_method"
                    :last-comment="lastCommentDisplay"
                    @action="onFollowUpAction"
                    @crm-updated="onUserCrmUpdated"
                />
            </div>

            <UsersAdminForm
                v-if="user"
                :user="user"
            />
        </DashboardAdminPageContent>

        <Dialog v-model:open="contactDialogOpen">
            <DialogContent class="bg-white rounded-lg p-6 max-w-md w-full">
                <DialogHeader>
                    <DialogTitle class="text-lg font-semibold text-primary mb-4">
                        Modifier le contact
                    </DialogTitle>
                </DialogHeader>
                <form
                    class="space-y-4"
                    @submit.prevent="saveContact"
                >
                    <div>
                        <label
                            for="userShowContactDate"
                            class="block mb-1 text-sm font-medium text-gray-700"
                        >
                            Date de contact
                        </label>
                        <InputIcon
                            id="userShowContactDate"
                            v-model="tempContactDate"
                            type="date"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <span class="block mb-1 text-sm font-medium text-gray-700">Mode de contact</span>
                        <div class="flex flex-wrap gap-4">
                            <label class="inline-flex items-center">
                                <input
                                    v-model="tempContactMethod"
                                    type="radio"
                                    value="mail"
                                    class="form-radio"
                                >
                                <span class="ml-2">Mail</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    v-model="tempContactMethod"
                                    type="radio"
                                    value="phone"
                                    class="form-radio"
                                >
                                <span class="ml-2">Téléphone</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input
                                    v-model="tempContactMethod"
                                    type="radio"
                                    value="visio"
                                    class="form-radio"
                                >
                                <span class="ml-2">Visioconférence</span>
                            </label>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            class="rounded"
                            @click="contactDialogOpen = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            class="rounded"
                            :in-progress="savingContact"
                        >
                            Valider
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="commentDialogOpen">
            <DialogContent class="bg-white rounded-lg w-full sm:max-w-[700px] p-6">
                <DialogHeader>
                    <DialogTitle class="text-primary">
                        Nouveau commentaire
                    </DialogTitle>
                </DialogHeader>
                <form
                    class="space-y-4"
                    @submit.prevent="saveComment"
                >
                    <Textarea
                        v-model="tempComment"
                        class="w-full min-h-24"
                        placeholder="Ajouter un commentaire CRM…"
                    />
                    <div class="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            class="rounded"
                            @click="commentDialogOpen = false"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            class="rounded"
                            :in-progress="savingComment"
                            :disabled="!tempComment.trim()"
                        >
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="referrerDialogOpen">
            <DialogContent class="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle class="font-semibold">
                        Apporté par
                    </DialogTitle>
                </DialogHeader>
                <CrmReferrerPicker
                    v-model:mode="referrerMode"
                    v-model:selected-referrer="selectedReferrer"
                    v-model:referrer-text="tempReferrerText"
                    :referrers="userReferrer"
                    text-input-id="userShowReferrerText"
                    autocomplete-input-id="userShowReferrerAutocomplete"
                />
                <div class="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        class="rounded"
                        @click="referrerDialogOpen = false"
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        class="rounded"
                        :in-progress="savingReferrer"
                        @click="saveReferrer"
                    >
                        Valider
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import type { Referrer, User } from '~/lib/types';
import CrmCommercialFollowUpPanel from '@/components/crm/CrmCommercialFollowUpPanel.vue';
import type { CrmFollowUpAction } from '@/components/crm/CrmCommercialFollowUpPanel.vue';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputIcon } from '@/components/ui/input-with-icon';
import { Textarea } from '@/components/ui/textarea';

useHead({ title: 'Mis à jour utilisateur' });

definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const user = ref<User | null>(null);
const { show } = useAuth();
const { updateCrmUser } = useCrm();
const { store: storeComment } = useComment();
const { updateReferrer, userReferrer, getUserReferrer } = useReferrer();
const { $toast } = useNuxtApp();
const id = computed(() => route.params.id);

const followUpPanelRef = ref<{ reloadHistories: () => Promise<void> } | null>(null);

const contactDialogOpen = ref(false);
const commentDialogOpen = ref(false);
const referrerDialogOpen = ref(false);
const savingContact = ref(false);
const savingComment = ref(false);
const savingReferrer = ref(false);

const tempContactDate = ref('');
const tempContactMethod = ref('mail');
const tempComment = ref('');
const referrerMode = ref<'account' | 'text'>('account');
const selectedReferrer = ref<Referrer | null>(null);
const tempReferrerText = ref('');

const userCrmCounters = computed(() => {
    const crm = user.value?.crm;
    if (!crm) {
        return null;
    }
    return {
        nb_call: crm.nb_call ?? 0,
        nb_sale: crm.nb_sale ?? 0,
        nb_recommandation: crm.nb_recommandation ?? 0,
        nb_meeting: crm.nb_meeting ?? 0,
        nb_pending: crm.nb_pending ?? 0,
    };
});

const lastCommentDisplay = computed(() => {
    if (!user.value) {
        return '';
    }
    return user.value.last_comment?.body
        ?? user.value.comment_crm
        ?? user.value.crm?.last_comment
        ?? '';
});

async function onFollowUpAction(type: CrmFollowUpAction) {
    if (!user.value) {
        return;
    }

    switch (type) {
        case 'contact':
            tempContactDate.value = user.value.crm?.last_contact_date ?? '';
            tempContactMethod.value = user.value.crm?.last_contact_method ?? 'mail';
            contactDialogOpen.value = true;
            break;
        case 'comment':
            tempComment.value = '';
            commentDialogOpen.value = true;
            break;
        case 'referrer': {
            const referrer = user.value.referred_by;
            if (referrer?.text) {
                referrerMode.value = 'text';
                tempReferrerText.value = referrer.text;
                selectedReferrer.value = null;
            }
            else if (referrer?.id) {
                referrerMode.value = 'account';
                tempReferrerText.value = '';
                selectedReferrer.value = referrer;
            }
            else {
                referrerMode.value = 'account';
                tempReferrerText.value = '';
                selectedReferrer.value = null;
            }
            await getUserReferrer();
            referrerDialogOpen.value = true;
            break;
        }
        default: {
            const _exhaustive: never = type;
            return _exhaustive;
        }
    }
}

function onUserCrmUpdated(crm: Record<string, unknown>) {
    if (!user.value) {
        return;
    }
    user.value = {
        ...user.value,
        crm: {
            ...user.value.crm,
            id: user.value.crm?.id ?? (Number(crm.id) || 0),
            user_id: user.value.id,
            client_type: user.value.crm?.client_type ?? 'user',
            created_at: user.value.crm?.created_at ?? '',
            nb_call: Number(crm.nb_call) || 0,
            nb_sale: Number(crm.nb_sale) || 0,
            nb_recommandation: Number(crm.nb_recommandation) || 0,
            nb_meeting: Number(crm.nb_meeting) || 0,
            nb_pending: Number(crm.nb_pending) || 0,
            last_contact_date: (crm.last_contact_date as string | undefined) ?? user.value.crm?.last_contact_date,
            last_contact_method: (crm.last_contact_method as string | undefined) ?? user.value.crm?.last_contact_method,
        },
    };
}

async function saveContact() {
    if (!user.value) {
        return;
    }

    savingContact.value = true;
    try {
        const crmId = user.value.crm?.id ?? 0;
        const response = await updateCrmUser(crmId, {
            userId: user.value.id,
            clientType: user.value.crm?.client_type ?? 'user',
            lastContactDate: tempContactDate.value || null,
            lastContactMethod: tempContactMethod.value || null,
        });
        onUserCrmUpdated({
            id: response.crm?.id ?? crmId,
            ...(response.crm ?? {}),
            last_contact_date: tempContactDate.value,
            last_contact_method: tempContactMethod.value,
        });
        await followUpPanelRef.value?.reloadHistories();
        contactDialogOpen.value = false;
        $toast({ description: response.message ?? 'Contact mis à jour.', variant: 'success' });
    }
    catch {
        $toast({ description: 'Erreur lors de l\'enregistrement du contact.', variant: 'destructive' });
    }
    finally {
        savingContact.value = false;
    }
}

async function saveComment() {
    if (!user.value || !tempComment.value.trim()) {
        return;
    }

    savingComment.value = true;
    try {
        const comment = await storeComment(user.value.id, 'User', tempComment.value.trim());
        user.value = {
            ...user.value,
            last_comment: comment,
            crm: user.value.crm
                ? { ...user.value.crm, last_comment: tempComment.value.trim() }
                : user.value.crm,
        };
        await followUpPanelRef.value?.reloadHistories();
        commentDialogOpen.value = false;
        $toast({ description: 'Commentaire enregistré.', variant: 'success' });
    }
    catch {
        $toast({ description: 'Erreur lors de l\'enregistrement du commentaire.', variant: 'destructive' });
    }
    finally {
        savingComment.value = false;
    }
}

async function saveReferrer() {
    if (!user.value) {
        return;
    }

    const payload = referrerMode.value === 'text'
        ? {
                referred_by: null,
                referred_by_text: tempReferrerText.value.trim() || null,
            }
        : {
                referred_by: selectedReferrer.value?.id ?? null,
                referred_by_text: null,
            };

    savingReferrer.value = true;
    try {
        const response = await updateReferrer(user.value.id, payload);
        user.value = {
            ...user.value,
            referred_by: response,
        };
        referrerDialogOpen.value = false;
        $toast({ description: 'Apporté par mis à jour.', variant: 'success' });
    }
    catch {
        $toast({ description: 'Erreur lors de la mise à jour de l\'apporteur.', variant: 'destructive' });
    }
    finally {
        savingReferrer.value = false;
    }
}

await show(Number(id.value)).then((response) => {
    user.value = response.user;
});
</script>
