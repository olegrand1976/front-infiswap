export function institutionStatusLabelFromCode(status?: string | null): string {
    if (status === 'not_applicable') {
        return 'Non applicable';
    }
    if (status === 'active') {
        return 'Validée';
    }
    if (status === 'changes_pending') {
        return 'Modif. en attente';
    }
    if (status === 'rejected') {
        return 'Rejetée';
    }

    return 'En attente';
}

export function institutionStatusBadgeClassFromCode(status?: string | null): string {
    if (status === 'not_applicable') {
        return 'bg-gray-100 text-gray-600';
    }
    if (status === 'active') {
        return 'bg-green-100 text-green-800';
    }
    if (status === 'changes_pending') {
        return 'bg-amber-100 text-amber-800';
    }
    if (status === 'rejected') {
        return 'bg-red-100 text-red-800';
    }

    return 'bg-yellow-100 text-yellow-800';
}
