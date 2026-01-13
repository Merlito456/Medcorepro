
import { createClient } from '@supabase/supabase-js';

// Derived from the provided connection string: postgresql://postgres.jvkkvijeopdlokmyxqhk...
const supabaseUrl = 'https://jvkkvijeopdlokmyxqhk.supabase.co';

// Note: In a real production environment, this Anon Key should be in process.env.SUPABASE_ANON_KEY
// Since it's a client-side app, we use the 'anon' 'public' key.
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SQL SCHEMA REFERENCE (For Supabase SQL Editor):
 * 
 * create table patients (
 *   id text primary key,
 *   name text not null,
 *   age int,
 *   gender text,
 *   blood_group text,
 *   last_visit date,
 *   philhealth_id text,
 *   is_senior boolean,
 *   is_pwd boolean,
 *   hmo_provider text,
 *   address jsonb,
 *   created_at timestamp with time zone default now()
 * );
 * 
 * create table appointments (
 *   id text primary key,
 *   patient_id text references patients(id),
 *   patient_name text,
 *   doctor_name text,
 *   time text,
 *   date date,
 *   type text,
 *   status text,
 *   created_at timestamp with time zone default now()
 * );
 * 
 * create table inventory (
 *   id text primary key,
 *   name text not null,
 *   stock int default 0,
 *   price decimal(10,2),
 *   expiry date,
 *   is_generic boolean,
 *   created_at timestamp with time zone default now()
 * );
 * 
 * create table invoices (
 *   id text primary key,
 *   patient text,
 *   total decimal(10,2),
 *   disc decimal(10,2),
 *   ph decimal(10,2),
 *   net decimal(10,2),
 *   status text,
 *   method text,
 *   date date,
 *   created_at timestamp with time zone default now()
 * );
 */
