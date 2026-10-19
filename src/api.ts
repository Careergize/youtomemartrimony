import type { MatrimonialProfile } from './data/mockProfiles';

const TOKEN_KEY = 'you2me-token';
export const apiUrl = (path: string) => `https://api.you2mematrimonial.com/api/${path.replace(/^\/+/, '')}`;
export const hasSession = () => Boolean(sessionStorage.getItem(TOKEN_KEY));
export async function api<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const response = await fetch(apiUrl(path), {
    method,
    headers: { ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Token ${token}` } : {}) },
    ...(body === undefined ? {} : { body: body instanceof FormData ? body : JSON.stringify(body) }),
  });
  if (response.status === 401) sessionStorage.removeItem(TOKEN_KEY);
  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Server unavailable. Try again.' }));
    throw new Error(Object.entries(data).map(([key, value]) => `${key === 'detail' ? '' : `${key}: `}${Array.isArray(value) ? value.join(' ') : typeof value === 'string' ? value : JSON.stringify(value)}`).join(' '));
  }
  return response.status === 204 ? undefined as T : response.json();
}
export async function authenticate(path: 'login' | 'register', data: unknown) {
  const result = await api<{ token: string }>(`auth/${path}/`, 'POST', data);
  sessionStorage.setItem(TOKEN_KEY, result.token);
}
export async function loadProfiles() {
  const [discovery, connections] = await Promise.all([loadProfilePages('profiles/'), loadProfilePages('profiles/?connections=true')]);
  return [...new Map([...discovery, ...connections].map(profile => [profile.id, profile])).values()];
}
async function loadProfilePages(initialPath: string) {
  let path: string | null = initialPath;
  const profiles: MatrimonialProfile[] = [];
  while (path) {
    const page: { results: MatrimonialProfile[]; next: string | null } = await api(path);
    profiles.push(...page.results);
    path = page.next ? `profiles/${new URL(page.next).search}` : null;
  }
  return profiles;
}
export interface Interest { id: number; sender: string; recipient: string; status: string }
export async function connectionFor(profileId: string) {
  const interests = await api<Interest[]>('interests/');
  const connection = interests.find(i => i.sender === profileId || i.recipient === profileId);
  if (!connection) throw new Error('Send an interest first.');
  return connection;
}
