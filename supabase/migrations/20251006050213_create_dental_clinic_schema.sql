/*
  # Dental Clinic Database Schema
  
  This migration creates the complete database schema for the dental clinic management system.
  
  ## Tables Created
  
  1. **profiles** - User profile information
     - `id` (uuid, primary key)
     - `user_id` (uuid, references auth.users)
     - `full_name` (text)
     - `phone` (text, optional)
     - `date_of_birth` (date, optional)
     - `address` (text, optional)
     - Timestamps (created_at, updated_at)
  
  2. **user_roles** - Role assignments for users
     - `id` (uuid, primary key)
     - `user_id` (uuid, references auth.users)
     - `role` (enum: patient, doctor, clerk_admin)
     - Unique constraint on (user_id, role)
  
  3. **doctors** - Additional information for doctors
     - `id` (uuid, primary key)
     - `user_id` (uuid, references auth.users)
     - `specialization` (text)
     - `license_number` (text)
     - `years_of_experience` (integer, optional)
     - `bio` (text, optional)
     - `available` (boolean, default true)
  
  4. **patient_records** - Electronic patient records (EPR)
     - Medical history, allergies, medications, treatments
     - Physical metrics (height, weight, BMI)
     - Emergency contact information
  
  5. **appointments** - Appointment scheduling
     - Links patients with doctors
     - Status tracking (pending, confirmed, completed, cancelled)
  
  6. **billing** - Billing and invoicing
     - Links to appointments
     - Payment status tracking
     - Auto-generated invoice numbers
  
  7. **products** - Dental products for sale
     - Product catalog with pricing and inventory
  
  8. **cart** - Shopping cart
     - User product selections
  
  9. **orders** - Order management
     - Order tracking with auto-generated order numbers
  
  10. **order_items** - Individual items in orders
  
  11. **chat_messages** - Internal messaging system
      - Communication between users
  
  12. **audit_logs** - System audit trail
      - Tracks all important actions
  
  ## Security
  
  - Row Level Security (RLS) enabled on all tables
  - Policies ensure patients can only access their own data
  - Staff (doctors and clerks) have appropriate access to patient data
  - Admins can manage all data
  
  ## Important Notes
  
  1. All tables use UUIDs for primary keys
  2. Foreign keys cascade on delete where appropriate
  3. Timestamps are automatically managed via triggers
  4. BMI is auto-calculated from height and weight
  5. Invoice and order numbers are auto-generated
*/

-- Create enums for type safety
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'clerk_admin');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'cancelled');
  END IF;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, role)
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  specialization TEXT NOT NULL,
  license_number TEXT NOT NULL,
  years_of_experience INTEGER,
  bio TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create patient_records table
CREATE TABLE IF NOT EXISTS public.patient_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dental_history TEXT,
  allergies TEXT,
  current_medications TEXT,
  treatments TEXT,
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  bmi DECIMAL(5,2),
  blood_type TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status DEFAULT 'pending' NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create billing table
CREATE TABLE IF NOT EXISTS public.billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
  payment_status payment_status DEFAULT 'pending' NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  paid_at TIMESTAMPTZ
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0 NOT NULL,
  category TEXT,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Create cart table
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
CREATE POLICY "Staff can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

-- RLS Policies for user_roles table
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own roles" ON public.user_roles;
CREATE POLICY "Users can insert own roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'clerk_admin'));

-- RLS Policies for doctors table
DROP POLICY IF EXISTS "Everyone can view active doctors" ON public.doctors;
CREATE POLICY "Everyone can view active doctors"
  ON public.doctors FOR SELECT
  TO authenticated
  USING (available = true);

DROP POLICY IF EXISTS "Doctors can insert own profile" ON public.doctors;
CREATE POLICY "Doctors can insert own profile"
  ON public.doctors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Doctors can update own profile" ON public.doctors;
CREATE POLICY "Doctors can update own profile"
  ON public.doctors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage doctors" ON public.doctors;
CREATE POLICY "Admins can manage doctors"
  ON public.doctors FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'clerk_admin'));

