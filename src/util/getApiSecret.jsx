export function getApiSecret() {
  if (typeof window === "undefined") {
    return process.env.API_SECRET || "";
  } else {
    return process.env.NEXT_PUBLIC_API_SECRET || "";
  }
}
