export const useOpenai = () => {
    const config = useRuntimeConfig();
    const choices = useState('openaiChoices', () => null);

    async function ask(
        prompt: string,
        role: 'developer' | 'user' | 'assistant' = 'developer',
    ): Promise<ChatCompletionResponse> {
        const apiKey = config.public.OPENAI_API_KEY;

        const response = await $fetch<ChatCompletionResponse>('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: {
                model: 'o4-mini',
                messages: [
                    {
                        role,
                        content: prompt,
                    },
                ],
            },
        });

        choices.value = response.choices;
        return response;
    }

    async function getCityFromZipCode(zip: string): Promise<string | null> {
        const prompt = `Donne-moi uniquement le nom de la ville correspondant au code postal ${zip} en Belgique, sans phrase ni ponctuation. Juste le nom de la ville.`;

        const response = await ask(prompt, 'developer');

        const content = response.choices?.[0]?.message?.content?.trim();

        if (!content || content.length > 100) return;

        return content;
    }

    async function getZipCodeFromCity(city: string): Promise<string | null> {
        const prompt = `Donne-moi uniquement le code postal de la ville ${city} en Belgique, sans phrase ni ponctuation. Juste le code postal.`;

        const response = await ask(prompt, 'developer');

        const content = response.choices?.[0]?.message?.content?.trim();

        if (!content || !/^\d{4}$/.test(content)) return;

        return content;
    }

    return {
        ask,
        choices,
        getCityFromZipCode,
        getZipCodeFromCity,
    };
};

type ChatCompletionResponse = {
    id: string;
    object: 'chat.completion';
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: 'assistant';
            content: string | null;
        };
        finish_reason: string;
    }[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
};
