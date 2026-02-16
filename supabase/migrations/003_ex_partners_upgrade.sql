-- ============================================
-- Ex Partners table upgrade
-- Add style_answers (jsonb) and good_points (text)
-- Make satisfaction_score nullable (deprecated)
-- ============================================

-- Add new columns
alter table ex_partners add column if not exists style_answers jsonb default '{}';
alter table ex_partners add column if not exists good_points text;
alter table ex_partners add column if not exists conflict_detail text;

-- Make satisfaction_score nullable (keeping column for backward compat)
alter table ex_partners alter column satisfaction_score drop not null;
alter table ex_partners alter column satisfaction_score set default 5;
