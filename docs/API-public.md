# Public API documentation

Every API endpoint listed in this document has the http-header `Access-Control-Allow-Origin: *`. Please don't abuse the
service and take proper advantage of local caching and use your own infrastructure for delivering your application with
the data from the API.

## Columns

A column object is of the following format:
format:

```json
{
  "id": 25,
  "name": "Ads",
  "description": "Are Ads being used",
  "key": "hasAds",
  "column_type": "check"
}
```

- `id`: `int`
- `name`: `string`
- `description`: `string`, a short description of the column
- `key`: `string`, the key used for storing data
- `column_type`: `string`, enum of [`"text"`, `"check"`, `"list"`]
    - `"text"` the data of the column are strings
    - `"check"` the data of the column is of boolean value or unset/null
    - `"list"` the data of the column is a array of strings

### All columns

Fetch `GET` `/api/columns` to get a list of all columns available.

### Single column

To get the information of a single column, fetch `GET` `/api/columns/<id>`.

## Table-Columns

A column used in the table. A table-column object is of the following format:
format:

```json
{
  "id": 43,
  "table_id": 8,
  "column_id": 25,
  "order": 1,
  "hidden": false,
  "name": "Ads",
  "description": "Are Ads being used",
  "key": "hasAds",
  "column_type": "check"
}
```

- `id`: `int`
- `table_id`: `ìnt`, id of the table
- `column_id`: `ìnt`, id of the column object
- `order`: `ìnt`, order of the column in the table
- `hidden`: `bool`, is the column hidden in the table
- `name`: `string`
- `description`: `string`, a short description of the column
- `key`: `string`, the key used for storing data
- `column_type`: `string`, enum of [`"text"`, `"check"`, `"list"`]
    - `"text"` the data of the column are strings
    - `"check"` the data of the column is of boolean value or unset/null
    - `"list"` the data of the column is a array of strings

### All table-columns

Fetch `GET` `/api/tables/<table_id>/columns` to get a list of all columns of the table.

### Single table-column

To get the information of a single table-column, fetch `GET` `/api/tables/<table_id>/columns/<id>`.

## Table-data

A data object (a.k.a. row of the table) is of the following format:
format:

```json
{
  "id": 43,
  "table_id": 8,
  "data": "{\"name\":\"Piracy.moe\",\"hasAds\":false}"
}
```

- `id`: `int`
- `table_id`: `ìnt`, id of the table
- `data`: `string`, this is the output of the object dumped to string via `JSON.dumps({})`

### All table-data

Fetch `GET` `/api/tables/<table_id>/data` to get a list of all columns of the table.

### Single table-data

To get the information of a single table-column, fetch `GET` `/api/tables/<table_id>/data/<id>`.

## Table-Columns

A column used in the table. A table-column object is of the following format:
format:

```json
{
  "id": 43,
  "table_id": 8,
  "column_id": 25,
  "order": 1,
  "hidden": false,
  "name": "Ads",
  "description": "Are Ads being used",
  "key": "hasAds",
  "column_type": "check"
}
```

- `id`: `int`
- `order`: `ìnt`, order of the column in the table
- `hidden`: `bool`, is the column hidden in the table
- `name`: `string`
- `description`: `string`, a short description of the column
- `key`: `string`, the key used for storing data
- `column_type`: `string`, enum of [`"text"`, `"check"`, `"list"`]
    - `"text"` the data of the column are strings
    - `"check"` the data of the column is of boolean value or unset/null
    - `"list"` the data of the column is a array of strings

### All table-columns

Fetch `GET` `/api/tables/<table_id>/columns` to get a list of all columns of the table.

### Single table-column

To get the information of a single table-column, fetch `GET` `/api/tables/<table_id>/columns/<id>`.

## Tables

A table object is of the following format:

```json
{
  "id": 8,
  "name": "Anime download sites",
  "description": "Table of sites, that support anime downloads",
  "tab_id": 3,
  "order": 1,
  "hidden": false,
  "columns": [],
  "data": []
}
```

- `id`: `int`
- `name`: `string`
- `description`: `string`, a short description of the table
- `tab_id`: `int`, id of the tab which the table belongs to
- `order`: `ìnt`, order of the table in the tab
- `hidden`: `bool`, is the table hidden in the tab
- `columns`: `[]`, array of table-column objects
- `data`: `[]`, array of table-data objects

### All tables

Fetch `GET` `/api/tables` to get a list of all tables available.

### Single table

To get the information of a single table, fetch `GET` `/api/tables/<id>`.

## Tabs

A tab object is of the following format:

```json
{
  "id": 3,
  "name": "Anime",
  "description": "Overview of all Anime tables",
  "tables": []
}
```

- `id`: `int`
- `name`: `string`
- `description`: `string`, a short description of the table
- `tables`: `[]`, array of table objects

### All tabs

Fetch `GET` `/api/tabs` to get a list of all tabs available.

### Single tab

To get the information of a single table, fetch `GET` `/api/tabs/<id>`.