import dotenv
dotenv.load_dotenv()

from database import *
import langdetect
import flag
from ibm_watson import LanguageTranslatorV3, ApiException
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

authenticator = IAMAuthenticator(os.environ["LANGUAGE_TRANSLATOR_IAM_APIKEY"])
language_translator = LanguageTranslatorV3(
    version='2023-01-05',
    authenticator=authenticator
)
language_translator.set_service_url(os.environ["LANGUAGE_TRANSLATOR_URL"])

essays = Essay.select().where(Essay.language == None)
n = len(essays)
print(n)

for i, essay in enumerate(Essay.select().where(Essay.language == None).iterator()):
    # print(i + 1, "/", n, essay.title)

    if essay.summary_en is not None or essay.language == "xx":
        continue

    if essay.summary is None or len(essay.summary) < 5:
        essay.summary = essay.title
    if essay.abstract is None or len(essay.abstract) < 5:
        essay.abstract = essay.summary

    try: 
        essay.language = langdetect.detect(essay.abstract)
    except langdetect.LangDetectException as e:
        print("\nError detecting language:", e)
        essay.language = "xx"
        essay.save()
        continue

    print(flag.flag(essay.language), end=" ", flush=True)

    if essay.language == "en":
        essay.summary_en = essay.abstract
    else:
        try:
            result = language_translator.translate(text = essay.abstract, target="en").get_result()
            essay.language = result["detected_language"]
            essay.summary_en = result["translations"][0]["translation"]
        except ApiException as e:
            if "source language is the same as target" in e.message:
                essay.language = "en"
                essay.summary_en = essay.abstract

            else:   
                print("\nError getting translation:", e)
                essay.language = "xx"
                essay.summary_en = None

    essay.save()
