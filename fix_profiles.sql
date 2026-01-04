-- Run this to fix the "foreign key constraint" error
-- It simply creates a profile for any user who successfully signed up but is missing a profile record.

insert into public.profiles (id, username, full_name, avatar_url)
select 
  id, 
  coalesce(email, 'user_' || substr(id::text, 1, 8)), -- Fallback if email is missing
  coalesce(raw_user_meta_data->>'full_name', 'Unknown User'),
  raw_user_meta_data->>'avatar_url'
from auth.users
where id not in (select id from public.profiles);
