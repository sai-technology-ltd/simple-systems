"use client";

const STORAGE_KEY = "simple-hiring-client-slug";

export function readStoredClientSlug() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

export function storeClientSlug(clientSlug: string) {
  if (typeof window === "undefined" || !clientSlug) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, clientSlug);
}
