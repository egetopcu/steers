from database import Tutor
import requests
import json

BASE_URL = "https://people.utwente.nl/peoplepagesopenapi/contacts" # contacts?query=ict+serv

session = requests.session()
matched = 0
not_matched = 0

for index, tutor in enumerate(Tutor.select().iterator()):
    query = f"{tutor.surname}, {tutor.initials} {tutor.prefix}"
    contact_id = f"{tutor.initials}{tutor.prefix}{tutor.surname}".lower().replace(" ", "")

    result = session.get(BASE_URL, params={"query": query})

    if result.ok:
        data = result.json()["data"]
        found = False

        for datum in data:
            if datum.get("contactId") == contact_id or datum.get("displayName").lower().strip() == tutor.name.lower():
                tutor.contact_id = datum.get("contactId")
                tutor.name = datum.get("displayName")
                tutor.email = datum.get("mail")
                tutor.save()
                found = True
                matched += 1
                # print(f"{tutor.name} -> {tutor.email}")

                break
        
        if not found:
            not_matched += 1
            print(f"no exact match found for {tutor.name}, [{contact_id}]")
            print([datum.get("displayName") for datum in data])


print("Done!", "matched:", matched, "not matched:", not_matched)
