import type { User } from '~/lib/types';
import type { ReplacementCountryCode } from '~/lib/replacementCountry';
import { needsProfileCountryConfirmation } from '~/utils/profileCountry';

export function useConfirmProfileCountry() {
    const user = useState<User>('user');
    const { $apifetch } = useNuxtApp();
    const toast = useToast();

    const showModal = ref(false);
    const pending = ref(false);
    let resolvePick: ((code: ReplacementCountryCode) => void) | null = null;
    let rejectPick: ((reason?: unknown) => void) | null = null;

    function needsConfirmation(): boolean {
        return needsProfileCountryConfirmation(user.value?.profile);
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

    async function persistCountry(code: ReplacementCountryCode): Promise<void> {
        pending.value = true;
        try {
            const response = await $apifetch<{ user?: User }>(`/api/users/${user.value.id}/profile-country`, {
                method: 'PUT',
                body: { country: code },
            });

            if (response?.user) {
                user.value = { ...user.value, ...response.user };
            }
            else if (user.value.profile) {
                user.value = {
                    ...user.value,
                    profile: {
                        ...user.value.profile,
                        country: code,
                        working_at: code === 'fr' ? 'France' : 'Belgique',
                    },
                };
            }

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
