import { findNearbyCodes } from '~/server/utils/location';

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const code = query.code?.toString() || '1000';
    const radius = parseFloat(query.radius?.toString() || '5');
    const country = (query.country as 'be' | 'fr' | 'us') || 'be';

    return findNearbyCodes(code, radius, country);
});
