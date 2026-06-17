API Contract v0.2

Overview:

Voice Input → Transcript → Intent Extraction → Product Service → Product Display

The intent extraction layer may use either:

* Rule-based parser
* LLM-based parser (OpenAI)

Regardless of implementation, the output schema must remain unchanged.

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

Supported Actions:

* filter
* addToCart
* removeFromCart
* checkout

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
* MongoDB integration will replace `products.js` in later versions.
* Frontend must not depend on the data source.
* Backend must not depend on the parser implementation.
* Parser output schema must remain stable across implementations.

Rules:

* All APIs use JSON.
* Field names must remain unchanged.
* Contract updates must be discussed during stand-up meetings.
* New filters require updates to both the parser and backend filtering logic.
