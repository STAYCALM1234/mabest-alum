import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mizjhxmnpsyvkrklzwlp.supabase.co'      // 👈 Your actual Supabase project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pempoeG1ucHN5dmtya2x6d2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODc1NDUsImV4cCI6MjA2Njg2MzU0NX0.fQYe7kw5AfGCaSIJSR4zIhPFuGh_0QzpMdjc70EYYNM'                         // 👈 Your anon public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
