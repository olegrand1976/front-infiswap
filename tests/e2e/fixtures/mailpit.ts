const MAILPIT_URL = process.env.MAILPIT_URL ?? 'https://mailpit.ll-it-sc.be';

function mailpitAuthHeader(): string {
    const user = process.env.MAILPIT_USER ?? '';
    const pass = process.env.MAILPIT_PASS ?? '';

    if (!user || !pass) {
        throw new Error('MAILPIT_USER et MAILPIT_PASS requis pour les tests register E2E.');
    }

    return `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
}

type MailpitMessageSummary = {
    ID: string;
    Subject: string;
    To: Array<{ Address: string; Name: string }>;
};

type MailpitSearchResponse = {
    messages: MailpitMessageSummary[];
    total: number;
};

type MailpitMessageDetail = {
    ID: string;
    HTML: string;
    Text: string;
};

async function mailpitFetch<T>(path: string): Promise<T> {
    const response = await fetch(`${MAILPIT_URL}${path}`, {
        headers: {
            Authorization: mailpitAuthHeader(),
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Mailpit API ${path} → HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export async function waitForVerificationLink(
    recipientEmail: string,
    timeoutMs = 45_000,
): Promise<string> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const search = await mailpitFetch<MailpitSearchResponse>(
            `/api/v1/search?query=${encodeURIComponent(recipientEmail)}`,
        );

        for (const message of search.messages ?? []) {
            const detail = await mailpitFetch<MailpitMessageDetail>(`/api/v1/message/${message.ID}`);
            const content = `${detail.HTML}\n${detail.Text}`;
            const match = content.match(/https?:\/\/[^\s"'<>]+\/auth\/validation-account\/[^\s"'<>]+/);

            if (match) {
                return match[0].replace(/&amp;/g, '&');
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new Error(`Email de vérification introuvable pour ${recipientEmail} (${timeoutMs}ms).`);
}
