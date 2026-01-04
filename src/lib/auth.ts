import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export interface SignUpResponse {
  success: boolean;
  needsConfirmation: boolean;
  error: string | null;
}

// Get the base URL for redirects
function getBaseUrl(): string {
  // Use environment variable if set, otherwise use window.location.origin
  if (typeof window !== 'undefined') {
    // In production, use the actual origin
    // This handles both localhost and deployed URLs correctly
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://akshayavault.vercel.app';
}

// Sign up with email and password
export async function signUp(email: string, password: string, name: string): Promise<SignUpResponse> {
  try {
    const redirectUrl = `${getBaseUrl()}/login?confirmed=true`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      return { success: false, needsConfirmation: false, error: error.message };
    }

    if (data.user) {
      // Check if email confirmation is required
      // If identities array is empty, user already exists
      if (data.user.identities?.length === 0) {
        return { success: false, needsConfirmation: false, error: 'An account with this email already exists' };
      }
      
      // User created but needs email confirmation
      if (!data.session) {
        return { success: true, needsConfirmation: true, error: null };
      }

      // If session exists (email confirmation disabled in Supabase), create profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email: data.user.email,
          name: name,
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError.message);
      }

      return { success: true, needsConfirmation: false, error: null };
    }

    return { success: false, needsConfirmation: false, error: 'Sign up failed' };
  } catch (err) {
    return { success: false, needsConfirmation: false, error: 'An unexpected error occurred' };
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.user_metadata?.name || '',
          created_at: data.user.created_at,
        },
        error: null
      };
    }

    return { user: null, error: 'Sign in failed' };
  } catch (err) {
    return { user: null, error: 'An unexpected error occurred' };
  }
}

// Sign out
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err) {
    return { error: 'An unexpected error occurred' };
  }
}

// Get current user - fast version using cached session
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Use getSession which is faster (uses cached data)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) return null;

    const user = session.user;
    
    // Return user immediately with metadata, don't wait for profile
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || '',
      created_at: user.created_at,
    };
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || '',
        created_at: session.user.created_at,
      });
    } else {
      callback(null);
    }
  });
}
