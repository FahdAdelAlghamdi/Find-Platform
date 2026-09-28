-- FIND backup — 2026-09-27 15:54
-- الاسترجاع: شغّل 00_ALL_SCHEMA.sql بمشروع Supabase جديد، ثم data_00_ALL.sql
set search_path = public, extensions;

-- ==================== 01_extensions.sql ====================
create extension if not exists pg_stat_statements with schema extensions;
create extension if not exists pg_trgm with schema public;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists supabase_vault with schema vault;
create extension if not exists unaccent with schema public;
create extension if not exists "uuid-ossp" with schema extensions;

-- ==================== 02_enums.sql ====================
create type public.claim_status_enum as enum ('suggested', 'claimed', 'approved', 'rejected');
create type public.conversation_status_enum as enum ('active', 'closed');
create type public.notification_type_enum as enum ('new_match', 'new_claim', 'claim_approved', 'claim_rejected', 'new_message', 'report_resolved');
create type public.report_status_enum as enum ('open', 'matched', 'resolved', 'closed');
create type public.report_type_enum as enum ('lost', 'found');
create type public.user_role_enum as enum ('user', 'admin');
create type public.user_type_enum as enum ('student', 'staff', 'faculty');

-- ==================== 03_sequences.sql ====================
create sequence if not exists public.categories_id_seq as integer increment by 1 minvalue 1 maxvalue 2147483647 start with 1;
select setval('public.categories_id_seq', 10, true);
create sequence if not exists public.locations_id_seq as integer increment by 1 minvalue 1 maxvalue 2147483647 start with 1;
select setval('public.locations_id_seq', 13, true);
create sequence if not exists public.report_ref_seq as bigint increment by 1 minvalue 1 maxvalue 9223372036854775807 start with 1;
select setval('public.report_ref_seq', 16, true);

-- ==================== 04_table_categories.sql ====================
create table if not exists public.categories (
  id integer default nextval('categories_id_seq'::regclass) not null,
  name_ar text not null,
  name_en text not null,
  icon text,
  sort_order integer default 0 not null,
  is_active boolean default true not null,
  constraint categories_pkey PRIMARY KEY (id),
  constraint categories_name_ar_key UNIQUE (name_ar),
  constraint categories_name_en_key UNIQUE (name_en)
);

-- ==================== 04_table_conversations.sql ====================
create table if not exists public.conversations (
  id uuid default gen_random_uuid() not null,
  match_id uuid not null,
  user_a_id uuid not null,
  user_b_id uuid not null,
  status conversation_status_enum default 'active'::conversation_status_enum not null,
  created_at timestamp with time zone default now() not null,
  constraint conversations_pkey PRIMARY KEY (id),
  constraint conversations_match_id_key UNIQUE (match_id),
  constraint chk_diff_users CHECK ((user_a_id <> user_b_id))
);

-- ==================== 04_table_locations.sql ====================
create table if not exists public.locations (
  id integer default nextval('locations_id_seq'::regclass) not null,
  name_ar text not null,
  name_en text not null,
  building_code text,
  sort_order integer default 0 not null,
  is_active boolean default true not null,
  constraint locations_pkey PRIMARY KEY (id),
  constraint locations_name_ar_name_en_key UNIQUE (name_ar, name_en)
);

-- ==================== 04_table_matches.sql ====================
create table if not exists public.matches (
  id uuid default gen_random_uuid() not null,
  lost_report_id uuid not null,
  found_report_id uuid not null,
  score_text numeric(5,2) default 0 not null,
  score_image numeric(5,2) default 0 not null,
  score_location numeric(5,2) default 0 not null,
  score_time numeric(5,2) default 0 not null,
  total_score numeric(5,2) default 0 not null,
  claim_status claim_status_enum default 'suggested'::claim_status_enum not null,
  claimed_by uuid,
  responded_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  constraint matches_pkey PRIMARY KEY (id),
  constraint matches_lost_report_id_found_report_id_key UNIQUE (lost_report_id, found_report_id),
  constraint chk_total_score CHECK (((total_score >= (0)::numeric) AND (total_score <= (100)::numeric)))
);

