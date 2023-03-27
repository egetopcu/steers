
import language from "@google-cloud/language";
const client = new language.LanguageServiceClient();

export async function getTopics(text: string): Promise<string[]> {
    const [response] = await client.analyzeEntities({
        document: { content: text, type: "PLAIN_TEXT" },
    });

    if (!response.entities) {
        console.log({ response });
        return [];
    }

    return response.entities
        .filter((entity) => entity.name && entity.salience && entity.salience >= 0.05)
        .sort((a, b) => (b.salience ?? 0) - (a.salience ?? 0))
        .slice(0, 10)
        .map(entity => entity.name!)
}