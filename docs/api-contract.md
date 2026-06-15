# API Contract v0.1

## Frontend → NLP

Request:

```json
{
  "transcript": "show me blue shirts under 1000"
}
```

Response:

```json
{
  "action": "filter",
  "category": "shirts",
  "color": "blue",
  "priceMax": 1000
}
```

---

## Common Fields

| Field      | Type   | Description                    |
|------------|--------|--------------------------------|
| action     | string | User intent                    |
| category   | string | Product category               |
| color      | string | Product color                  |
| priceMax   | number | Maximum price filter           |
| productId  | string | Unique product identifier      |
| quantity   | number | Number of items in cart        |

---

## NLP → Backend

Endpoint:

```txt
GET /products
```

Example query:

```txt
/products?category=shirts&color=blue&priceMax=1000
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

---

## Backend → Frontend

Response format:

```json
{
  "success": true,
  "products": []
}
```

---

## Rules

- Use the exact field names defined above.
- Do not rename keys without updating this document.
- All APIs must use JSON.
- Any contract changes must be discussed during stand-up.
