import type { CountryCode } from '../../../app/lib/types';
import { findNearbyCodes } from '../../utils/location';

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const code = query.code?.toString() || '1000';
    const radius = parseFloat(query.radius?.toString() || '5');
    const country = (query.country as CountryCode) || 'be';

    return findNearbyCodes(code, radius, country);
});
