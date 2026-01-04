-- Add store tagging columns to posts table
alter table public.posts 
add column if not exists store_id bigint,
add column if not exists store_name text;
