-- Le bootstrap "premier compte créé = admin" n'a plus lieu d'être une fois le
-- compte admin réel en place : le désactiver empêche qu'un compte créé plus
-- tard (ex. si la ligne admin était un jour supprimée) obtienne le rôle
-- automatiquement.
DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
DROP FUNCTION IF EXISTS public.grant_first_user_admin();
