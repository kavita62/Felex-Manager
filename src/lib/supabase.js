import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://r3sllt3kgzbmxtbaoooyxyw.supabase.co'
const supabaseAnonKey = 'sb_publishable_R3SlLT3kgZBMXTbaOoyxYw_Z8SwBW_d'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 