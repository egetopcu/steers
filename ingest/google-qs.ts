import language from "@google-cloud/language";

async function quickstart() {
    // Imports the Google Cloud client library

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    // The text to analyze
    const text = "Hello, world!";

    const document = {
        content: text,
        type: "PLAIN_TEXT",
    } as const;

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({ document: document });
    const sentiment = result.documentSentiment;

    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

    client.close();
}

quickstart();
