import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private forceLogoutCallbacks: Array<(reason: string) => void> = [];

  connect(token: string, userId: string, sessionId: string): void {
    if (this.socket && this.socket.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token, userId, sessionId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('⚡ Connected to Amrutam Realtime Session Gateway:', this.socket?.id);
    });

    // Handle single-session enforcement / concurrent login events from server
    this.socket.on('CONCURRENT_LOGIN', (data: { userId: string; reason?: string }) => {
      console.warn('⚠️ Concurrent login detected on another tab/device via Socket:', data);
      this.triggerForceLogout(data.reason || 'You were logged out because your account logged in from another device/tab.');
    });

    this.socket.on('FORCE_LOGOUT', (data: { reason?: string }) => {
      console.warn('⚠️ Force logout triggered via Socket:', data);
      this.triggerForceLogout(data.reason || 'Session invalidated by administrator or system policy.');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('⚡ Disconnected from Realtime Session Gateway:', reason);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onForceLogout(callback: (reason: string) => void): () => void {
    this.forceLogoutCallbacks.push(callback);
    return () => {
      this.forceLogoutCallbacks = this.forceLogoutCallbacks.filter((cb) => cb !== callback);
    };
  }

  private triggerForceLogout(reason: string): void {
    this.forceLogoutCallbacks.forEach((cb) => cb(reason));
  }
}

export const socketService = new SocketService();
