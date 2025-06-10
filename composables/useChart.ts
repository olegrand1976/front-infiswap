export const useChart = () => {
    function mapWeeklyStatistics(statistics, labelPrefix = 'Semaine', legendLabels = ['Nombre']) {
        return {
            data: statistics?.map(week => ({
                name: `${labelPrefix} ${week.week}`,
                count: Number(week.count) || 0,
            })) || [],
            legendLabels,
        };
    }

    const createXFormatter = (dataRef: Ref<{ name: string }[]>) => {
        const reactiveData = computed(() => dataRef.value);
        return (tick: number) => {
            const data = reactiveData.value;
            const label = data[tick]?.name || '';
            return label;
        };
    };

    const yFormatter = (tick: number) => {
        return Number.isFinite(tick) ? tick.toString() : '';
    };

    return {
        mapWeeklyStatistics,
        createXFormatter,
        yFormatter,
    };
};
