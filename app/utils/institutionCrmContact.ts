/**
 * True when the institution still needs POST ensure-contact before CRM actions
 * that require both a representative user and a crm_users row.
 */
export function needsInstitutionCrmEnsure(institution: {
    representative_user_id?: number | null;
    crm?: { id?: number | null } | null;
}): boolean {
    return !(Boolean(institution.representative_user_id) && Boolean(institution.crm?.id));
}
