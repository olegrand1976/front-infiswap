export const useOpenai = () => {
    const config = useRuntimeConfig();
    const choices = useState('openaiChoices', () => null);
    const loading = useState('loading', () => false);

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
        const prompt = `Pour le code postal ${zip} en Belgique, donne-moi uniquement un tableau JSON listant toutes les villes et sections couvertes par ce code postal, pas seulement la ville principale. 
        - Si une seule localité correspond, réponds sous forme ["NomVille"].
        - Si plusieurs localités correspondent, réponds sous forme ["NomVille1", "NomVille2", ...].
        - N'inclus aucun texte en dehors du tableau JSON.`;

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

    async function getAdjacentZipCodesAndCities(
        input: string,
        excludeZipCodes: string[] = [],
        excludeCities: string[] = [],
    ): Promise<[string, string][]> {
        loading.value = true;
        const prompt = `Sur base du code postal ou de la ville "${input}" en Belgique, peux-tu me lister :
- les villes liées directement à ce code postal ou cette ville,
- ainsi que l'ensemble des villes et codes postaux limitrophes.

Ne reprends pas les villes et codes postaux déjà présents dans cette liste :
- Codes postaux à exclure : [${excludeZipCodes.join(', ') || 'aucun'}]
- Villes à exclure : [${excludeCities.join(', ') || 'aucune'}]

Tu me fourniras la réponse sous forme d'un JSON structuré ainsi : une liste d'éléments [CODE_POSTAL, VILLE], par exemple :
[
  ["1000", "Bruxelles"],
  ["1050", "Ixelles"]
]

Ne donne aucune explication, seulement le JSON.`;

        const response = await ask(prompt, 'developer');

        const content = response.choices?.[0]?.message?.content?.trim();

        try {
            const json = content ? JSON.parse(content) : null;
            if (json && Array.isArray(json) && json.every(item => Array.isArray(item) && item.length === 2)) {
                loading.value = false;
                return json as [string, string][];
            }
        }
        catch (e) {
            console.error('Erreur parsing JSON:', e, content);
            loading.value = false;
        }

        return [];
    }

    return {
        ask,
        choices,
        loading,
        getCityFromZipCode,
        getZipCodeFromCity,
        getAdjacentZipCodesAndCities,
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
