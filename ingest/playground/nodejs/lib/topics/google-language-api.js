"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopics = void 0;
const language_1 = __importDefault(require("@google-cloud/language"));
const client = new language_1.default.LanguageServiceClient();
async function getTopics(text) {
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
        .map(entity => entity.name);
}
exports.getTopics = getTopics;
