import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';

import { createClient } from '@supabase/supabase-js';

import { Database } from '../database.types';
import {
  getServiceRoleKey,
  warnServiceRoleKeyUsage,
} from '../get-service-role-key';
import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * @name getSupabaseServerAdminClient
 * @description Get a Supabase client for use in the Server with admin access to the database.
 */
export function getSupabaseServerAdminClient<GenericSchema = Database>() {
  noStore();
  warnServiceRoleKeyUsage();

  const url = getSupabaseClientKeys().url;

  return createClient<GenericSchema>(url, getServiceRoleKey(), {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  });
}
