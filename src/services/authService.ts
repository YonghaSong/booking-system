const ADMIN_PASSWORD = 'bugfree2025!';
const ADMIN_SESSION_KEY = 'admin_session';

export interface AdminSession {
  isAuthenticated: boolean;
  loginTime: number;
  expiresAt: number;
}

export const authenticateAdmin = (password: string): boolean => {
  if (password === ADMIN_PASSWORD) {
    const session: AdminSession = {
      isAuthenticated: true,
      loginTime: Date.now(),
      expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8시간 후 만료
    };
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    return true;
  }
  return false;
};

export const isAdminAuthenticated = (): boolean => {
  try {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionData) return false;
    
    const session: AdminSession = JSON.parse(sessionData);
    
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    
    return session.isAuthenticated;
  } catch {
    return false;
  }
};

export const logoutAdmin = (): void => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const extendAdminSession = (): void => {
  if (isAdminAuthenticated()) {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (sessionData) {
      const session: AdminSession = JSON.parse(sessionData);
      session.expiresAt = Date.now() + (8 * 60 * 60 * 1000);
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }
  }
};