-- Create bookings table to track product availability
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read bookings (to check availability)
CREATE POLICY "Anyone can view bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Allow anyone to create bookings (for now, until we add authentication)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance on date range queries
CREATE INDEX idx_bookings_dates ON public.bookings(product_id, start_date, end_date);

-- Create a function to check product availability
CREATE OR REPLACE FUNCTION public.check_availability(
  p_product_id TEXT,
  p_start_date DATE,
  p_end_date DATE,
  p_quantity INTEGER
)
RETURNS TABLE (
  available BOOLEAN,
  max_available INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_booked INTEGER;
  product_stock INTEGER;
BEGIN
  -- Get total stock for product (hardcoded for now, can be moved to a products table later)
  product_stock := CASE 
    WHEN p_product_id = '2' THEN 20  -- Statafel wit
    ELSE 999  -- Default high number for other products
  END;

  -- Calculate total booked quantity for overlapping dates
  SELECT COALESCE(SUM(quantity), 0) INTO total_booked
  FROM public.bookings
  WHERE product_id = p_product_id
    AND status != 'cancelled'
    AND (
      (start_date <= p_end_date AND end_date >= p_start_date)
    );

  -- Return availability status and max available quantity
  RETURN QUERY SELECT 
    (product_stock - total_booked) >= p_quantity as available,
    (product_stock - total_booked) as max_available;
END;
$$;