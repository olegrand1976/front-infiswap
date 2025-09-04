export type Gender = 'M' | 'F' | 'X';
export type AccountType = 'administrator' | 'developer' | 'tester' | 'manager' | 'collaborator' | 'community_manager' | 'sale_representative' | 'nurse' | 'caregiver' | 'midwife';
export type CountryCode = 'be' | 'fr' | 'us';
export type MediaType = 'video' | 'audio' | 'image' | 'link';

type GroupRole = {
    group_id: number;
    group_name: string;
    role_id: number;
    role_name: string;
    created_at: string;
};

type CrmUser = {
    id: number;
    user_id: number;
    client_type: string;
    nb_call?: number;
    nb_sale?: number;
    nb_recommandation?: number;
    nb_meeting?: number;
    nb_pending?: number;
    last_contact_date?: string;
    last_contact_method?: string;
    last_comment?: string;
    created_at: string;
};

export type User = {
    id: number;
    lastname: string;
    firstname: string;
    full_name: string;
    identifier_number: string;
    email: string;
    password?: string;
    gender: Gender;
    phone_number?: string | null;
    date_of_birth?: string | null;
    account_type: AccountType;
    group: number | null;
    rate?: number | null;
    validated_by?: number | null;
    validate_at?: string | null;
    email_verified_at?: string | null;
    settings?: string | null;
    remember_token?: string | null;
    last_login_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    stripe_id?: string | null;
    pm_type?: string | null;
    pm_last_four?: string | null;
    trial_ends_at?: string | null;
    profil_url?: string | null;
    street_address?: string | null;
    city?: string | null;
    zip_code?: string | null;
    country?: string | null;
    working_at?: string | null;
    additional_info?: string | null;
    social_media_links?: Record<string> | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    trial_ends_at?: string | null;
    nurse: Nurse;
    roles: AccountType[];
    profile?: Profile;
    permissions: string[];
    two_factor_enabled: boolean;
    two_factor_type: string;
    two_factor_code: string;
    two_factor_code_expires_at: string;
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    updated_at: string;
    affiliate_by?: number;
    referral_code?: string;
    biotrax?: boolean | number;
    insurance?: boolean | number;
    site?: boolean | number;
    ambassador?: boolean | number;
    professional_category?: string | null;
    comment_crm?: string | null;
    historic_activity?: UserActivity;
    contact_date?: string;
    contact_method?: string;
    group_roles?: GroupRole[];
    crm?: CrmUser;
    last_product_modifications?: LastProductModifications[];
    product_activity_summary?: ProductActivitySummary[];
    last_comment: Comment;
};

type LastProductModifications = {
    product_id: number;
    product_name: string;
    activate: boolean | number;
    created_at: string;
};

type ProductActivitySummary = {
    product_id: number;
    product_name: string;
    last_click_date: string | null;
    last_contact_date: string | null;
};

type UserActivity = {
    last_post_date: string | null;
    last_accept_posted_date: string | null;
    last_response_date: string | null;
    last_accept_response_date: string | null;
};

type RolePivot = {
    model_type: string;
    model_id: number;
    role_id: number;
};

type Role = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: RolePivot;
};
export interface Address {
    street: string | null;
    city: string | null;
    country: string | null;
    zipCode: string | null;
    additionalInformation: string | null;
};

interface ReplacementPreference {
    cities: string[];
    zip_codes: string[];
    days: string[];
}

export interface UserSettings {
    language: string;
    radius_km: string;
    replacement: ReplacementPreference;
    choice: string;
}

export interface Nurse {
    id: number;
    user_id: string;
    full_name: string;
    zip_code: string;
    user: User;
}

export type Profile = {
    id: number;
    profilable_type: string;
    profilable_id: number;
    profil_url?: string | null;
    street_address?: string | null;
    city?: string | null;
    zip_code?: string | null;
    country?: string | null;
    working_at?: string | null;
    additional_info?: string | null;
    social_media_links?: Record<string> | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    created_at: string;
    updated_at: string;
};

