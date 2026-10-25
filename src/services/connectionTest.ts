/**
 * Studio Royale - Supabase Connection Ping Utility
 * Performs a lightweight, table-free HTTP ping request to check endpoint health.
 */

export interface SupabasePingResult {
  success: boolean;
  status: number | null;
  message: string;
  timestamp: string;
}

const DEFAULT_SUPABASE_URL = 'https://sskbgfdpkrwfstsdnvkq.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_lE3PSpqyYTj2eU51k9GbWA_V3Ra1Zum';

/**
 * Performs a table-free HTTP ping to the Supabase REST endpoint.
 */
export async function testSupabaseConnection(
  targetUrl?: string,
  apiKey?: string
): Promise<SupabasePingResult> {
  const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : (process.env || {});
  const url = targetUrl || env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = apiKey || env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

  if (!url) {
    return {
      success: false,
      status: null,
      message: 'URL do Supabase não fornecida.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const cleanUrl = url.replace(/\/+$/, '');
    const pingEndpoint = `${cleanUrl}/rest/v1/`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(pingEndpoint, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Status 200, 401, or 404 indicates the PostgREST / Supabase gateway is live and listening
    const isAlive = response.status === 200 || response.status === 401 || response.status === 404;

    return {
      success: isAlive,
      status: response.status,
      message: isAlive
        ? `Endpoint responsivo e online (HTTP ${response.status})`
        : `Endpoint respondeu com erro (HTTP ${response.status})`,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      success: false,
      status: null,
      message: error?.name === 'AbortError'
        ? 'Tempo limite de conexão esgotado (Timeout).'
        : `Erro de rede ou CORS: ${error?.message || 'Falha ao conectar'}`,
      timestamp: new Date().toISOString()
    };
  }
}
