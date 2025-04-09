/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 */
export const PUBLIC_ROUTES = ["/"];

/**
 * An array of routes that are NOT accessible to the public
 * These routes do require authentication
 */
export const PROTECTED_ROUTES = ["/history", "/recommendations", "/settings"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 */
export const AUTH_ROUTES = ["/login", "/register", "/auth-error"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const API_AUTH_PREFIX = "/api/auth";

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
