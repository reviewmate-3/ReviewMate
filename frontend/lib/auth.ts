const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('reviewmate_token');
}

export function getStoredUser(): { name?: string; email?: string; role?: string } | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem('reviewmate_user');
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function logout() {
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('reviewmate_refresh_token') : null;
  if (refreshToken) {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => undefined);
  }
  localStorage.removeItem('reviewmate_token');
  localStorage.removeItem('reviewmate_refresh_token');
  localStorage.removeItem('reviewmate_user');
}

export { API_URL };
