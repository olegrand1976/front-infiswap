export const useChart = () => {
    function mapWeeklyStatistics(statistics, labelPrefix = 'Semaine') {
        return statistics?.map(week => ({
            name: `${labelPrefix} ${week.week}`,
            count: Number(week.count) || 0,
        })) || [];
    }

    function createXFormatter(dataRef: Ref<{ name: string }[]>) {
        return (tick: number) => dataRef.value[tick]?.name || '';
    }

    const yFormatter = (tick: number) => {
        return tick.toString();
    };

    return {
        mapWeeklyStatistics,
        createXFormatter,
        yFormatter,
    };
};