export type Patient = {
    id: number;
    lastname: string;
    firstname: string;
    gender: 'M' | 'F' | string;
    social_security_number: string;
    email: string | null;
    availability: 'available' | 'unavailable' | string;
    phone_number: string;
    care_start_date: string | null;
    care_end_date: string | null;
    profil_url?: string | null;
    street_address?: string | null;
    city?: string | null;
    zip_code?: string | null;
    country?: string | null;
    social_media_links?: Record<string, string> | null;
    additional_info?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    profile: Profile;
    nurse: User;
    visit_times: {
        id: number;
        patient_id: number;
        day_of_visit: string;
        visits: {
            time: string;
            visit_period: string;
            care_types: string[];
        }[];
    }[];
    care_informations: Record<string, string[]>;
    patient_documents: Record<string, string[]>;
    patient_care_type: PatientCareType[];
    created_at: string;
    updated_at: string;
};

export type PatientCareType = {
    care_type_id: number;
    care_type_name: string;
};
export type PatientDocument = {
    id: number;
    path: string;
    note?: string;
};

export type CareType = {
    id: number;
    name: string;
    duration?: number;
    price?: number;
};
export type Pagination<T> = {
    weekly?: T[];
    monthly?: T[];
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export type Replacement = {
    id: number;
    user_id: number;
    user: User;
    role_type: AccountType;
    replaced_by?: number;
    experience_years: number | null;
    start_date: string;
    end_date: string;
    visibility: 'public' | 'group' | 'friends';
    status: 'open' | 'closed';
    type: 'immediate' | 'classic';
    patient_count?: number;
    zip_codes?: string[] | string;
    cities?: string[] | string;
    care_types?: string[] | string;
    timeSlot?: {
        start_at: string;
        end_at: string;
    };
    comment?: string;
    details: ReplacementDetail[];
    user_owner: User;
    user_owner_full_name: string;
    user_owner_email: string;
    user_owner_phone_number: string;
    user_owner_profil_url: string;
    matching_users: User[];
    response_count: number;
    substitute_user?: User;
    candidate?: boolean;
    periods?: ReplacementPeriod[];
    province?: string;
    group_ids?: number[];
    created_at?: string | null;
};

export type ReplacementPeriod = {
    id: number;
    replacement_id: number;
    start_date: string;
    end_date: string;
};

export type UserPartner = {
    id: number;
    user: User;
    type: string;
    duration: string;
    has_responded: boolean;
    description: string | null;
};

export type ReplacementDetail = {
    id: number;
    parent_id: number;
    date: string;
    day: string;
    start_at?: string;
    end_at?: string;
    patient: Patient;
    care_types: CareType[];
};

export type ReplacementResponse = {
    id: number;
    replacement_id: number;
    reponded_by: number;
    status: 'pending' | 'confirmed' | 'canceled' | 'refused';
    reason?: string;
    comment?: string;
    created_at: string;
    updated_at: string;
    confirmed_at: string;
    respondedBy: User;
    responded_by: User;
    repondedBy: User;
};

export type HomeType = {
    id?: number;
    title?: string;
    description?: string;
    active?: boolean | number;
    image?: string | File;
};

export type Contact = {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    description?: string;
    created_at?: string;
};

export type Group = {
    id: number;
    name: string;
    created_at?: string;
};

export type Tutorial = {
    id: number;
    title: string;
    description: string;
    tag: string;
    media_path?: string;
    media_type: MediaType;
    mimes_type: string;
};

export type Product = {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
};

export type ReplacementRow = {
    replacement: Replacement;
    responses_count: number;
    responses: ReplacementResponse[];
};

export type Comment = {
    id: number;
    commentable_id: number;
    commentable_type: string;
    body: string;
    created_at: string;
    updated_at: string;
};
