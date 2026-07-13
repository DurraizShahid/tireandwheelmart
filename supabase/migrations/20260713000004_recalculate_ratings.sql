-- Recalculate all product ratings from approved reviews
-- This fixes products that had hardcoded seed ratings or were never recalculated

UPDATE public.products p
SET
  rating = COALESCE(agg.avg_rating, 0),
  review_count = COALESCE(agg.review_count, 0)
FROM (
  SELECT
    product_id,
    ROUND(AVG(rating)::numeric, 1) AS avg_rating,
    COUNT(*)::integer AS review_count
  FROM public.reviews
  WHERE is_approved = true
  GROUP BY product_id
) agg
WHERE p.id = agg.product_id;

-- Set products with no approved reviews to 0
UPDATE public.products
SET rating = 0, review_count = 0
WHERE id NOT IN (
  SELECT DISTINCT product_id FROM public.reviews WHERE is_approved = true
);

-- Fix testimonials: change default from 5 to 0 and allow 0 in check constraint
ALTER TABLE public.testimonials
  ALTER COLUMN rating SET DEFAULT 0;

ALTER TABLE public.testimonials
  DROP CONSTRAINT IF EXISTS testimonials_rating_check;

ALTER TABLE public.testimonials
  ADD CONSTRAINT testimonials_rating_check CHECK (rating >= 0 AND rating <= 5);

-- Update existing testimonials that have dummy 5-star ratings
UPDATE public.testimonials SET rating = 0 WHERE rating = 5;
