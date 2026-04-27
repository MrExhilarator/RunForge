import { supabase } from "../supabaseClient";

export const AuthService = {
  // ── Auth ──
  async signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: displayName } }
    });
    if (error) throw error;
    await supabase.from('profiles').upsert({
      id: data.user.id, name: displayName, email
    });
    return { uid: data.user.id, email, name: displayName };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    });
    if (error) throw error;
    const name = data.user.user_metadata?.name || email.split("@")[0];
    return { uid: data.user.id, email: data.user.email, name };
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });
    if (error) throw error;
  },

  // ── Database ──
  async saveUserProfile(uid, data) {
    await supabase.from('profiles').upsert({ id: uid, ...data });
  },

  async savePlan(uid, plan) {
    await supabase.from('plans').upsert({
      id: plan.id, user_id: uid, data: plan,
      updated_at: new Date().toISOString()
    });
  },

  async loadPlan(uid) {
    const { data } = await supabase.from('plans')
      .select('data')
      .eq('user_id', uid)
      .order('updated_at', { ascending: false })
      .limit(1);
    return data?.map(r => r.data) || [];
  },

  async saveRun(uid, run) {
    await supabase.from('runs').upsert({
      id: run.id, user_id: uid, data: run, date: run.date
    });
  },

  async loadRuns(uid) {
    const { data } = await supabase.from('runs')
      .select('data')
      .eq('user_id', uid)
      .order('date', { ascending: false });
    return data?.map(r => r.data) || [];
  },

  async saveCompletedWorkouts(uid, workouts) {
    await supabase.from('progress').upsert({
      user_id: uid, completed: workouts
    });
  },

  async loadCompletedWorkouts(uid) {
    const { data } = await supabase.from('progress')
      .select('completed')
      .eq('user_id', uid)
      .single();
    return data?.completed || [];
  },

  async saveStravaTokens(uid, tokens) {
    if (tokens) {
      await supabase.from('integrations').upsert({
        user_id: uid, strava: tokens
      });
    } else {
      await supabase.from('integrations')
        .delete().eq('user_id', uid);
    }
  },

  async loadStravaTokens(uid) {
    const { data } = await supabase.from('integrations')
      .select('strava')
      .eq('user_id', uid)
      .single();
    return data?.strava || null;
  },
};
