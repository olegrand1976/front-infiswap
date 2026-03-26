import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { CountryCode } from '../../app/lib/types';

type Entry = {
    postalCode: string;
    city: string;
    latitude: number;
    longitude: number;
};

function getFilePath(country: CountryCode): string {
    const fileName = `${country.toUpperCase()}.txt`;
    
    let currentDir = process.cwd();
    try {
        currentDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
    } catch (e) {
        // ignore
    }
    
    // Essayer différents chemins selon d'où le processus Node est lancé (.output vs racine)
    const possiblePaths = [
        path.resolve(process.cwd(), 'server/data', fileName),
        path.resolve(process.cwd(), '../server/data', fileName), // Si PM2 est lancé depuis .output/
        path.resolve(process.cwd(), '../../server/data', fileName), // Si PM2 est lancé depuis .output/server/
        path.resolve(process.cwd(), '../../../server/data', fileName), // Extra fallback
        path.resolve(currentDir, '../../data', fileName), // dev local
        path.resolve(currentDir, '../../../../../server/data', fileName), // prod (.output/server/chunks/build)
        path.resolve(currentDir, '../../../../server/data', fileName) // alternative prod
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) return p;
    }

    throw new Error(`Fichier postal introuvable pour le pays ${country}. Les chemins tentés n'ont pas abouti. Veuillez vous assurer que le dossier 'server/data' existe à la racine ou près de l'endroit où le serveur est exécuté.`);
}

function loadPostalData(country: CountryCode = 'be'): string {
    const filePath = getFilePath(country);
    return fs.readFileSync(filePath, 'utf-8');
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const toRad = (deg: number) => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a
    = Math.sin(dLat / 2) ** 2
        + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const postalCache: Partial<Record<CountryCode, Entry[]>> = {};

function loadPostalEntries(country: CountryCode = 'be'): Entry[] {
    if (postalCache[country]) {
        return postalCache[country]!;
    }

    const filePath = getFilePath(country);
    const content = fs.readFileSync(filePath, 'utf-8');

    const lines = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.includes(';'));

    const entries: Entry[] = [];

    for (const line of lines) {
        const cols = line.split(';');

        if (cols.length < 11 || !cols[1] || !cols[2] || !cols[9] || !cols[10]) continue;

        const lat = parseFloat(cols[9]);
        const lon = parseFloat(cols[10]);

        if (isNaN(lat) || isNaN(lon)) continue;

        entries.push({
            postalCode: cols[1],
            city: cols[2],
            latitude: lat,
            longitude: lon,
        });
    }

    postalCache[country] = entries;
    return entries;
}

export function findNearbyCodes(
    basePostalCode: string,
    radiusKm = 5,
    country: CountryCode = 'be',
): [string, string][] {
    const entries = loadPostalEntries(country);
    const source = entries.find(e => e.postalCode === basePostalCode);

    if (!source) {
        console.error(`Code postal de référence non trouvé : ${basePostalCode}`);
        return [];
    }

    return entries
        .filter(
            e =>
                e.postalCode !== basePostalCode
                && haversineDistance(source.latitude, source.longitude, e.latitude, e.longitude) <= radiusKm,
        )
        .map(e => [e.postalCode, e.city]);
}

export function getCitiesFromPostalCode(
    postalCode: string,
    country: CountryCode = 'be',
): string[] {
    const entries = loadPostalEntries(country);

    const cities = entries
        .filter(e => e.postalCode === postalCode)
        .map(e => e.city);

    return Array.from(new Set(cities));
}