-- ==================== 04_table_messages.sql ====================
create table if not exists public.messages (
  id uuid default gen_random_uuid() not null,
  conversation_id uuid not null,
  sender_id uuid not null,
  body text not null,
  is_read boolean default false not null,
  created_at timestamp with time zone default now() not null,
  constraint messages_pkey PRIMARY KEY (id),
  constraint chk_body_len CHECK (((char_length(body) >= 1) AND (char_length(body) <= 2000)))
);

-- ==================== 04_table_notifications.sql ====================
create table if not exists public.notifications (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  type notification_type_enum not null,
  title_ar text not null,
  title_en text not null,
  match_id uuid,
  report_id uuid,
  is_read boolean default false not null,
  created_at timestamp with time zone default now() not null,
  constraint notifications_pkey PRIMARY KEY (id)
);

-- ==================== 04_table_profiles.sql ====================
create table if not exists public.profiles (
  id uuid not null,
  full_name text not null,
  university_id text not null,
  user_type user_type_enum not null,
  phone text not null,
  role user_role_enum default 'user'::user_role_enum not null,
  internal_email text,
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint profiles_pkey PRIMARY KEY (id),
  constraint profiles_university_id_key UNIQUE (university_id),
  constraint chk_phone CHECK ((phone ~ '^(05|9665|\+9665)[0-9]{8}$'::text)),
  constraint chk_university_id CHECK ((university_id ~ '^[0-9]{6,12}$'::text))
);

-- ==================== 04_table_reports.sql ====================
create table if not exists public.reports (
  id uuid default gen_random_uuid() not null,
  reference_no text,
  user_id uuid not null,
  type report_type_enum not null,
  category_id integer not null,
  location_id integer not null,
  title text not null,
  description text not null,
  event_date date not null,
  event_time time without time zone,
  image_url text,
  image_hash text,
  status report_status_enum default 'open'::report_status_enum not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint reports_pkey PRIMARY KEY (id),
  constraint reports_reference_no_key UNIQUE (reference_no),
  constraint chk_desc_len CHECK (((char_length(description) >= 10) AND (char_length(description) <= 1000))),
  constraint chk_event_date CHECK ((event_date <= CURRENT_DATE)),
  constraint chk_image_hash CHECK (((image_hash IS NULL) OR (image_hash ~ '^[0-9a-f]{16}$'::text))),
  constraint chk_title_len CHECK (((char_length(title) >= 3) AND (char_length(title) <= 120)))
);

