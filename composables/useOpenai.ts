// composables/useOpenai.ts

import OpenAI from 'openai';

export const useOpenai = () => {
    const config = useRuntimeConfig();
    const client = new OpenAI({
        apiKey: config.public.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    async function ask(prompt: string, role: 'developer' | 'user' | 'assistant') {
        const response = await client.responses.create({
            model: 'gpt-4o',
            input: [
                {
                    role: role,
                    content: prompt,
                },
            ],
        });

        return response;
    }

    return {
        ask,
    };
};
