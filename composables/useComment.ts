import type { Comment, User } from '~/lib/types';

export const useComment = () => {
    const loading = useState('loading', () => false);
    const userComments = useState<Comment[]>('comments', () => undefined);
    const { $apifetch } = useNuxtApp();

    async function store(id: number, type: string, body: string) {
        return await $apifetch('api/comments', {
            method: 'POST',
            body: {
                commentableId: id,
                commentableType: type,
                body: body,
            },
        });
    };

    async function getUserComments(user: User) {
        loading.value = true;
        const response = await $apifetch(`api/users/${user.id}/comments`);
        userComments.value = response.comments;

        loading.value = false;
    }

    async function destroy(comment: Comment) {
        await $apifetch(`api/comments/${comment.id}`, {
            method: 'DELETE',
        });
    }

    async function update(comment: Comment, newValue: Comment) {
        await $apifetch(`api/comments/${comment.id}`, {
            method: 'PUT',
            params: newValue,
        });
    }

    return {
        loading,
        getUserComments,
        userComments,
        store,
        destroy,
        update,
    };
};
