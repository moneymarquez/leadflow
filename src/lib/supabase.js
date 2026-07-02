import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://buuntdpgiwvarvtyncfx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dW50ZHBnaXd2YXJ2dHluY2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4OTk2ODcsImV4cCI6MjA5NzQ3NTY4N30.5ZlCR_FYrDiSOZnpQXGBTbUeRl6HZ4ohWEnaTb3ICEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
