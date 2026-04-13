-- ============================================================
-- Mymiso Database Schema
-- Migration 00004: Add admin role to profiles
-- ============================================================

-- Expand the role check constraint to include 'admin'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('buyer', 'seller', 'both', 'admin'));

-- Security definer function to check admin status
-- Bypasses RLS to avoid circular reference on profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Admin RLS: allow admins full access across key tables
CREATE POLICY "Admin full access profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access sellers" ON public.sellers
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access products" ON public.products
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access orders" ON public.orders
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access order_items" ON public.order_items
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access categories" ON public.categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access notifications" ON public.notifications
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access conversations" ON public.conversations
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access messages" ON public.messages
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access review_replies" ON public.review_replies
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin full access review_helpful_votes" ON public.review_helpful_votes
  FOR ALL USING (public.is_admin());
