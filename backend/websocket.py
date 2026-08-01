import json
import logging
from typing import Dict, Set
from fastapi import WebSocket

logger = logging.getLogger("websockets")

class WebSocketManager:
    def __init__(self):
        # Maps room names (e.g., 'district:250', 'officer:UUID', 'citizen:UUID') to active connections
        self.rooms: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.rooms:
            self.rooms[room] = set()
        self.rooms[room].add(websocket)
        logger.info(f"WebSocket client joined room: {room}. Active rooms: {list(self.rooms.keys())}")

    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.rooms:
            self.rooms[room].discard(websocket)
            if not self.rooms[room]:
                del self.rooms[room]
        logger.info(f"WebSocket client disconnected from room: {room}")

    async def broadcast_to_room(self, room: str, event_type: str, payload: dict):
        if room in self.rooms:
            message = {
                "event_type": event_type,
                "payload": payload
            }
            payload_str = json.dumps(message)
            disconnected_sockets = set()
            for connection in self.rooms[room]:
                try:
                    await connection.send_text(payload_str)
                except Exception as e:
                    logger.error(f"Failed to send websocket broadcast to room {room}: {e}")
                    disconnected_sockets.add(connection)
            
            # Clean up stale connections
            for conn in disconnected_sockets:
                self.rooms[room].discard(conn)
                
            if not self.rooms[room]:
                del self.rooms[room]

# Global Manager Instance
ws_manager = WebSocketManager()
