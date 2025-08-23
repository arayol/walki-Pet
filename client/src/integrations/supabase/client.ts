// Compatibility layer - redirects to new API client
import { apiClient } from '../api/client.js';

// Legacy Supabase compatibility exports
export const supabase = apiClient;
export const supabasePromise = Promise.resolve(apiClient);
export const getSupabase = () => Promise.resolve(apiClient);

// Export the API client as the main export
export default apiClient;