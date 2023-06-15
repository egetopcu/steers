import { config } from "dotenv";
config({ path: "../.env" });


import { EssayData } from "@bdsi-utwente/steers-common";
import { getEssays, getSession } from "./db";
import { getTopics } from "./topics/google-language-api";


(async function main() {
    let i = 0;
    let j = 0;

    const db = getSession();

    try {
    let essays: (EssayData & { summary?: string })[] = await getEssays(db);
    
    while (essays?.length){
        console.log (`extracting topics for ${essays.length} essays...`)
        for (const essay of essays){ 
            
            if (essay.summary_en === "NA") {
                essay.summary_en = undefined;
            }
            if (essay.summary === "NA"){
                essay.summary = undefined;
            }
            if (essay.abstract === "NA"){
                essay.abstract = undefined;
            }

            const abstract = essay.summary_en ?? essay.summary ?? essay.abstract ?? "";
            const topics = await getTopics(abstract);

            console.log( `[${j}/${i++}]\t${essay.title} \n - ${ topics.join("\n - ")}\n\n`)
        }

        essays = await getEssays(db);
    }
} catch (err) {
    console.error({err});
    await db.close();
}
})();

