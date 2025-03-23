export type Gender = 'M' | 'F';
export type AccountType = 'dev' | 'admin' | 'manager' | 'nurse' | 'patient';

export type User = {
    id: number;
    lastname: string;
    firstname: string;
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
    settings?: Record<string, any> | null;
    remember_token?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    stripe_id?: string | null;
    pm_type?: string | null;
    pm_last_four?: string | null;
    trial_ends_at?: string | null;
    nurse: Nurse;
    profile: Profile;
    created_at: string;
    updated_at: string;
};

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
    nurse_id?: number | null;
    lastname: string;
    firstname: string;
    email?: string | null;
    gender?: 'M' | 'F' | null;
    social_security_number: string;
    phone_number?: string | null;
    care_start_date?: string | null;
    care_end_date?: string | null;
    availability: 'available' | 'unavailable' | 'absent' | 'hospitalized';
    created_at: string;
    updated_at: string;
    profile?: Profile;
    care_start_date: string;
    care_end_date: string;
    availability: string[];
    care_informations: string[];
    visit_times: string[];
    patient_care_type: string[];
    patient_documents?: PatientDocument[];
};

export type PatientDocument = {
    id: number;
    path: string;
    note?: string;
};

export type CareType = {
    id: number;
    name: string;
    price: number;
};
