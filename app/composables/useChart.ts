export const useChart = () => {
    function mapWeeklyStatistics(statistics, labelPrefix = 'Semaine', legendLabels = ['Nombre'], params = []) {
        return {
            data: statistics?.map(week => ({
                name: `${labelPrefix} ${week.week}`,
                count: Number(week.count) || 0,
                ...getParamsValue(week, params),
            })) || [],
            legendLabels,
        };
    }

    function mapDailyStatistics(statistics, labelPrefix = '', legendLabels = ['Nombre'], params = []) {
        const dayNames = {
            monday: 'Lundi',
            tuesday: 'Mardi',
            wednesday: 'Mercredi',
            thursday: 'Jeudi',
            friday: 'Vendredi',
            saturday: 'Samedi',
            sunday: 'Dimanche',
        };

        return {
            data: statistics?.map(day => ({
                name: `${labelPrefix}${dayNames[day.day] ?? day.day}`,
                count: Number(day.count) || 0,
                ...getParamsValue(day, params),
            })) || [],
            legendLabels,
        };
    }

    function getParamsValue(stats: Record<string, string | number>, params: string[] = []) {
        const data = {};
        if (params.length > 0) {
            params.map((value) => {
                data[value] = stats[value];
            });
        }

        return data;
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
        mapDailyStatistics,
        createXFormatter,
        yFormatter,
    };
};
