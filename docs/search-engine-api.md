# API (Draft) for site endpoints

To participate in our search engine project, we will require you to comply with our api standard, which is stated in
this document.

If an alphanumeric secret is provided, we will include http header in each request
`Authorization: piracy.moe {your-secret}`

## Endpoint: list-items

`https://api.your-anime-site.com/secret-or-not/api/endpoint/`
A huge JSON list of available objects on their site, regardless of type (novel, manga, anime, ...) of the format:

```json
[
  {
    "id": "unique string, e.g. your id used in your own db",
    "lastUpdate": "integer unix timestamp in seconds since last change"
  }
]
```

- `id` (required), a unique `string`, which identifies an item. You could for example just use your own database's id
  and if it's an integer just stringify it. Failing to pass a string results in the item being ignored.

- `lastUpdate` (required), unix timestamp in seconds as `integer`. This value describes when the data has been last
  changed. If the value is changed to a newer date, we will re-fetch the item-data endpoint for the item. You should
  also update this value if e.g. an episode has been added or renamed. Passing an invalid value results in the item
  being ignored.

If the value of lastUpdate changes to a newer date, we will re-fetch the listed item for new information

## Endpoint: item-data

`https://api.your-anime-site.com/secret-or-not/api/endpoint/{object-id}`
A single JSON object of the requested object with the format:

```json
{
  "id": "unique string, e.g. your id used in your own db",
  "lastUpdate": "integer unix timestamp in seconds since last change",
  "url": "absolute url to your page",
  "title": ["name of anime/manga/novel/...", "alternative name"],
  "description": "text containing description of the content",
  "type": "string of (anime|manga|hentai|novel)",
  "malId": "(optional) string of my anime list id",
  "aniId": "(optional) string of anilist id",
  "kitsuId": "(optional) string of kitsu id",
  "simklId": "(optional) string of simkl anime id",
  "subItems": [
    {
      "number": "positive integer starting from 1",
      "url": "absolute url to your page",
      "title": "(optional) Episode x of anime y"
    }
  ]
}
```

- `id` (required), a unique `string`, which identifies this item. You could for example just use your own database's id
  and if it's an integer just stringify it. Failing to pass a string results in the item being ignored.

- `lastUpdate` (required), unix timestamp in seconds as `integer`. This value describes when the data has been last
  changed. If the value is changed to a newer date, we will re-fetch the item-data endpoint for the item. You should
  also update this value if e.g. an episode has been added or renamed. Passing an invalid value results in the item
  being ignored.

- `url` (required), absolute http(s) `url` to the content. Users will be redirected to the page provided in the field.
  Passing an invalid value results in the item being ignored.

- `title` (required), a `string array` of titles. The names should be in ranked order. The first one is being used as
  display name. Passing an empty or invalid array results in the item being ignored.

- `description` (optional), a `string` containing the description/synopsis etc. of the content. Leaving it empty results
  in poorer search results ranking.

- `type` (required), a string describing what type of content this item actually is. Valid values are:

  - `anime`

  - `manga`

  - `hentai`

  - `novel`

  Failing to return one of those values results in the item being ignored.

If possible include a reference id to [My Anime List](https://myanimelist.net/), [Anilist](https://anilist.co/),
[Kitsu](https://kitsu.io/) or [SimKL](https://simkl.com/), so we can try to match search results from these databases
with your owns.

- `malId` (optional) `int` of the [My Anime List](https://myanimelist.net/) id

- `aniId` (optional) `int` of the [Anilist](https://anilist.co/) id

- `kitsuId` (optional) `string` of the [Kitsu](https://kitsu.io/) id

An entry usually has multiple sub-items, e.g. "Season 1 of anime x has episodes" or "Manga series y has books" and "
Novel z has a lot of chapters". Once you add a new sub item, remember to update the value of the property `lastUpdate`.

- `subItems` (optional) `array` of objects. Each object describes one sub item and has the following properties:

  - `number` (required), a positive `integer` greater or equal than 1, describes for e.g. an anime episode the episode
    number. Passing an invalid value results in the sub item being ignored.

  - `url` (required), absolute http(s) `url` to the content. Users will be redirected to the page provided in the
    field. Passing an invalid value results in the sub item being ignored.

  - `title` (optional), `string` containing the name of the sub item. If no or an invalid value has been passed, it
    will default to `Episode {X}` for animes and hentais, `Book {X}` for mangas and `Chapter {X}` for novels
