/*
  # Fix RLS Policies for Signup
  
  ## Issue
  Users cannot create their profiles during signup because RLS policies are too restrictive.
  
  ## Changes
  
  1. **profiles table** - Allow authenticated users to insert their own profile
  2. **user_roles table** - Allow authenticated users to insert their own role during signup
  3. **doctors table** - Allow authenticated users to insert their own doctor profile
  
  ## Security Notes
  
  - All policies check that auth.uid() = user_id to ensure users can only create their own data
  - These policies are safe because they only allow self-insertion
  - Staff permissions remain unchanged
*/

-- Drop and recreate profiles INSERT policy to ensure it works
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Drop and recreate user_roles INSERT policy to ensure it works
DROP POLICY IF EXISTS "Users can insert own roles" ON public.user_roles;
CREATE POLICY "Users can insert own roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Drop and recreate doctors INSERT policy to ensure it works
DROP POLICY IF EXISTS "Doctors can insert own profile" ON public.doctors;
CREATE POLICY "Doctors can insert own profile"
  ON public.doctors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);