-- ==================== 05_foreign_keys.sql ====================
alter table public.conversations add constraint conversations_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;
alter table public.conversations add constraint conversations_user_a_id_fkey FOREIGN KEY (user_a_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.conversations add constraint conversations_user_b_id_fkey FOREIGN KEY (user_b_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.matches add constraint matches_claimed_by_fkey FOREIGN KEY (claimed_by) REFERENCES profiles(id);
alter table public.matches add constraint matches_found_report_id_fkey FOREIGN KEY (found_report_id) REFERENCES reports(id) ON DELETE CASCADE;
alter table public.matches add constraint matches_lost_report_id_fkey FOREIGN KEY (lost_report_id) REFERENCES reports(id) ON DELETE CASCADE;
alter table public.messages add constraint messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
alter table public.messages add constraint messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.notifications add constraint notifications_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;
alter table public.notifications add constraint notifications_report_id_fkey FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE;
alter table public.notifications add constraint notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.profiles add constraint profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.reports add constraint reports_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id);
alter table public.reports add constraint reports_location_id_fkey FOREIGN KEY (location_id) REFERENCES locations(id);
alter table public.reports add constraint reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter sequence public.categories_id_seq owned by public.categories.id;
alter sequence public.locations_id_seq owned by public.locations.id;

-- ==================== 06_indexes.sql ====================
CREATE INDEX IF NOT EXISTS idx_conv_user_a ON public.conversations USING btree (user_a_id);
CREATE INDEX IF NOT EXISTS idx_conv_user_b ON public.conversations USING btree (user_b_id);
CREATE INDEX IF NOT EXISTS idx_matches_found ON public.matches USING btree (found_report_id, total_score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_lost ON public.matches USING btree (lost_report_id, total_score DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches USING btree (claim_status);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages USING btree (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notif_user ON public.notifications USING btree (user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_created ON public.reports USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_date ON public.reports USING btree (event_date DESC);
CREATE INDEX IF NOT EXISTS idx_reports_desc_trgm ON public.reports USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_reports_type_cat ON public.reports USING btree (type, category_id, status);
CREATE INDEX IF NOT EXISTS idx_reports_user ON public.reports USING btree (user_id);

-- ==================== 07_function_calculate_match_score.sql ====================
CREATE OR REPLACE FUNCTION public.calculate_match_score(p_report_a uuid, p_report_b uuid)
 RETURNS TABLE(score_text numeric, score_image numeric, score_location numeric, score_time numeric, total_score numeric)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$declare
  a record;
  b record;
  v_text  numeric := 0;
  v_img   numeric := 0;
  v_loc   numeric := 0;
  v_time  numeric := 0;
  v_sim   numeric;
  v_ham   int;
  v_days  int;
  v_hours numeric;
  a_bldg  text;
  b_bldg  text;
begin
  select * into a from public.reports where id = p_report_a;
  select * into b from public.reports where id = p_report_b;

  if a is null or b is null then
    return query select 0::numeric, 0::numeric, 0::numeric, 0::numeric, 0::numeric;
    return;
  end if;

  -- شرط إجباري: نفس الفئة
  if a.category_id <> b.category_id then
    return query select 0::numeric, 0::numeric, 0::numeric, 0::numeric, 0::numeric;
    return;
  end if;

  -- ---------- (1) تشابه النص — 35 نقطة ----------
  -- يُقارن العنوان + الوصف بعد التطبيع
  v_sim := similarity(
             unaccent(lower(a.title || ' ' || a.description)),
             unaccent(lower(b.title || ' ' || b.description))
           );
  v_text := round((v_sim * 35)::numeric, 2);

  -- ---------- (2) تشابه الصورة — 25 نقطة ----------
  if a.image_hash is not null and b.image_hash is not null then
    v_ham := public.phash_hamming(a.image_hash, b.image_hash);
    if v_ham is not null then
      -- مسافة 0-10 تعطي نقاطاً، وما فوق 20 يعتبر لا تشابه
      if v_ham <= 20 then
        v_img := round((((20 - v_ham)::numeric / 20) * 25), 2);
      else
        v_img := 0;
      end if;
    end if;
  else
    -- لا توجد صورة لدى أحدهما: نعيد توزيع وزن الصورة على النص
    -- (حتى لا يُعاقَب البلاغ الخالي من صورة)
    v_text := round((v_sim * 60)::numeric, 2);   -- 35 + 25
    v_text := least(v_text, 60);
  end if;

  -- ---------- (3) الموقع — 20 نقطة ----------
  if a.location_id = b.location_id then
    v_loc := 20;
  else
    select building_code into a_bldg from public.locations where id = a.location_id;
    select building_code into b_bldg from public.locations where id = b.location_id;
    if a_bldg is not null and a_bldg = b_bldg then
      v_loc := 10;   -- نفس المبنى، موقع مختلف
    else
      v_loc := 0;
    end if;
  end if;

  -- ---------- (4) الزمن — 20 نقطة ----------
  v_days := abs(a.event_date - b.event_date);
  if v_days = 0 then
    v_time := 16;
    -- مكافأة إضافية إذا كانت الساعة قريبة (4 نقاط)
    if a.event_time is not null and b.event_time is not null then
      v_hours := abs(extract(epoch from (a.event_time - b.event_time))) / 3600.0;
      if v_hours <= 2 then
        v_time := v_time + 4;
      elsif v_hours <= 6 then
        v_time := v_time + 2;
      end if;
    end if;
  elsif v_days <= 3  then v_time := 14;
  elsif v_days <= 7  then v_time := 10;
  elsif v_days <= 14 then v_time := 6;
  elsif v_days <= 30 then v_time := 3;
  else                    v_time := 0;
  end if;

  return query select
    v_text,
    v_img,
    v_loc,
    v_time,
    round(least(v_text + v_img + v_loc + v_time, 100), 2);
end;$function$
;

-- ==================== 07_function_can_view_report.sql ====================
CREATE OR REPLACE FUNCTION public.can_view_report(p_report_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    -- (أ) صاحب البلاغ
    exists (
      select 1 from public.reports r
      where r.id = p_report_id and r.user_id = auth.uid()
    )
    or
    -- (ب) ظهر كتطابق مع أحد بلاغاتي (مطابقة ثنائية الاتجاه)
    exists (
      select 1
      from public.matches m
      join public.reports mine
        on mine.user_id = auth.uid()
      where
        (m.lost_report_id  = p_report_id and m.found_report_id = mine.id)
        or
        (m.found_report_id = p_report_id and m.lost_report_id  = mine.id)
    );
$function$
;

-- ==================== 07_function_claim_match.sql ====================
CREATE OR REPLACE FUNCTION public.claim_match(p_match_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  m          record;
  v_other    uuid;
begin
  select * into m from public.matches where id = p_match_id;
  if m is null then
    return json_build_object('ok', false, 'error', 'MATCH_NOT_FOUND');
  end if;

  -- التأكد أن المستخدم طرف في هذا التطابق
  if not (public.owns_report(m.lost_report_id) or public.owns_report(m.found_report_id)) then
    return json_build_object('ok', false, 'error', 'NOT_AUTHORIZED');
  end if;

  if m.claim_status <> 'suggested' then
    return json_build_object('ok', false, 'error', 'ALREADY_PROCESSED');
  end if;

  update public.matches
  set claim_status = 'claimed',
      claimed_by   = auth.uid()
  where id = p_match_id;

  -- إشعار الطرف الآخر
  select user_id into v_other
  from public.reports
  where id in (m.lost_report_id, m.found_report_id)
    and user_id <> auth.uid()
  limit 1;

  if v_other is not null then
    insert into public.notifications (user_id, type, title_ar, title_en, match_id)
    values (v_other, 'new_claim',
            'شخص يعتقد أن هذا الغرض يخصه',
            'Someone believes this item belongs to them',
            p_match_id);
  end if;

  return json_build_object('ok', true, 'status', 'claimed');
end;
$function$
;

-- ==================== 07_function_generate_reference_no.sql ====================
CREATE OR REPLACE FUNCTION public.generate_reference_no()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.reference_no is null then
    new.reference_no :=
      case when new.type = 'lost' then 'L-' else 'F-' end
      || to_char(now(), 'YYYY') || '-'
      || lpad(nextval('public.report_ref_seq')::text, 6, '0');
  end if;
  return new;
end;
$function$
;

-- ==================== 07_function_get_admin_stats.sql ====================
CREATE OR REPLACE FUNCTION public.get_admin_stats(p_year integer DEFAULT NULL::integer)
 RETURNS json
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  result json;
begin
  if not public.is_admin() then
    return json_build_object('ok', false, 'error', 'NOT_AUTHORIZED');
  end if;

  select json_build_object(
    'ok', true,
    'year', p_year,
    'total_reports',    count(*),
    'lost_reports',     count(*) filter (where type = 'lost'),
    'found_reports',    count(*) filter (where type = 'found'),
    'resolved',         count(*) filter (where status = 'resolved'),
    'unresolved',       count(*) filter (where status in ('open', 'matched')),
    'resolution_rate',  case when count(*) = 0 then 0
                        else round(100.0 * count(*) filter (where status = 'resolved') / count(*), 1)
                        end
  )
  into result
  from public.reports
  where p_year is null or extract(year from created_at) = p_year;

  return result;
end;
$function$
;

-- ==================== 07_function_get_available_years.sql ====================
CREATE OR REPLACE FUNCTION public.get_available_years()
 RETURNS TABLE(year integer)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select distinct extract(year from created_at)::int
  from public.reports
  order by 1 desc;
$function$
;

-- ==================== 07_function_get_stats_by_category.sql ====================
CREATE OR REPLACE FUNCTION public.get_stats_by_category(p_year integer DEFAULT NULL::integer)
 RETURNS TABLE(category_ar text, category_en text, total bigint, resolved bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then
    raise exception 'NOT_AUTHORIZED';
  end if;

  return query
  select c.name_ar, c.name_en,
         count(r.id),
         count(r.id) filter (where r.status = 'resolved')
  from public.categories c
  left join public.reports r
    on r.category_id = c.id
   and (p_year is null or extract(year from r.created_at) = p_year)
  group by c.id, c.name_ar, c.name_en
  order by count(r.id) desc;
end;
$function$
;

-- ==================== 07_function_get_stats_by_location.sql ====================
CREATE OR REPLACE FUNCTION public.get_stats_by_location(p_year integer DEFAULT NULL::integer)
 RETURNS TABLE(location_ar text, location_en text, total bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then
    raise exception 'NOT_AUTHORIZED';
  end if;

  return query
  select l.name_ar, l.name_en, count(r.id)
  from public.locations l
  left join public.reports r
    on r.location_id = l.id
   and (p_year is null or extract(year from r.created_at) = p_year)
  group by l.id, l.name_ar, l.name_en
  order by count(r.id) desc;
end;
$function$
;

-- ==================== 07_function_get_stats_monthly.sql ====================
CREATE OR REPLACE FUNCTION public.get_stats_monthly(p_year integer)
 RETURNS TABLE(month integer, total bigint, resolved bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if not public.is_admin() then
    raise exception 'NOT_AUTHORIZED';
  end if;

  return query
  select extract(month from r.created_at)::int,
         count(*),
         count(*) filter (where r.status = 'resolved')
  from public.reports r
  where extract(year from r.created_at) = p_year
  group by 1
  order by 1;
end;
$function$
;

-- ==================== 07_function_handle_new_user.sql ====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_user_type public.user_type_enum;
begin
  v_user_type := coalesce((new.raw_user_meta_data ->> 'user_type')::public.user_type_enum, 'student');

  insert into public.profiles (
    id, full_name, university_id, user_type, phone, internal_email, role
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'مستخدم'),
    coalesce(new.raw_user_meta_data ->> 'university_id', ''),
    v_user_type,
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    new.email,
    (case when v_user_type = 'staff' then 'admin' else 'user' end)::public.user_role_enum
  )
  on conflict (id) do nothing;

  return new;
end;
$function$
;

-- ==================== 07_function_in_conversation.sql ====================
CREATE OR REPLACE FUNCTION public.in_conversation(p_conv_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.conversations
    where id = p_conv_id
      and (user_a_id = auth.uid() or user_b_id = auth.uid())
  );
$function$
;

-- ==================== 07_function_is_admin.sql ====================
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$function$
;

-- ==================== 07_function_notify_new_message.sql ====================
CREATE OR REPLACE FUNCTION public.notify_new_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_recipient uuid;
begin
  select case when user_a_id = new.sender_id then user_b_id else user_a_id end
  into v_recipient
  from public.conversations
  where id = new.conversation_id;

  if v_recipient is not null then
    insert into public.notifications (user_id, type, title_ar, title_en)
    values (v_recipient, 'new_message', 'لديك رسالة جديدة', 'You have a new message');
  end if;

  return new;
end;
$function$
;

-- ==================== 07_function_owns_report.sql ====================
CREATE OR REPLACE FUNCTION public.owns_report(p_report_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1 from public.reports
    where id = p_report_id and user_id = auth.uid()
  );
$function$
;

-- ==================== 07_function_phash_hamming.sql ====================
CREATE OR REPLACE FUNCTION public.phash_hamming(a text, b text)
 RETURNS integer
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
declare
  i    int;
  diff int := 0;
  bx   bit(4);
  bz   bit(4);
begin
  if a is null or b is null or length(a) <> length(b) then
    return null;
  end if;

  for i in 1..length(a) loop
    bx := ('x' || substr(a, i, 1))::bit(4);
    bz := ('x' || substr(b, i, 1))::bit(4);
    diff := diff + length(replace((bx # bz)::text, '0', ''));
  end loop;

  return diff;
end;
$function$
;

-- ==================== 07_function_resolve_match.sql ====================
CREATE OR REPLACE FUNCTION public.resolve_match(p_match_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  m record;
begin
  select * into m from public.matches where id = p_match_id;
  if m is null then
    return json_build_object('ok', false, 'error', 'MATCH_NOT_FOUND');
  end if;

  if not (public.owns_report(m.lost_report_id) or public.owns_report(m.found_report_id)) then
    return json_build_object('ok', false, 'error', 'NOT_AUTHORIZED');
  end if;

  if m.claim_status <> 'approved' then
    return json_build_object('ok', false, 'error', 'NOT_APPROVED');
  end if;

  update public.reports
  set status = 'resolved'
  where id in (m.lost_report_id, m.found_report_id);

  update public.conversations
  set status = 'closed'
  where match_id = p_match_id;

  return json_build_object('ok', true, 'status', 'resolved');
end;
$function$
;

-- ==================== 07_function_respond_to_claim.sql ====================
CREATE OR REPLACE FUNCTION public.respond_to_claim(p_match_id uuid, p_approve boolean)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  m        record;
  v_conv   uuid;
  v_user_a uuid;
  v_user_b uuid;
begin
  select * into m from public.matches where id = p_match_id;
  if m is null then
    return json_build_object('ok', false, 'error', 'MATCH_NOT_FOUND');
  end if;

  if m.claim_status <> 'claimed' then
    return json_build_object('ok', false, 'error', 'NOT_CLAIMED');
  end if;

  -- الرد يكون من الطرف الآخر فقط (ليس مقدّم الادعاء)
  if m.claimed_by = auth.uid() then
    return json_build_object('ok', false, 'error', 'CANNOT_RESPOND_OWN_CLAIM');
  end if;

  if not (public.owns_report(m.lost_report_id) or public.owns_report(m.found_report_id)) then
    return json_build_object('ok', false, 'error', 'NOT_AUTHORIZED');
  end if;

  if not p_approve then
    update public.matches
    set claim_status = 'rejected', responded_at = now()
    where id = p_match_id;

    insert into public.notifications (user_id, type, title_ar, title_en, match_id)
    values (m.claimed_by, 'claim_rejected',
            'لم تتم الموافقة على طلبك',
            'Your claim was not approved',
            p_match_id);

    return json_build_object('ok', true, 'status', 'rejected');
  end if;

  -- ---------- الموافقة ----------
  update public.matches
  set claim_status = 'approved', responded_at = now()
  where id = p_match_id;

  select user_id into v_user_a from public.reports where id = m.lost_report_id;
  select user_id into v_user_b from public.reports where id = m.found_report_id;

  insert into public.conversations (match_id, user_a_id, user_b_id)
  values (p_match_id, v_user_a, v_user_b)
  on conflict (match_id) do nothing
  returning id into v_conv;

  insert into public.notifications (user_id, type, title_ar, title_en, match_id)
  values (m.claimed_by, 'claim_approved',
          'تمت الموافقة — يمكنك الآن التواصل',
          'Your claim was approved — you can now chat',
          p_match_id);

  return json_build_object('ok', true, 'status', 'approved', 'conversation_id', v_conv);
end;
$function$
;

-- ==================== 07_function_run_auto_matching.sql ====================
CREATE OR REPLACE FUNCTION public.run_auto_matching()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  threshold constant numeric := 55;
  cand      record;
  s         record;
  v_lost    uuid;
  v_found   uuid;
  v_match   uuid;
begin
  for cand in
    select id, user_id
    from public.reports
    where type        <> new.type
      and category_id  = new.category_id
      and status in ('open', 'matched')
      and id          <> new.id
      and abs(event_date - new.event_date) <= 60
  loop
    select * into s from public.calculate_match_score(new.id, cand.id);

    if s.total_score >= threshold then

      if new.type = 'lost' then
        v_lost := new.id;  v_found := cand.id;
      else
        v_lost := cand.id; v_found := new.id;
      end if;

      insert into public.matches (
        lost_report_id, found_report_id,
        score_text, score_image, score_location, score_time, total_score
      )
      values (
        v_lost, v_found,
        s.score_text, s.score_image, s.score_location, s.score_time, s.total_score
      )
      on conflict (lost_report_id, found_report_id) do nothing
      returning id into v_match;

      if v_match is not null then
        -- تحديث حالة البلاغين
        update public.reports set status = 'matched'
        where id in (v_lost, v_found) and status = 'open';

        -- إشعار للطرفين
        insert into public.notifications (user_id, type, title_ar, title_en, match_id, report_id)
        values
          (new.user_id,  'new_match',
           'يوجد بلاغ مشابه لبلاغك',  'A possible match was found for your report',
           v_match, new.id),
          (cand.user_id, 'new_match',
           'يوجد بلاغ مشابه لبلاغك',  'A possible match was found for your report',
           v_match, cand.id);
      end if;

    end if;
  end loop;

  return new;
end;
$function$
;

-- ==================== 07_function_shares_approved_match.sql ====================
CREATE OR REPLACE FUNCTION public.shares_approved_match(p_other_user uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.matches m
    join public.reports r1 on r1.id in (m.lost_report_id, m.found_report_id)
    join public.reports r2 on r2.id in (m.lost_report_id, m.found_report_id)
    where m.claim_status = 'approved'
      and r1.user_id = auth.uid()
      and r2.user_id = p_other_user
      and r1.id <> r2.id
  );
$function$
;

-- ==================== 07_function_touch_updated_at.sql ====================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at := now();
  return new;
end;
$function$
;

-- ==================== 09_triggers.sql ====================
CREATE TRIGGER trg_messages_notify AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION notify_new_message();
CREATE TRIGGER trg_profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_reports_matching AFTER INSERT ON public.reports FOR EACH ROW EXECUTE FUNCTION run_auto_matching();
CREATE TRIGGER trg_reports_refno BEFORE INSERT ON public.reports FOR EACH ROW EXECUTE FUNCTION generate_reference_no();
CREATE TRIGGER trg_reports_touch BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ==================== 10_rls_policies.sql ====================
alter table public.categories enable row level security;
alter table public.conversations enable row level security;
alter table public.locations enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.profiles enable row level security;
alter table public.reports enable row level security;

create policy categories_select on public.categories as permissive for select to public
  using (true);

create policy conversations_select on public.conversations as permissive for select to public
  using (((user_a_id = auth.uid()) OR (user_b_id = auth.uid())));

create policy locations_select on public.locations as permissive for select to public
  using (true);

create policy matches_select on public.matches as permissive for select to public
  using ((owns_report(lost_report_id) OR owns_report(found_report_id) OR is_admin()));

create policy messages_insert on public.messages as permissive for insert to public
  with check (((sender_id = auth.uid()) AND in_conversation(conversation_id) AND (EXISTS ( SELECT 1
   FROM conversations
  WHERE ((conversations.id = messages.conversation_id) AND (conversations.status = 'active'::conversation_status_enum))))));

create policy messages_select on public.messages as permissive for select to public
  using (in_conversation(conversation_id));

create policy messages_update on public.messages as permissive for update to public
  using (in_conversation(conversation_id));

create policy notifications_select on public.notifications as permissive for select to public
  using ((user_id = auth.uid()));

create policy notifications_update on public.notifications as permissive for update to public
  using ((user_id = auth.uid()))
  with check ((user_id = auth.uid()));

create policy profiles_insert on public.profiles as permissive for insert to public
  with check ((id = auth.uid()));

create policy profiles_select on public.profiles as permissive for select to public
  using (((id = auth.uid()) OR is_admin() OR shares_approved_match(id)));

create policy profiles_update on public.profiles as permissive for update to public
  using ((id = auth.uid()))
  with check ((id = auth.uid()));

create policy reports_delete on public.reports as permissive for delete to public
  using (((user_id = auth.uid()) AND (status = 'open'::report_status_enum)));

create policy reports_insert on public.reports as permissive for insert to public
  with check ((user_id = auth.uid()));

create policy reports_select on public.reports as permissive for select to public
  using (((user_id = auth.uid()) OR is_admin() OR can_view_report(id)));

create policy reports_update on public.reports as permissive for update to public
  using ((user_id = auth.uid()))
  with check ((user_id = auth.uid()));

-- ==================== 11_storage.sql ====================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('report-images', 'report-images', 'f', null, NULL) on conflict (id) do nothing;

create policy storage_delete on storage.objects as permissive for delete to authenticated
  using (((bucket_id = 'report-images'::text) AND (owner = auth.uid())));

create policy storage_read on storage.objects as permissive for select to authenticated
  using ((bucket_id = 'report-images'::text));

create policy storage_upload on storage.objects as permissive for insert to authenticated
  with check ((bucket_id = 'report-images'::text));

-- ==================== 12_realtime.sql ====================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;

-- ==================== 99_auth_trigger.sql ====================
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();
