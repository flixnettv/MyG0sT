# API Documentation

## Health
- `GET /health`

## Server Info
- `GET /api/info`

## Models
- `GET /api/models`
- `POST /api/models/switch`
  - body: `{ "modelId": "groq" }`

## Chat
- `POST /api/chat`
  - body: `{ "userId": "123", "message": "مرحبا" }`

## Tools
- `GET /api/tools`
- `POST /api/tools/execute`
  - body: `{ "skillName": "get_system_info", "input": {} }`
