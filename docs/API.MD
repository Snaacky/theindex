# API documentation
**Note that the API of piracy.moe is not intended for public use**

- All responses are in JSON format.
- Some columns have been renamed/removed since the flatfile transfer so keep that in mind.

## Data fetching

- `GET /api/fetch/tables` will return all of the tables.
- `GET /api/fetch/columns` will return all of the columns for all of the tables.
- `GET /api/fetch/columns/<table>` will return all of the columns for a specified table.
- `GET /api/fetch/tables/<tab>` will return all of the tables for a specified tab (use the tab name).
- `GET /api/fetch/data/<table>` will return all of the data in a table.

## Data manipulation

These endpoints can only be accessed by authenticated users.

`POST /api/insert/<table>` will create a new entry in the specified table.

- Payload is expected to be in JSON format and should look something like this (visualNovels example):
  ```
  {
    "editorNotes": "",
    "hasAds": "N",
    "hasAntiAdblock": "N",
    "isMobileFriendly": "",
    "siteAddresses": [
      "https://cpgrepacks.site/"
    ],
    "siteName": "CPG Repacks"
  }
  ```
- Returns `table does not exist` for invalid specified table.
- Returns `received no POST JSON data` if the data was malformed or missing.
- Returns `inserted` on success.

`POST /api/update/<table>` will update an entry in the specified table.

- Lookup is done via ID.
- Payload is expected to be in JSON format and should look something like this (visualNovels example):
  ```
  {
    "id": 1,
    "editorNotes": "",
    "hasAds": "N",
    "hasAntiAdblock": "N",
    "isMobileFriendly": "",
    "siteAddresses": [
      "https://cpgrepacks.site/"
    ],
    "siteName": "CPG Repacks"
  }
  ```
- Returns `table does not exist` for invalid specified table.
- Returns `received no POST JSON data` if the data was malformed or missing.
- Returns `id does not exist` if the ID lookup failed.
- Returns `updated` on success.

`GET /api/delete/<table>/<id>` will delete an entry in the specified table.

- Lookup is done by ID.
- Returns `table does not exist` for invalid specified table.
- Returns `id does not exist` if the ID lookup failed.
- Returns `deleted` on success.
