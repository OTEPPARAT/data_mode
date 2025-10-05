
-- Users table - ข้อมูลผู้ใช้/สมาชิก
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company_name TEXT,
  company_address TEXT,
  tax_id TEXT,
  is_verified BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  verification_token TEXT,
  reset_password_token TEXT,
  reset_password_expires DATETIME,
  last_login_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages table - ข้อมูลแพ็คเกจบริการ
CREATE TABLE packages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  package_type TEXT NOT NULL, -- 'one_time' หรือ 'monthly'
  price_min INTEGER NOT NULL, -- ราคาต่ำสุดในสตางค์
  price_max INTEGER NOT NULL, -- ราคาสูงสุดในสตางค์ 
  duration_days INTEGER, -- ระยะเวลาการวิเคราะห์ (วัน)
  features TEXT, -- JSON array ของ features
  data_sources TEXT, -- JSON array ของแหล่งข้อมูลที่เข้าถึงได้
  is_active BOOLEAN DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table - คำสั่งซื้อ
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  package_id INTEGER NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  order_type TEXT NOT NULL, -- 'one_time' หรือ 'subscription'
  status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'completed', 'cancelled', 'refunded'
  amount INTEGER NOT NULL, -- จำนวนเงินในสตางค์
  currency TEXT DEFAULT 'THB',
  project_title TEXT, -- ชื่อโครงการ (สำหรับ one-time)
  project_description TEXT, -- รายละเอียดโครงการ
  requirements TEXT, -- ความต้องการเฉพาะ
  deadline_date DATE, -- วันที่ต้องการผลลัพธ์
  notes TEXT, -- หมายเหตุเพิ่มเติม
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table - การสมัครรายเดือน
CREATE TABLE subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  package_id INTEGER NOT NULL,
  order_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'cancelled', 'expired'
  start_date DATE NOT NULL,
  end_date DATE,
  next_billing_date DATE,
  monthly_amount INTEGER NOT NULL, -- จำนวนเงินรายเดือนในสตางค์
  auto_renew BOOLEAN DEFAULT 1,
  cancelled_at DATETIME,
  cancelled_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table - การชำระเงิน
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  subscription_id INTEGER,
  payment_method TEXT, -- 'credit_card', 'bank_transfer', 'promptpay', 'cash'
  payment_provider TEXT, -- 'stripe', 'omise', 'scb_easy', etc.
  transaction_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'THB',
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  paid_at DATETIME,
  refunded_at DATETIME,
  refund_amount INTEGER,
  payment_data TEXT, -- JSON data จาก payment gateway
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table - ใบแจ้งหนี้
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  order_id INTEGER,
  subscription_id INTEGER,
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal INTEGER NOT NULL,
  tax_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  payment_id INTEGER,
  issued_at DATETIME,
  paid_at DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table - โครงการวิเคราะห์ข้อมูล
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  order_id INTEGER NOT NULL,
  package_id INTEGER NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'review', 'completed', 'delivered', 'cancelled'
  assigned_to TEXT, -- ผู้รับผิดชาบโครงการ
  started_at DATETIME,
  completed_at DATETIME,
  delivered_at DATETIME,
  progress_percentage INTEGER DEFAULT 0,
  result_files TEXT, -- JSON array ของไฟล์ผลลัพธ์
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usage logs table - บันทึกการใช้งาน
CREATE TABLE usage_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER,
  project_id INTEGER,
  action TEXT NOT NULL, -- 'login', 'download_report', 'request_analysis', etc.
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_usage_logs_user_id ON usage_logs(user_id);
