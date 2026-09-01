export interface ReplacementInstitution {
    initial: string;
    name: string;
    contract: string;
}

export interface ReplacementListing {
    id: number;
    type: 'replacement' | 'mission';
    date: string;
    // The periods as entered on the replacement (missions don't have any —
    // undefined then). Each one is already formatted as its own date range;
    // never collapsed into a single min→max span.
    periods?: string[];
    startDateIso?: string;
    city: string;
    zipCodes: string[];
    careTypes: string[];
    slots: string[];
    description?: string;
    isBoosted?: boolean;
    isUrgent?: boolean;
    isNew?: boolean;
    patientsPerDay?: number;
    institution?: ReplacementInstitution;
}
