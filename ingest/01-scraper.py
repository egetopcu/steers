from asyncio.tasks import create_task, gather, sleep
import os
import re
from typing import Union
import bs4
import feedparser
import httpx
import progressbar
from pprint import pprint as print

from database import *
import asyncio


EXTRACT_PROPS = [
    "abstract",
    "client",
    "faculty",
    "type",
    "programme",
    "subjects",
    "restricted",
]
SUBJECT_REGEX = re.compile(r"^(?:([0-9]+) )?(.*)$")
PROGRAMME_REGEX = re.compile(r"^(.*?)(?: \((.*)\))?$")


def parse_table(table):
    keys = [
        td.text.strip(": ").lower().replace(" ", "-")
        for td in table.select("tr td:first-child")
    ]
    values = [td.text.strip() for td in table.select("tr td:nth-child(2)")]
    props = dict(zip(keys, values))

    if "subject" in props:
        props["subjects"] = []
        for subject in props["subject"].split(", "):
            code, name = SUBJECT_REGEX.match(subject.strip()).groups()
            props["subjects"].append({"name": name})

    if "clients" in props:
        props["client"] = props["clients"]

    if "item-type" in props:
        props["type"] = props["item-type"]

    if "programme" in props:
        name, code = re.match(PROGRAMME_REGEX, props["programme"].strip()).groups()
        props["programme"] = {"name": name, "code": code}

    return {prop: props[prop] for prop in EXTRACT_PROPS if prop in props}


async def essay_details_worker(queue: asyncio.Queue):
    async with httpx.AsyncClient() as client:
        while True:
            # get task from queue
            essay = await queue.get()
            essay.id = essay.id.strip("/ ").split("/").pop()

            try:
                # skip if already in database
                exists: Union[Essay, None] = Essay.get_or_none(id=essay.id)
                # print(f"essay {essay.id}: {exists}")

                pdf_missing = not exists or (
                    not exists.restricted
                    and not os.path.isfile("data/" + essay.id + ".pdf")
                )

                if not exists:
                    # get details, then fetch pdf and store essay in database concurrently
                    details, pdf_url = await get_details(essay.link, client)
                    await asyncio.gather(
                        create_task(fetch_pdf(pdf_url, client, essay.id)),
                        create_task(store_essay(essay, details)),
                    )
                elif pdf_missing:
                    # fetch pdf
                    _, pdf_url = await get_details(essay.link, client)
                    await create_task(fetch_pdf(pdf_url, client, essay.id))

            except Exception as e:
                print(f"{type(e)} getting essay details [{essay.id}]: {e}")
                raise e

            # signal task is done
            finally:
                queue.task_done()


async def get_details(
    url: str, client: httpx.AsyncClient
) -> tuple[dict[str, any], str]:
    response = await client.get(url, follow_redirects=True)
    response.raise_for_status()

    soup = bs4.BeautifulSoup(response.text, "lxml")
    props = parse_table(soup.select(".ep_summary_content_main table").pop())
    pdf_anchor_element = soup.find("a", "ep_document_link")
    pdf = pdf_anchor_element.attrs["href"].strip() if pdf_anchor_element else None
    if not pdf:
        props["restricted"] = True

    return props, pdf


async def fetch_pdf(url, client, id):
    if not url:
        return
    try:
        # We don't need the PDF for most cases - supervisors we will grab from mobility data
        return
        response = await client.get(url, follow_redirects=True)
        response.raise_for_status()
        pdf_path = "data/files/" + str(id) + ".pdf"
        with open(pdf_path, "wb") as f:
            f.write(response.content)
    except Exception as e:
        print(f"{type(e)} storing pdf [{id}]: {e}")


async def store_essay(essay, props):
    try:
        with db.atomic():
            essay = Essay.create(
                id=essay.id.strip(),
                title=essay.title.strip() if "title" in essay else None,
                summary=essay.summary.strip() if "summary" in essay else None,
                abstract=props["abstract"].strip() if "abstract" in props else None,
                type=props["type"].strip() if "type" in props else None,
                author=essay.author.strip() if "author" in essay else None,
                date=essay.published.strip() if "published" in essay else None,
                restricted=props["restricted"] if "restricted" in props else False,
            )

            if "client" in props:
                client, _ = Client.get_or_create(name=props["client"])
                essay.client = client

            if "faculty" in props:
                faculty, _ = Faculty.get_or_create(name=props["faculty"])
                essay.faculty = faculty

            if "programme" in props:
                programme, _ = Programme.get_or_create(**props["programme"])
                essay.programme = programme

            if "subjects" in props:
                for subject in props["subjects"]:
                    category, _ = Category.get_or_create(**subject)
                    EssayCategory.create(essay=essay, category=category, method="library subjects")

            essay.save()
    # except IntegrityError:
    #     pass
    except Exception as e:
        print(f"{type(e)} storing essay [{essay.id}]: {e}")


async def main():
    print("parsing rss feed...")
    feed = feedparser.parse(
        "https://essay.utwente.nl/cgi/exportview/faculty/BMS/Atom/BMS.xml"
        # "feed/BMS.xml"
        # "feed/BMS-light.xml"
    )

    print(f"    {len(feed.entries)} entries loaded.")

    # with open("data/feed.data", "w") as file:
    #     json.dump({"feed": feed.feed, "entries": feed.entries}, file)

    clear_db()
    create_tables()
    max = len(feed.entries)
    details_queue = asyncio.Queue()

    for entry in feed.entries:
        await details_queue.put(entry)

    workers = []
    for _ in range(4):
        worker = asyncio.create_task(essay_details_worker(details_queue))
        workers.append(worker)

    widgets = [
        progressbar.Percentage(),
        " ",
        progressbar.Bar(),
        " [",
        progressbar.Counter(),
        f"/{max}] ",
        progressbar.ETA(),
    ]
    bar = progressbar.ProgressBar(maxval=max, widgets=widgets).start()
    while not details_queue.empty():
        done = max - details_queue.qsize()
        # bar.term_width = utils.get_terminal_size()[0]
        bar.update(done)
        await sleep(0.2)

    await details_queue.join()
    for worker in workers:
        worker.cancel()

    await gather(*workers, return_exceptions=True)


asyncio.run(main())

# feed = feedparser.parse(
#         # "https://essay.utwente.nl/cgi/exportview/faculty/BMS/Atom/BMS.xml"
#         # "feed/BMS.xml"
#         "feed/BMS-light.xml"
#     )

# print(f"    {len(feed.entries)} entries loaded.")

# for entry in feed.entries:
#     print(entry.date)
#     # print(entry.keys())
#     print(entry.published)
