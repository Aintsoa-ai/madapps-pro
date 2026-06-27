import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qrzpfhssavhrmsuebwxz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyenBmaHNzYXZocm1zdWVid3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NzEyODAsImV4cCI6MjA5ODA0NzI4MH0.3ifvNRbNlkwus689tuHL46aPgAmRIrZ_vr8kcbWm1fY';



if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMessages() {
  console.log("Testing messages insert...");
  // Use a dummy UUID for sender_id. This will fail if there is a foreign key constraint to users table.
  // Actually, we can get a real user from profiles or just try.
  const { data: users, error: userError } = await supabase.from('profiles').select('*');
  console.log("Profiles:", users, userError);
  
  const { data, error } = await supabase.from('messages').insert({
    sender_id: userId,
    subject: 'Test Subject',
    content: 'Test Content'
  }).select();
  
  if (error) {
    console.error("Insert failed:", error);
  } else {
    console.log("Insert success:", data);
  }

  console.log("Testing messages select...");
  const { data: fetch, error: fetchError } = await supabase.from('messages').select('*, profiles(username, avatar_url)');
  if (fetchError) {
    console.error("Select failed:", fetchError);
  } else {
    console.log("Select success, count:", fetch ? fetch.length : 0);
  }
}

testMessages();
