import { supabase } from '../lib/supabase';
import { UserAccount, BirthProfile } from '../types';
import { setCurrentUser, saveBirthProfile, getSavedBirthProfile } from '../utils/storage';

export async function supabaseSignUp(
  name: string,
  email: string,
  password: string,
  birthDate?: string,
  birthplace?: string
): Promise<{ success: boolean; user?: UserAccount; error?: string; message?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: name.trim(),
          birth_date: birthDate || null,
          birthplace: birthplace || null,
          legal_drinking_age_confirmed: true,
          ritual_terms_accepted: true
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Registration could not be completed.' };
    }

    const newUser: UserAccount = {
      id: data.user.id,
      name: name.trim() || data.user.email?.split('@')[0] || 'Celestial Explorer',
      email: data.user.email || cleanEmail,
      birthDate: birthDate,
      birthplace: birthplace,
      createdAt: new Date(data.user.created_at).getTime(),
      savedFavorites: ['espadin']
    };

    // If user has a confirmed session immediately
    if (data.session) {
      setCurrentUser(newUser);

      // Upsert profile in public.profiles table
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name.trim(),
          email: cleanEmail,
          birth_date: birthDate ? birthDate : null,
          birthplace: birthplace || null,
          legal_drinking_age_confirmed: true,
          ritual_terms_accepted: true
        });
      } catch {
        // trigger handles this automatically if profile table exists
      }
    }

    // Save birth profile locally so the astrological engine updates immediately
    if (birthDate) {
      const existing = getSavedBirthProfile();
      const profile: BirthProfile = {
        birthDate,
        birthTime: existing?.birthTime || '20:45',
        birthplace: birthplace || 'Oaxaca de Juárez, Mexico',
        latitude: existing?.latitude || 17.0732,
        longitude: existing?.longitude || -96.7266,
        timeZone: existing?.timeZone || 'America/Mexico_City',
        consentTimestamp: Date.now()
      };
      saveBirthProfile(profile);
    }

    // Check if email confirmation is required by Supabase project settings
    if (!data.session && data.user.identities && data.user.identities.length > 0) {
      return {
        success: true,
        user: newUser,
        message: 'Account created! Please check your email to confirm your celestial dispatch address, or you can sign in directly if email verification is disabled.'
      };
    }

    return { success: true, user: newUser };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred during signup.' };
  }
}

export async function supabaseSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'User record not found.' };
    }

    // Try to fetch profile from public.profiles
    let profileData: any = null;
    try {
      const { data: fetchedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      profileData = fetchedProfile;
    } catch {
      // fallback to metadata
    }

    const name =
      profileData?.full_name ||
      data.user.user_metadata?.full_name ||
      data.user.user_metadata?.name ||
      data.user.email?.split('@')[0] ||
      'Celestial Explorer';

    const birthDate = profileData?.birth_date || data.user.user_metadata?.birth_date;
    const birthplace = profileData?.birthplace || data.user.user_metadata?.birthplace;

    const loggedInUser: UserAccount = {
      id: data.user.id,
      name,
      email: data.user.email || cleanEmail,
      birthDate,
      birthplace,
      createdAt: new Date(data.user.created_at).getTime(),
      savedFavorites: ['espadin', 'tepeztate']
    };

    setCurrentUser(loggedInUser);

    // If user has a saved birthdate, sync it with local birth profile
    if (birthDate) {
      const existing = getSavedBirthProfile();
      const profile: BirthProfile = {
        birthDate,
        birthTime: profileData?.birth_time || existing?.birthTime || '20:45',
        birthplace: birthplace || 'Oaxaca de Juárez, Mexico',
        latitude: profileData?.latitude || existing?.latitude || 17.0732,
        longitude: profileData?.longitude || existing?.longitude || -96.7266,
        timeZone: profileData?.time_zone || existing?.timeZone || 'America/Mexico_City',
        consentTimestamp: Date.now()
      };
      saveBirthProfile(profile);
    }

    return { success: true, user: loggedInUser };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred during sign in.' };
  }
}

export async function supabaseSignOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
  setCurrentUser(null);
}

export async function supabaseResetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: window.location.origin
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Could not send recovery email.' };
  }
}

export async function supabaseGetCurrentSessionUser(): Promise<UserAccount | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return null;

    const user = data.session.user;
    let profileData: any = null;
    try {
      const { data: fetched } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      profileData = fetched;
    } catch {
      // fallback
    }

    const name =
      profileData?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Celestial Explorer';

    return {
      id: user.id,
      name,
      email: user.email || '',
      birthDate: profileData?.birth_date || user.user_metadata?.birth_date,
      birthplace: profileData?.birthplace || user.user_metadata?.birthplace,
      createdAt: new Date(user.created_at).getTime(),
      savedFavorites: ['espadin']
    };
  } catch {
    return null;
  }
}
