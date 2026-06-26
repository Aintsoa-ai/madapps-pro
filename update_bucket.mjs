import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve('.env'), 'utf8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);
const serviceRoleMatch = envContent.match(/VITE_SUPABASE_SERVICE_ROLE_KEY=(.*)/); 

// The user might not have service_role_key in .env. Let's check.
// If they don't, we can try with anon_key, though it might fail if anon lacks permissions to update buckets.
// If it fails, we will instruct the user or use the browser subagent.

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());
  
  async function updateLimit() {
    const { data, error } = await supabase.storage.updateBucket('media', {
      public: true,
      fileSizeLimit: 209715200 // 200 MB
    });
    
    if (error) {
      console.error('Error updating bucket:', error);
    } else {
      console.log('Bucket updated successfully:', data);
    }
  }
  
  updateLimit();
}
