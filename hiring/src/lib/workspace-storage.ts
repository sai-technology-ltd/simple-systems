"use client";

const STORAGE_KEY = "simple-hiring-client-slug";
const PAYMENT_REFERENCE_STORAGE_KEY = "simple-hiring-payment-reference";

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

export function readStoredPaymentReference() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(PAYMENT_REFERENCE_STORAGE_KEY) ?? "";
}

export function storePaymentReference(reference: string) {
  if (typeof window === "undefined" || !reference) {
    return;
  }

  window.localStorage.setItem(PAYMENT_REFERENCE_STORAGE_KEY, reference);
}

export function clearStoredPaymentReference() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PAYMENT_REFERENCE_STORAGE_KEY);
}
