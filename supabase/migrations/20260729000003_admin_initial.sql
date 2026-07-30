-- ============================================================
-- EFES « SAPIENTIA » — Initialisation du premier compte ADMIN
-- Migration : 20260729000003_admin_initial.sql
-- ============================================================
--
-- PROCÉDURE (important : ne pas skipper)
-- 1. Un(e) enseignant(e) ou admin crée son compte via le formulaire public
--    /inscription/compte (crée une ligne dans auth.users + un profile
--    ETUDIANT via le trigger handle_new_user).
-- 2. Dans le SQL Editor du dashboard Supabase, exécutez ce script.
--    - Par défaut, il promeut en ADMIN le compte dont l'e-mail est
--      'admin@efes-sapientia.bj'.
--    - Pour promouvoir un autre e-mail, exécutez d'abord :
--        set app.admin_email = 'vous@exemple.bj';
--      (variable de session, valide le temps de la requête), puis ce script.
-- 3. Idempotent : ré-exécutable sans effet si le compte n'existe pas encore
--    ou est déjà ADMIN. Aucune ligne n'est créée ; on ne fait que mettre à
--    jour le rôle et le flag actif du profile correspondant.
--
-- SÉCURITÉ : ce script ne crée PAS d'utilisateur auth.users ; il ne fait que
-- promouvoir un compte EXISTANT. La création du compte se fait via le flux
-- public d'inscription (Supabase Auth) pour respecter le flux normal.
-- ============================================================

do $$
declare
  v_email text := coalesce(current_setting('app.admin_email', true), 'admin@efes-sapientia.bj');
  v_user_id uuid;
begin
  -- Récupère l'id du user auth correspondant à l'e-mail cible (s'il existe).
  select id into v_user_id
  from auth.users
  where email = v_email
  limit 1;

  if v_user_id is not null then
    update public.profiles
    set role = 'ADMIN', actif = true
    where id = v_user_id
      and (role is distinct from 'ADMIN' or actif is distinct from true);
  end if;
end $$;

-- 'Exécutez dans le SQL Editor après avoir créé le compte via /inscription/compte.'
