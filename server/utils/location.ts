import fs from 'fs';
import path from 'path';

type Entry = {
    postalCode: string;
    city: string;
    latitude: number;
    longitude: number;
};

function loadPostalData(country: 'be' | 'fr' | 'us' = 'be'): string {
    const filePath = path.resolve(process.cwd(), `server/data/${country.toUpperCase()}.txt`);
    return fs.readFileSync(filePath, 'utf-8');
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const toRad = (deg: number) => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
        * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function loadPostalEntries(country: 'be' | 'fr' | 'us' = 'be'): Entry[] {
    const content = loadPostalData(country);
    const lines = content.split('\n').filter(Boolean);

    return lines.map((line) => {
        const cols = line.split(';');
        return {
            postalCode: cols[1],
            city: cols[2],
            latitude: parseFloat(cols[9]),
            longitude: parseFloat(cols[10]),
        };
    });
}

export function findNearbyCodes(basePostalCode: string, radiusKm = 5, country: 'be' | 'fr' | 'us' = 'be'): [string, string][] {
    const entries = loadPostalEntries(country);
    const source = entries.find(e => e.postalCode === basePostalCode);
    if (!source) return [];

    return entries
        .filter(e =>
            e.postalCode !== basePostalCode
            && haversineDistance(source.latitude, source.longitude, e.latitude, e.longitude) <= radiusKm,
        )
        .map(e => [e.postalCode, e.city]);
}
