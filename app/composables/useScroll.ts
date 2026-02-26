export function useScroll() {
    const scrollToSection = (section: string) => {
        const element = document.getElementById(section);
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    };

    return { scrollToSection };
}
