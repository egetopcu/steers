import { getTopics } from "./google-language-api"

const abstract = `Nowadays, teenagers are raised in an era of smartphones and do not remember a time before social media.
Most teenagers are active on social media starting at the age of 10 (BBC Newsround, 2016). According to a study by 
Variety Magazine (2014), six out of ten influencers for 13-18-year-olds are YouTubers. Teenagers find YouTube 
influencers more relatable than traditional celebrities (Defy media, 2015). They are seen as role models and are often
recognized in the streets by their fans. 
However, despite being famous online, outside the YouTube community they are just average people that could be the person
living next door. Parents often do not know about the online behavior of their children and the YouTubers they endorse. 
The aim of this research is to give an overview of the current YouTube community, including what influence Dutch 
YouTubers have on their teenage viewers and to what extent this influence on their life is good or bad. This study uses 
a qualitative study approach with a semi-structured interviewing technique. The research focuses on both teenagers and 
YouTubers and combines the results. The sample consists of 16 in-depth interviews with 20 teenagers in total and 4 in-depth
interviews with 4 YouTubers in total. 
This research shows that YouTube has become part of the daily life of many teenagers. YouTubers do have influence on the
behavior of teenagers, of which teenagers and their parents are unaware. This influence is not a bad thing, however, the 
unawareness of parents can be a problem as many teenagers want to become YouTubers themselves. The advice of this research
is that parents should know more about the behavior of their teenagers on YouTube and make rules about what is allowed 
and what is not. This descriptive research describes the world of YouTubers and teenagers. Further research could focus
on guidelines for parents whose teenagers are active on YouTube.`;

(async function main(text = abstract) {
    const topics = await getTopics(text);

    console.log({abstract, topics});
    
})()
