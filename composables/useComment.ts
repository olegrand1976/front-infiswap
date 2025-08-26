import type { Comment } from '~/lib/types';

export const useComment = () => {
    const loading = useState('loading', () => false);
    const comments = useState<Comment[]>('comments', () => undefined);
    const { $apifetch } = useNuxtApp();

    async function store(id: number, type: string, body: string) {
        return await $apifetch('comments', {
            method: 'POST',
            body: {
                commentableId: id,
                commentableType: type,
                body: body,
            },
        });
    };

    return {
        loading,
        comments,
        store,
    };
};
