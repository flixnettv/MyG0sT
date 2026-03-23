import { createClient } from '@supabase/supabase-js';

const hasSupabaseConfig = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_KEY);
const supabase = hasSupabaseConfig
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

function warnMissingConfig(functionName) {
  if (!hasSupabaseConfig) {
    console.warn(`Supabase config missing: ${functionName} is using fallback mode`);
  }
}

export async function saveConversation(userId, message) {
  warnMissingConfig('saveConversation');
  if (!supabase) {
    return [{ user_id: userId, ...message }];
  }

  const { data, error } = await supabase.from('conversations').insert([{
    user_id: userId,
    message: message.userMessage,
    response: message.agentResponse,
    model_used: message.modelUsed,
    created_at: new Date().toISOString()
  }]);

  if (error) {
    console.error('Supabase saveConversation error:', error);
  }

  return data;
}

export async function getConversationHistory(userId, limit = 50) {
  warnMissingConfig('getConversationHistory');
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Supabase getConversationHistory error:', error);
  }

  return data || [];
}

export async function getUserProfile(userId) {
  warnMissingConfig('getUserProfile');
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Supabase getUserProfile error:', error);
  }

  return data;
}

export async function createUserProfile(userId, profile) {
  warnMissingConfig('createUserProfile');
  if (!supabase) {
    return [{ user_id: userId, ...profile }];
  }

  const { data, error } = await supabase.from('user_profiles').insert([{
    user_id: userId,
    name: profile.name,
    language: profile.language || 'ar',
    created_at: new Date().toISOString()
  }]);

  if (error) {
    console.error('Supabase createUserProfile error:', error);
  }

  return data;
}

export async function healthCheck() {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase.from('conversations').select('count');
    return !error;
  } catch {
    return false;
  }
}
