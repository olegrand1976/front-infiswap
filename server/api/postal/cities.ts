import { getCitiesFromPostalCode } from '~/server/utils/location';
import type { CountryCode } from '~/lib/types';

export default defineEventHandler((event) => {
    const query = getQuery(event);
    const code = String(query.code || '');
    const country = String(query.country || 'be') as CountryCode;

    if (!code) {
        throw createError({ statusCode: 400, statusMessage: 'Code postal requis' });
    }

    const cities = getCitiesFromPostalCode(code, country);

    return cities;
});
