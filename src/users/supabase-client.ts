import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente
const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;

// Inicializa o cliente
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
