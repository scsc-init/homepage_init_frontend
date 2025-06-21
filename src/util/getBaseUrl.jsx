export function getBaseUrl() {
  if (typeof window === "undefined") {
    // SSR
    return process.env.BACKEND_URL ?? "http://localhost:8080";
  } else {
    // CSR
    return process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";
  }
}
