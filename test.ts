import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://qrzpfhssavhrmsuebwxz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyenBmaHNzYXZocm1zdWVid3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NzEyODAsImV4cCI6MjA5ODA0NzI4MH0.3ifvNRbNlkwus689tuHL46aPgAmRIrZ_vr8kcbWm1fY');

async function test() {
  const { data, error } = await supabase.from('messages').select('receiver_id').limit(1);
  console.log('Error selecting receiver_id:', error);
  console.log('Data:', data);
}

test();
