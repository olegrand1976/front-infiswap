import type { CrmInstitution, User } from '~/lib/types';

export type CrmProfileType = 'user' | 'institution';

export type CrmProfileAction =
    | { type: 'contact'; user: User }
    | { type: 'contact'; institution: CrmInstitution }
    | { type: 'comment'; user: User }
    | { type: 'comment'; institution: CrmInstitution }
    | { type: 'referrer'; user: User }
    | { type: 'referrer'; institution: CrmInstitution };

type ActionHandler = (action: CrmProfileAction) => void;

export function useCrmProfile() {
    const open = useState<boolean>('crmProfileOpen', () => false);
    const profileType = useState<CrmProfileType>('crmProfileType', () => 'user');
    const profileUser = useState<User | null>('crmProfileUser', () => null);
    const profileInstitution = useState<CrmInstitution | null>('crmProfileInstitution', () => null);
    const actionHandler = useState<ActionHandler | null>('crmProfileActionHandler', () => null);

    function setActionHandler(handler: ActionHandler | null) {
        actionHandler.value = handler;
    }

    function dispatchAction(action: CrmProfileAction) {
        actionHandler.value?.(action);
    }

    function openUserProfile(user: User) {
        profileType.value = 'user';
        profileUser.value = user;
        profileInstitution.value = null;
        open.value = true;
    }

    function openInstitutionProfile(institution: CrmInstitution) {
        profileType.value = 'institution';
        profileInstitution.value = institution;
        profileUser.value = null;
        open.value = true;
    }

    function closeProfile() {
        open.value = false;
    }

    return {
        open,
        profileType,
        profileUser,
        profileInstitution,
        setActionHandler,
        dispatchAction,
        openUserProfile,
        openInstitutionProfile,
        closeProfile,
    };
}
