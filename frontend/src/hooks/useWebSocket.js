import { useRef, useCallback } from "react";

export default function useWebSocket(onMessage) {
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket("ws://localhost:8000/ws/analyze");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      ws.onerror = (err) => {
        console.warn("WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
      };
    } catch (err) {
      console.warn("WebSocket not available:", err);
    }
  }, [onMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { connect, disconnect, send };
}