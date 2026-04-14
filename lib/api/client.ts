import type {
  Category,
  Comment,
  CreateIdeaDto,
  Idea,
  IdeaQueryParams,
  PaginatedIdeas,
  Purchase,
  Role,
  User,
  VoteType,
} from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include", // BetterAuth cookie sent automatically
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const text = await res.text();
  if (!text) return null as T;
  const json = JSON.parse(text);
  if (!res.ok) throw new Error(json.error ?? json.message ?? "Request failed");
  
  // Unwrap if the backend returns { data: ... } but it isn't PaginatedIdeas
  if (json && typeof json === 'object' && 'data' in json && !('meta' in json) && !Array.isArray(json)) {
    return json.data as T;
  }
  return json as T;
}

function qs(params: Record<string, unknown>): string {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
}

export const api = {
  // ── Health ─────────────────────────────────────────────────────────────
  health: {
    check: () => req<{ status: string }>("/health"),
  },

  // ── Auth ───────────────────────────────────────────────────────────────
  auth: {
    signup: (body: { name: string; email: string; password: string }) =>
      req<User>("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
    me: () => req<User>("/auth/me"),
    updateProfile: (body: { name?: string; avatarUrl?: string }) =>
      req<User>("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),
    changePassword: (body: { currentPassword: string; newPassword: string }) =>
      req<void>("/auth/me/password", { method: "PATCH", body: JSON.stringify(body) }),
  },

  // ── Categories ─────────────────────────────────────────────────────────
  categories: {
    list: () => req<Category[]>("/categories"),
    create: (name: string) =>
      req<Category>("/categories", { method: "POST", body: JSON.stringify({ name }) }),
    update: (id: string, name: string) =>
      req<Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
    delete: (id: string) => req<void>(`/categories/${id}`, { method: "DELETE" }),
  },

  // ── Ideas ──────────────────────────────────────────────────────────────
  ideas: {
    list: (params: IdeaQueryParams) =>
      req<PaginatedIdeas>(`/ideas?${qs(params as Record<string, unknown>)}`),
    get: (id: string) => req<Idea>(`/ideas/${id}`),
    create: (body: CreateIdeaDto) =>
      req<Idea>("/ideas", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<CreateIdeaDto>) =>
      req<Idea>(`/ideas/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    submit: (id: string) => req<Idea>(`/ideas/${id}/submit`, { method: "PATCH" }),
    delete: (id: string) => req<void>(`/ideas/${id}`, { method: "DELETE" }),
  },

  // ── Votes ──────────────────────────────────────────────────────────────
  votes: {
    cast: (ideaId: string, type: VoteType) =>
      req<void>(`/ideas/${ideaId}/votes`, { method: "POST", body: JSON.stringify({ type }) }),
    remove: (ideaId: string) => req<void>(`/ideas/${ideaId}/votes`, { method: "DELETE" }),
  },

  // ── Comments ───────────────────────────────────────────────────────────
  comments: {
    list: (ideaId: string) => req<Comment[]>(`/ideas/${ideaId}/comments`),
    post: (ideaId: string, content: string) =>
      req<Comment>(`/ideas/${ideaId}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
    reply: (ideaId: string, parentId: string, content: string) =>
      req<Comment>(`/ideas/${ideaId}/comments/${parentId}/replies`, { method: "POST", body: JSON.stringify({ content }) }),
    delete: (ideaId: string, commentId: string) =>
      req<void>(`/ideas/${ideaId}/comments/${commentId}`, { method: "DELETE" }),
  },

  // ── Payments ───────────────────────────────────────────────────────────
  payments: {
    createCheckout: (ideaId: string) =>
      req<{ checkoutUrl: string }>("/payments/checkout", { method: "POST", body: JSON.stringify({ ideaId }) }),
    verify: (sessionId: string) => req<Purchase>(`/payments/verify/${sessionId}`),
    myPurchases: () => req<Purchase[]>("/payments/purchases"),
  },

  // ── Search ─────────────────────────────────────────────────────────────
  search: {
    ideas: (q: string, params?: Pick<IdeaQueryParams, "category" | "page" | "limit">) =>
      req<PaginatedIdeas>(`/search?q=${encodeURIComponent(q)}&${qs((params ?? {}) as Record<string, unknown>)}`),
  },

  // ── Newsletter ─────────────────────────────────────────────────────────
  newsletter: {
    subscribe: (email: string) =>
      req<void>("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
    unsubscribe: (email: string) =>
      req<void>("/newsletter/unsubscribe", { method: "DELETE", body: JSON.stringify({ email }) }),
  },

  // ── Admin ──────────────────────────────────────────────────────────────
  admin: {
    ideas: {
      list: () => req<Idea[]>("/admin/ideas"),
      approve: (id: string) => req<Idea>(`/admin/ideas/${id}/approve`, { method: "PATCH" }),
      reject: (id: string, feedback: string) =>
        req<Idea>(`/admin/ideas/${id}/reject`, { method: "PATCH", body: JSON.stringify({ feedback }) }),
      delete: (id: string) => req<void>(`/admin/ideas/${id}`, { method: "DELETE" }),
    },
    users: {
      list: () => req<User[]>("/admin/users"),
      activate: (id: string) => req<User>(`/admin/users/${id}/activate`, { method: "PATCH" }),
      deactivate: (id: string) => req<User>(`/admin/users/${id}/deactivate`, { method: "PATCH" }),
      setRole: (id: string, role: Role) =>
        req<User>(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
    },
  },
};
