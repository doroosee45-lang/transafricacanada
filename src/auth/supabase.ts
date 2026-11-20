import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { AppState, Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const validUrl = (value: string | undefined) => {
  if (!value) return false;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
};
// These are public project values, never a service role key. No client is created when unconfigured.
export const authConfigured = validUrl(url) && !!key && Platform.OS !== 'web';
const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};
export const supabase = authConfigured ? createClient(url!, key!, {auth:{storage:secureStorage, flowType:'pkce', persistSession:true, autoRefreshToken:true, detectSessionInUrl:false}}) : null;
if (supabase) {
  const client = supabase;
  AppState.addEventListener('change', state => {
    if (state === 'active') client.auth.startAutoRefresh(); else client.auth.stopAutoRefresh();
  });
}
