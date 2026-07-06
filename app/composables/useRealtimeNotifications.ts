type EchoInstance = {
    private: (channel: string) => {
        listen: (event: string, callback: (payload: Record<string, unknown>) => void) => void;
        stopListening: (event: string) => void;
    };
    disconnect: () => void;
};

declare global {
    interface Window {
        Pusher: unknown;
    }
}

let echoInstance: EchoInstance | null = null;

export function useRealtimeNotifications() {
    const user = useState<{ id?: number } | null>('user');
    const config = useRuntimeConfig();
    const isConnected = ref(false);

    async function connect() {
        if (!import.meta.client || !user.value?.id) {
            return;
        }

        const reverbKey = config.public.REVERB_APP_KEY as string | undefined;

        if (!reverbKey) {
            return;
        }

        try {
            const [{ default: Echo }, { default: Pusher }] = await Promise.all([
                import('laravel-echo'),
                import('pusher-js'),
            ]);

            window.Pusher = Pusher;

            echoInstance = new Echo({
                broadcaster: 'reverb',
                key: reverbKey,
                wsHost: config.public.REVERB_HOST,
                wsPort: Number(config.public.REVERB_PORT ?? 8080),
                wssPort: Number(config.public.REVERB_PORT ?? 8080),
                forceTLS: config.public.REVERB_SCHEME === 'https',
                enabledTransports: ['ws', 'wss'],
                authEndpoint: `${config.public.API_URL}/broadcasting/auth`,
                auth: {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            }) as EchoInstance;

            echoInstance.private(`App.Models.User.${user.value.id}`)
                .listen('.replacement.urgent', () => {
                    const { getUnreadCount } = useNotifications();
                    getUnreadCount();
                });

            isConnected.value = true;
        }
        catch (error) {
            console.warn('Reverb connection unavailable', error);
        }
    }

    function disconnect() {
        echoInstance?.disconnect();
        echoInstance = null;
        isConnected.value = false;
    }

    onMounted(() => connect());
    onUnmounted(() => disconnect());

    return { isConnected, connect, disconnect };
}
