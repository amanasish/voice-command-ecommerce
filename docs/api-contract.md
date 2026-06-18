API Contract v0.3

Overview:

Voice Input → Transcript → Intent Extraction → Backend Service → Product Display

The intent extraction layer is integrated within the frontend codebase and may use either:

* Rule-based parser
* LLM-based parser (OpenAI/Gemini)

Parser implementation may change, but the output schema must remain unchanged.

Architecture Flow:

1. Frontend captures voice input and generates a transcript.
2. The transcript is passed to the NLP parser module.
3. The parser returns a structured intent object.
4. Frontend sends the intent object to the appropriate backend endpoint.
5. Backend processes the request and returns a response.
6. Frontend updates the UI.

Flow:

Voice Input → Transcript → NLP Parser → Intent JSON → Backend API → Frontend UI

Supported Actions:

* filter
* addToCart
* removeFromCart
* checkout
* viewCart

Intent Extraction Input:

```json
{
  "transcript": "show me blue shirts under 1000"
}
```

Intent Extraction Output:

```json
{
  "action": "filter",
  "category": "shirts",
  "color": "blue",
  "priceMax": 1000
}
```

Common Fields:

| Field     | Type   | Required | Description          |
| --------- | ------ | -------- | -------------------- |
| action    | string | Yes      | User intent          |
| category  | string | No       | Product category     |
| color     | string | No       | Product color        |
| priceMax  | number | No       | Maximum price filter |
| productId | string | No       | Product identifier   |
| quantity  | number | No       | Number of items      |

Action Mapping:

| Action         | Endpoint         | Method |
| -------------- | ---------------- | ------ |
| filter         | /products/filter | POST   |
| addToCart      | /cart/add        | POST   |
| removeFromCart | /cart/remove     | POST   |
| checkout       | /checkout        | POST   |
| viewCart       | /cart            | GET    |

HTTP Method Rules:

* GET is used only for retrieving data.
* POST is used when sending a request body or modifying application state.

Product Filtering API:

Endpoint:

```txt
POST /products/filter
```

Request Body:

```json
{
  "action": "filter",
  "category": "shirts",
  "color": "blue",
  "priceMax": 1000
}
```

Response:

```json
{
  "success": true,
  "products": [
    {
      "id": "p101",
      "title": "Blue Cotton Shirt",
      "category": "shirts",
      "color": "blue",
      "price": 899,
      "imageUrl": "/images/p101.jpg"
    }
  ]
}
```

Cart API:

```txt
POST /cart/add
POST /cart/remove
GET /cart
POST /checkout
```

Standard Success Response:

```json
{
  "success": true,
  "data": {}
}
```

Standard Error Response:

```json
{
  "success": false,
  "error": "Invalid action"
}
```

Empty Result Response:

```json
{
  "success": true,
  "products": []
}
```

Product Object:

| Field    | Type   | Description        |
| -------- | ------ | ------------------ |
| id       | string | Product identifier |
| title    | string | Product name       |
| category | string | Product category   |
| color    | string | Product color      |
| price    | number | Product price      |
| imageUrl | string | Product image URL  |

Implementation Notes:

* Product data is currently served from `products.js`.
* MongoDB integration will replace `products.js` in future versions.
* Frontend must not depend on the data source.
* Backend must not depend on the parser implementation.
* Parser output schema must remain stable across implementations.

Versioning Rules:

* Non-breaking changes increment the minor version.
* Breaking changes increment the major version.
* Any field rename, endpoint rename, or response schema change is considered a breaking change.

Decision Log:

v0.3

* NLP parser integrated within the frontend codebase.
* Product filtering endpoint changed from GET to POST.
* Added viewCart action.
* Added action-to-endpoint mapping.
* Added standard success and error response formats.

Rules:

* All APIs use JSON.
* Field names must remain unchanged.
* Contract updates must be discussed during stand-up meetings.
* New filters require updates to both the parser and backend filtering logic.
