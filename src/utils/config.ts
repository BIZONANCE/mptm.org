// Centralized environment configuration - purely driven by process.env without hardcoded domain fallbacks
export function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  return url ? url.replace(/\/+$/, "") : "";
}

export function getAdminUrl(): string {
  const url = process.env.NEXT_PUBLIC_ADMIN_URL;
  return url ? url.replace(/\/+$/, "") : "";
}

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_MAIN_SITE_URL;
  return url ? url.replace(/\/+$/, "") : "";
}
