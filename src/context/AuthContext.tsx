import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { AuthService } from '../services/auth.service';
import { socketService } from '../services/socket.service';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: User | null;
  sessionToken: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: (reason?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BROADCAST_CHANNEL_NAME = 'amrutam_session_broadcast_channel';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(AuthService.getSessionToken());
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const logout = useCallback((reason?: string) => {
    AuthService.clearSession();
    socketService.disconnect();
    setCurrentUser(null);
    setSessionToken(null);

    // Notify other tabs via BroadcastChannel
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: 'SESSION_ENDED' });
      channel.close();
    } catch (e) {
      // BroadcastChannel fallback
    }

    if (reason) {
      showToast(reason, 'error');
    }
  }, [showToast]);

  const login = useCallback((user: User, token: string) => {
    const sessionId = AuthService.setSession(token, user.id);
    setCurrentUser(user);
    setSessionToken(token);

    // Connect WebSocket
    socketService.connect(token, user.id, sessionId);

    // Broadcast new session to enforce single-session policy across open tabs
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({
        type: 'NEW_SESSION_LOGIN',
        userId: user.id,
        sessionId,
        timestamp: Date.now()
      });
      channel.close();
    } catch (e) {
      console.warn('BroadcastChannel not supported in browser');
    }

    showToast(`Welcome back, ${user.profile?.fullName || user.email}!`, 'success');
  }, [showToast]);

  // Initial session restoration
  useEffect(() => {
    const token = AuthService.getSessionToken();
    if (token) {
      AuthService.getProfile()
        .then((user) => {
          setCurrentUser(user);
          const sessionId = AuthService.getSessionId() || AuthService.setSession(token, user.id);
          socketService.connect(token, user.id, sessionId);
        })
        .catch(() => {
          AuthService.clearSession();
          setCurrentUser(null);
          setSessionToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Subscribe to socket force logout
  useEffect(() => {
    const unsubscribe = socketService.onForceLogout((reason) => {
      logout(reason);
    });
    return () => unsubscribe();
  }, [logout]);

  // Subscribe to Axios 401 session expired event
  useEffect(() => {
    const handleSessionExpired = (e: any) => {
      logout(e.detail?.reason || 'Your session expired. Please sign in again.');
    };

    window.addEventListener('amrutam_session_expired', handleSessionExpired);
    return () => window.removeEventListener('amrutam_session_expired', handleSessionExpired);
  }, [logout]);

  // Single-Session Cross-Tab BroadcastChannel Listener (Immediate Logout on another tab login)
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'NEW_SESSION_LOGIN') {
          const currentSessionId = AuthService.getSessionId();
          // If another tab logged into the same account or started a new session, perform immediate force logout on this tab
          if (currentUser && (data.userId === currentUser.id || data.sessionId !== currentSessionId)) {
            console.warn('⚡ Immediate logout triggered: Concurrent login detected from another tab');
            logout('⚠️ You have been signed out because your account was logged in from another tab or device.');
          }
        } else if (data.type === 'SESSION_ENDED') {
          if (currentUser) {
            logout('Logged out from another tab.');
          }
        }
      };
    } catch (err) {
      console.warn('BroadcastChannel initialization error:', err);
    }

    return () => {
      if (channel) channel.close();
    };
  }, [currentUser, logout]);

  return (
    <AuthContext.Provider value={{ currentUser, sessionToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
