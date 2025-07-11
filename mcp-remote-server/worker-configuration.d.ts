interface Environment {
  OAUTH_KV: KVNamespace;
  FRAPPE_BASE_URL: string;
  FRAPPE_API_KEY: string;
  FRAPPE_API_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  COOKIE_ENCRYPTION_KEY: string;
  SENTRY_DSN?: string;
  NODE_ENV?: string;
}

export { Environment };
