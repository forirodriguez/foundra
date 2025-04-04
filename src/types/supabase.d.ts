import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { SupabaseClient } from "@supabase/supabase-js";

declare module "next/headers" {
  export function cookies(): ReadonlyRequestCookies;
}

declare module "@supabase/ssr" {
  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: {
        get(name: string): string | undefined;
        set(name: string, value: string, options: CookieOptions): void;
        remove(name: string, options: CookieOptions): void;
      };
    }
  ): SupabaseClient;

  export function createBrowserClient(
    supabaseUrl: string,
    supabaseKey: string
  ): SupabaseClient;

  export interface CookieOptions {
    domain?: string;
    path?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
  }
}
