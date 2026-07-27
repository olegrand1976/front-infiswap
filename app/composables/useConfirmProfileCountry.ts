import { toast } from 'vue-sonner';
import type { User } from '~/lib/types';
import type { ReplacementCountryCode } from '~/lib/replacementCountry';
import {
    needsProfileCountryConfirmation,
    workingAtFromCountryCode,
} from '~/utils/profileCountry';

export function useConfirmProfileCountry() {
    const user = useState<User>('user');
    const { $apifetch } = useNuxtApp();

    const showModal = ref(false);
    const pending = ref(false);
    let resolvePick: ((code: ReplacementCountryCode) => void) | null = null;
    let rejectPick: ((reason?: unknown) => void) | null = null;

    function needsConfirmation(): boolean {
        const u = user.value;
        if (
            u?.institution
            || u?.account_type === 'institution'
            || u?.type === 'institution'
        ) {
            return false;
        }

        return needsProfileCountryConfirmation(u?.profile);
    }

    async function ensureProfileCountry(): Promise<boolean> {
        if (!needsConfirmation()) {
            return true;
        }

        showModal.value = true;

        try {
            const code = await new Promise<ReplacementCountryCode>((resolve, reject) => {
                resolvePick = resolve;
                rejectPick = reject;
            });
            await persistCountry(code);
            return true;
        }
        catch {
            return false;
        }
        finally {
            showModal.value = false;
            resolvePick = null;
            rejectPick = null;
        }
    }

    function applyCountryToLocalUser(code: ReplacementCountryCode, apiUser?: User): void {
        const workingAt = workingAtFromCountryCode(code);
        const base = apiUser ? { ...user.value, ...apiUser } : { ...user.value };

        user.value = {
            ...base,
            profile: {
                ...(user.value.profile ?? {}),
                ...(typeof base.profile === 'object' && base.profile ? base.profile : {}),
                country: code,
                working_at: workingAt,
            },
        };
    }

    async function persistCountry(code: ReplacementCountryCode): Promise<void> {
        pending.value = true;
        try {
            const response = await $apifetch<{ user?: User }>(`/api/users/${user.value.id}/profile-country`, {
                method: 'PUT',
                body: { country: code },
            });

            // UserResource aplati le profil sur la racine : forcer aussi user.profile.
            applyCountryToLocalUser(code, response?.user);
            toast.success('Pays enregistré');
        }
        catch (error) {
            toast.error('Impossible d\'enregistrer le pays');
            throw error;
        }
        finally {
            pending.value = false;
        }
    }

    async function onSelect(code: ReplacementCountryCode): Promise<void> {
        if (resolvePick) {
            resolvePick(code);
            return;
        }

        showModal.value = true;
        try {
            await persistCountry(code);
            showModal.value = false;
        }
        catch {
            // toast already shown
        }
    }

    function cancel(): void {
        rejectPick?.(new Error('cancelled'));
        showModal.value = false;
        toast.message('Pays non confirmé', {
            description: 'Confirmez votre pays pour afficher et publier des remplacements.',
        });
    }

    return {
        showModal,
        pending,
        needsConfirmation,
        ensureProfileCountry,
        onSelect,
        cancel,
    };
}

export function clearReplacementListFilterCookies(): void {
    const postal = useCookie<string[]>('replacements_postal_codes', { default: () => [] });
    const cities = useCookie<string[]>('replacements_cities', { default: () => [] });
    const days = useCookie<string[]>('replacements_selected_days', { default: () => [] });
    postal.value = [];
    cities.value = [];
    days.value = [];
}
