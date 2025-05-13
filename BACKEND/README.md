# WebSocket Backend Server

This is a Python-based WebSocket server that serves JSON data for the dashboard application.

## Setup

1. Create a Python virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Make sure all JSON files are present in the `data` directory:
- hero.json
- services.json
- how.json
- announcements.json
- footer.json
- testimonials.json
- header.json

## Running the Server

Start the server by running:
```bash
python websocket_server.py
```

The WebSocket server will be available at `ws://localhost:8000/ws`

## Usage in Frontend

Use the `useWebhook` hook from `lib/useWebhook.ts` to connect to the WebSocket server and receive real-time updates. 