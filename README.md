# Bryonna's Crochet Nook (React + Django + Docker)

Fresh full-stack rebuild with:
- React + Vite frontend
- Django API backend
- Docker Compose local development

## Start the project

```bash
docker compose up --build
```

Frontend:
- http://localhost:5173

Backend:
- http://localhost:8000/api/health/
- http://localhost:8000/admin/

## Custom order API

POST `http://localhost:8000/api/custom-orders/`

JSON body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "item_type": "Bunny plush",
  "notes": "Pastel pink and cream"
}
```
