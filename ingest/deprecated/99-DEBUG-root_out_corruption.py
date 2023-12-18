from database import *

batch_size = 10000
offset = 0

while True:
    try:
        query = Tutor.select().order_by(Tutor.id).offset(offset).limit(batch_size)
        # print(query.sql())
        results = query.count()
        print(f"{offset}-{offset+min(batch_size, results)} OK!")
        if results < batch_size:
            break

        offset += batch_size
    except Exception as err:
        print(f"batch {offset}-{offset+batch_size} failed! [{str(err).strip()}]")
        if batch_size == 1:
            break

        batch_size = int(batch_size / 2)
