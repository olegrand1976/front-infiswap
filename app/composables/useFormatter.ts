export function useFormmater() {
    const phoneNumber = (phoneNumber: string) => {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');

        return `${cleanedNumber.slice(0, 4)} ${cleanedNumber.slice(4, 6)} ${cleanedNumber.slice(6, 8)} ${cleanedNumber.slice(8)}`;
    };

    return { phoneNumber };
}
