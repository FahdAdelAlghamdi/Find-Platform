/* ============================================================
   FIND — Supabase Client
   ------------------------------------------------------------
   عبّي القيمتين تحت من لوحة تحكم Supabase:
   Project Settings > API > Project URL / anon public key
   (المفتاح anon public آمن الاستخدام بالواجهة الأمامية — هذا
   هو الغرض منه، والحماية الفعلية تتم عبر RLS policies اللي
   بنيناها بملف SQL في المرحلة 1)
   ============================================================ */

const SUPABASE_URL = "https://votxqupyvicqilznpjlq.supabase.co";      
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdHhxdXB5dmljcWlsem5wamxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NjY0MTAsImV4cCI6MjEwNTE0MjQxMH0.XJjZV0iExWpNtpjUPuWXBl8VRMbuPElfCat_Xc8w640";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
