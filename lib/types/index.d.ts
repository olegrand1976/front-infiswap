export type Gender = 'M' | 'F';
export type AccountType = 'dev' | 'admin' | 'manager' | 'nurse' | 'patient';

export type User = {
    id: number;
    lastname: string;
    firstname: string;
    full_name: string;
    identifier_number: string;
    email: string;
    password: string;
    gender: Gender;
    phone_number?: string | null;
    profile_url?: string | null;
    date_of_birth?: string | null;
    account_type: AccountType;
    rate?: number | null;
    validated_by?: number | null;
    validate_at?: string | null;
    email_verified_at?: string | null;
    settings?: string | null;
    remember_token?: string | null;
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
    additional_info?: string | null;
    social_media_links?: Record<string, any> | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    trial_ends_at?: string | null;
    nurse: Nurse;
    roles: Role[];
    permissions: string[];
    created_at: string;
    updated_at: string;
};

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

interface ReplacementPreference {
    cities: string[];
    zip_codes: string[];
    days: string[];
}
export interface UserSettings {
    language: string;
    replacement: ReplacementPreference;
    choice: string;
}

export interface Nurse {
    id: number;
    user_id: string;
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
    additional_info?: string | null;
    social_media_links?: Record<string, any> | null;
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
    additional_info?: string | null;
    social_media_links?: Record<string, any> | null;
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
    care_informations: any[];
    patient_documents: any[];
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
};
export type Pagination<T> = {
    data: T[];
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
};

export type Replacement = {
    id: number;
    nurse_id: number;
    replaced_by?: number;
    experience_years: number | null;
    start_date: string;
    end_date: string;
    status: 'open' | 'closed';
    details: ReplacementDetail[];
    nurse_owner_full_name: string;
    substitute_nurse?: string;
};

export type ReplacementDetail = {
    id: number;
    parent_id: number;
    date: string;
    day: string;
    start_at: string;
    patient: Patient;
    care_types: CareType[];
};
