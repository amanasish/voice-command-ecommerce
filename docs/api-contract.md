# API Contract v0.7 Update

## Changes from v0.6

### 1. AI Parser Intent Schema Update

The Groq-based AI parser now returns an updated intent object.  
Backend must be able to consume the following fields:

```json
{
  "action": "filter",
  "category": "shirts",
  "occasion": "diwali",
  "color": "blue",
  "priceMin": 500,
  "priceMax": 1000,
  "quantity": null,
  "productId": null
}
```

### Supported Actions

- `filter`
- `addToCart`
- `removeFromCart`
- `checkout`
- `viewCart`

---

### 2. Common Intent Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| action | string | Yes | User intent |
| category | string | No | Product category |
| occasion | string | No | Occasion/event filter such as party, wedding, festive, diwali |
| color | string | No | Product color |
| priceMin | number | No | Minimum price filter |
| priceMax | number | No | Maximum price filter |
| productId | string | No | Product identifier |
| quantity | number | No | Number of items |

---

### 3. Product Filtering Request Body

Backend should accept the updated filter payload:

```json
{
  "action": "filter",
  "category": "shirts",
  "occasion": "diwali",
  "color": "blue",
  "priceMin": 500,
  "priceMax": 1000
}
```

---

### 4. Product Schema Clarification

To support occasion-based filtering later, product records may include an `occasion` field:

```json
{
  "_id": "ObjectId(...)",
  "id": "p101",
  "title": "Blue Cotton Shirt",
  "category": "shirts",
  "occasion": ["diwali", "party"],
  "color": "blue",
  "price": 899,
  "imageUrl": "/images/p101.jpg",
  "stock": 20
}
```

Rules:
- Frontend uses `id`
- API responses expose `id`
- `_id` remains internal

---

### 5. Response Format Rules

#### Success Response
All successful responses must include:

```json
{
  "success": true
}
```

Additional fields are endpoint specific.

Examples:

**Product Filter**
```json
{
  "success": true,
  "products": []
}
```

**View Cart**
```json
{
  "success": true,
  "cart": [],
  "total": 0
}
```

**Add To Cart**
```json
{
  "success": true,
  "cart": []
}
```

**Remove From Cart**
```json
{
  "success": true,
  "cart": []
}
```

**Checkout**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {}
}
```

#### Error Response
All error responses must follow:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

### 6. Relationship Clarification

```text
cart.userId → users._id
cart.items.productId → products.id

orders.userId → users._id
orders.items.productId → products.id
```

---

### 7. Backend Integration Note

- Groq AI parser is now the source of structured intent JSON.
- Backend should consume the parsed output directly.
- Backend filtering should use `category`, `occasion`, `color`, `priceMin`, and `priceMax`.
- Current API request/response format remains stable.
- Frontend integration should not depend on storage implementation.

---

## Version

**Contract Version: v0.7**

## Reason

- AI parser schema updated
- `occasion` added for future filtering
- `priceMin` added for better range filtering
- No breaking API changes








# API Contract v0.6 Update

## Changes from v0.5

### 1. Success Response Clarification

All successful responses must contain:

```json
{
  "success": true
}
```

Additional fields are endpoint specific.

Examples:

#### Product Filter

```json
{
  "success": true,
  "products": []
}
```

#### View Cart

```json
{
  "success": true,
  "cart": [],
  "total": 0
}
```

#### Add To Cart

```json
{
  "success": true,
  "cart": []
}
```

#### Remove From Cart

```json
{
  "success": true,
  "cart": []
}
```

#### Checkout

```json
{
  "success": true,
  "message": "Order placed successfully",
  "order": {}
}
```

The previously shown generic `data` field is illustrative only and is not required.

---

### 2. Error Response Standardization

All error responses must follow:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

### 3. Products Collection Clarification

MongoDB generates an internal `_id`.

For API compatibility products must also maintain a public `id` field.

Example:

```json
{
  "_id": "ObjectId(...)",
  "id": "p101",
  "title": "Blue Cotton Shirt",
  "category": "shirts",
  "color": "blue",
  "price": 899,
  "imageUrl": "/images/p101.jpg",
  "stock": 20
}
```

Rules:

* Frontend uses `id`
* API responses expose `id`
* `_id` remains internal

---

### 4. Relationship Clarification

```text
cart.userId → users._id
cart.items.productId → products.id

orders.userId → users._id
orders.items.productId → products.id
```

---

### 5. MongoDB Migration Note

* MongoDB Atlas connection completed.
* Product filtering is being migrated from products.js to MongoDB.
* Current API request/response formats remain unchanged.
* Frontend integration should not depend on storage implementation.

---

### Version

Contract Version: v0.6

Reason:

* MongoDB schema clarification
* Response format clarification
* No breaking API changes





API Contract v0.5

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

-----------------------------------------------------------------------
-----------------------------------------------------------------------

Database Collections (MVP)

The backend will maintain the following collections:

* users
* products
* cart
* orders

Collection: users

```json
{
  "_id": "u101",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
}
```

Collection: products

```json
{
  "_id": "p101",
  "title": "Blue Cotton Shirt",
  "category": "shirts",
  "color": "blue",
  "price": 899,
  "imageUrl": "/images/p101.jpg",
  "stock": 20
}
```

Collection: cart

Each user owns a separate cart.

```json
{
  "_id": "c101",
  "userId": "u101",
  "items": [
    {
      "productId": "p101",
      "quantity": 2
    }
  ],
  "updatedAt": "2026-06-18T12:00:00Z"
}
```

Collection: orders

```json
{
  "_id": "o101",
  "userId": "u101",
  "items": [
    {
      "productId": "p101",
      "quantity": 2,
      "price": 899
    }
  ],
  "totalAmount": 1798,
  "status": "placed",
  "createdAt": "2026-06-18T12:30:00Z"
}
```

Relationships:

* cart.userId → users._id
* cart.items.productId → products._id
* orders.userId → users._id
* orders.items.productId → products._id

Notes:

* Each user has exactly one active cart.
* Product data is currently served from `products.js`.
* MongoDB collections will replace `products.js` in future versions.
* User authentication is out of scope for the MVP; a demo user may be hardcoded during development.

-----------------------------------------------------------------------
-----------------------------------------------------------------------


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



Frontend Integration

The NLP module is integrated directly into the frontend codebase and does not expose a separate API.

Flow:

```txt
Microphone Input → Transcript → NLP Parser → Intent JSON → Backend API → UI Update
```

Entry Point:

```js
import { parse } from "./nlp/parserTypes.js";
```

Usage:

```js
const intent = await parse(transcript);
```

Example:

Input:

```txt
show me blue shirts under 1000
```

Output:

```json
{
  "action": "filter",
  "category": "shirts",
  "color": "blue",
  "priceMax": 1000
}
```

The frontend is responsible for mapping the generated intent to the corresponding backend endpoint.

Parser Entry Point

Frontend applications must only import:

```txt
parserTypes.js
```

Internal parser files are implementation details and must not be imported directly.

Do not import:

* intentParser.js
* openaiParser.js
* patterns.js
* constants.js

Parser Strategy

`parserTypes.js` acts as the parser abstraction layer.

Current implementation:

* Rule-based parser

Future implementation:

* OpenAI
* Gemini
* Other LLM providers

The parser implementation may change in future versions, but the output schema must remain unchanged.
