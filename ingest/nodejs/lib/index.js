"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "../.env" });
const db_1 = require("./db");
const google_language_api_1 = require("./topics/google-language-api");
(async function main() {
    let i = 0;
    let j = 0;
    const db = (0, db_1.getSession)();
    try {
        let essays = await (0, db_1.getEssays)(db);
        while (essays?.length) {
            console.log(`extracting topics for ${essays.length} essays...`);
            for (const essay of essays) {
                if (essay.summary_en === "NA") {
                    essay.summary_en = undefined;
                }
                if (essay.summary === "NA") {
                    essay.summary = undefined;
                }
                if (essay.abstract === "NA") {
                    essay.abstract = undefined;
                }
                const abstract = essay.summary_en ?? essay.summary ?? essay.abstract ?? "";
                const topics = await (0, google_language_api_1.getTopics)(abstract);
                console.log(`[${j}/${i++}]\t${essay.title} \n - ${topics.join("\n - ")}\n\n`);
            }
            essays = await (0, db_1.getEssays)(db);
        }
    }
    catch (err) {
        console.error({ err });
        await db.close();
    }
})();
