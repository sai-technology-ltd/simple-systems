const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.simplesystem.app";

interface ApiErrorPayload {
  message?: string;
}

async function parseApiResponse<T>(res: Response, fallbackMessage: string) {
  if (!res.ok) {
    let message = fallbackMessage;

    try {
      const data = (await res.json()) as ApiErrorPayload;
      if (data.message) {
        message = data.message;
      }
    } catch {
      // Ignore invalid JSON error bodies.
    }

    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

async function apiRequest<T>(
  path: string,
  init?: RequestInit,
  fallbackMessage = "Something went wrong. Please try again."
) {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  return parseApiResponse<T>(res, fallbackMessage);
}

export async function apiGet<T>(path: string, fallbackMessage?: string): Promise<T> {
  return apiRequest<T>(path, undefined, fallbackMessage);
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  fallbackMessage?: string
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    fallbackMessage
  );
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  fallbackMessage?: string
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
    fallbackMessage
  );
}

export async function apiPostWithoutBody<T>(
  path: string,
  fallbackMessage?: string
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "POST",
    },
    fallbackMessage
  );
}

export function apiBase() {
  return API_BASE;
}