-- RLS Policies for patient_records table
DROP POLICY IF EXISTS "Patients can view own records" ON public.patient_records;
CREATE POLICY "Patients can view own records"
  ON public.patient_records FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Staff can view all patient records" ON public.patient_records;
CREATE POLICY "Staff can view all patient records"
  ON public.patient_records FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

DROP POLICY IF EXISTS "Staff can insert patient records" ON public.patient_records;
CREATE POLICY "Staff can insert patient records"
  ON public.patient_records FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

DROP POLICY IF EXISTS "Staff can update patient records" ON public.patient_records;
CREATE POLICY "Staff can update patient records"
  ON public.patient_records FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

DROP POLICY IF EXISTS "Staff can delete patient records" ON public.patient_records;
CREATE POLICY "Staff can delete patient records"
  ON public.patient_records FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

-- RLS Policies for appointments table
DROP POLICY IF EXISTS "Patients can view own appointments" ON public.appointments;
CREATE POLICY "Patients can view own appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Doctors can view assigned appointments" ON public.appointments;
CREATE POLICY "Doctors can view assigned appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id);

DROP POLICY IF EXISTS "Staff can view all appointments" ON public.appointments;
CREATE POLICY "Staff can view all appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

DROP POLICY IF EXISTS "Staff can manage all appointments" ON public.appointments;
CREATE POLICY "Staff can manage all appointments"
  ON public.appointments FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

-- RLS Policies for billing table
DROP POLICY IF EXISTS "Patients can view own billing" ON public.billing;
CREATE POLICY "Patients can view own billing"
  ON public.billing FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Staff can manage all billing" ON public.billing;
CREATE POLICY "Staff can manage all billing"
  ON public.billing FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

-- RLS Policies for products table
DROP POLICY IF EXISTS "Everyone can view active products" ON public.products;
CREATE POLICY "Everyone can view active products"
  ON public.products FOR SELECT
  TO authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Staff can manage products" ON public.products;
CREATE POLICY "Staff can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

-- RLS Policies for cart table
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart;
CREATE POLICY "Users can view own cart"
  ON public.cart FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert to own cart" ON public.cart;
CREATE POLICY "Users can insert to own cart"
  ON public.cart FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cart" ON public.cart;
CREATE POLICY "Users can update own cart"
  ON public.cart FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from own cart" ON public.cart;
CREATE POLICY "Users can delete from own cart"
  ON public.cart FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for orders table
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view all orders" ON public.orders;
CREATE POLICY "Staff can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'doctor') OR 
    public.has_role(auth.uid(), 'clerk_admin')
  );

-- RLS Policies for order_items table
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert order items for own orders" ON public.order_items;
CREATE POLICY "Users can insert order items for own orders"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for chat_messages table
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;
CREATE POLICY "Users can view own messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can send messages" ON public.chat_messages;
CREATE POLICY "Users can send messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update own received messages" ON public.chat_messages;
CREATE POLICY "Users can update own received messages"
  ON public.chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- RLS Policies for audit_logs table
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'clerk_admin'));

-- Trigger function for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_patient_records_updated_at ON public.patient_records;
CREATE TRIGGER update_patient_records_updated_at
  BEFORE UPDATE ON public.patient_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-calculate BMI
CREATE OR REPLACE FUNCTION public.calculate_bmi()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.height_cm IS NOT NULL AND NEW.weight_kg IS NOT NULL AND NEW.height_cm > 0 THEN
    NEW.bmi := ROUND((NEW.weight_kg / ((NEW.height_cm / 100.0) * (NEW.height_cm / 100.0)))::NUMERIC, 2);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add BMI calculation trigger
DROP TRIGGER IF EXISTS calculate_patient_bmi ON public.patient_records;
CREATE TRIGGER calculate_patient_bmi
  BEFORE INSERT OR UPDATE ON public.patient_records
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_bmi();

-- Create sequences for auto-generated numbers
CREATE SEQUENCE IF NOT EXISTS billing_invoice_seq START 1;
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('billing_invoice_seq')::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;