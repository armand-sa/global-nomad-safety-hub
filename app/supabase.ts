// Connection details for our database
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://niflmdyqchpgayktvlmv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZmxtZHlxY2hwZ2F5a3R2bG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTg3OTAsImV4cCI6MjA1NzI3NDc5MH0.FkaAX5IT0_JTVgNZXmRnIGzyY1p9gF7yJg4wOUa6tEw"

export const supabase = createClient(supabaseUrl, supabaseKey)