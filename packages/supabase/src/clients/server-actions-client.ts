import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';

import { createClient } from '@supabase/supabase-js';

import { createServerClient } from '@supabase/ssr';

import { Database } from '../database.types';
import {
  getServiceRoleKey,
  warnServiceRoleKeyUsage,
} from '../get-service-role-key';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

const keys = getSupabaseClientKeys();
const serviceRoleKey = getServiceRoleKey();

function createServerSupabaseClient<
  GenericSchema extends Database = Database,
>() {
  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: getCookiesStrategy(),
  });
}

/**
 * @name getSupabaseServerComponentClient
 * @deprecated Use `getSupabaseServerClient` instead.
 * @param params
 */
export function getSupabaseServerActionClient<
  GenericSchema extends Database = Database,
>(params?: { admin: boolean }) {
  // prevent any caching (to be removed in Next v15)
  noStore();

  const keys = getSupabaseClientKeys();
  const admin = params?.admin ?? false;

  if (admin) {
    warnServiceRoleKeyUsage();

    return createClient<GenericSchema>(keys.url, serviceRoleKey, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });
  }

  return createServerSupabaseClient();
}

function getCookiesStrategy() {
  const cookieStore = cookies();

  return {
    get: (name: string) => {
      return cookieStore.get(name)?.value;
    },
    set: (name: string, value: string, options: object) => {
      cookieStore.set({ name, value, ...options });
    },
    remove: (name: string, options: object) => {
      cookieStore.set({
        name,
        value: '',
        ...options,
      });
    },
  };
}
