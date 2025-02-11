// lib/utils/index.ts

/**
 * Combine plusieurs chaînes de caractères en une seule chaîne de classes
 * en filtrant les valeurs falsy.
 *
 * @param classes - Une liste de classes (string, undefined, null ou boolean)
 * @returns La chaîne de classes combinées.
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
  // Exportez également d'autres fonctions ou modules si nécessaire
  