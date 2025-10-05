
-- Insert basic packages data
INSERT OR IGNORE INTO packages (id, name, description, package_type, price_min, price_max, duration_days, features, data_sources, is_active, display_order) VALUES
(1, 'Smart Researcher', 'สืบค้นข้อมูลพื้นฐานและวิเคราะห์แนวโน้มเบื้องต้น', 'one_time', 2000000, 4000000, 2, '["สืบค้นข้อมูลพื้นฐาน", "สรุปประเด็นสำคัญ", "วิเคราะห์แนวโน้มเบื้องต้น"]', '["ข้อมูลสาธารณะทั่วไป", "บทความวิชาการเปิดเผย"]', 1, 1),
(2, 'Data Commander', 'วิเคราะห์เชิงลึกและสร้างโมเดลทำนาย', 'one_time', 4500000, 7500000, 4, '["วิเคราะห์เชิงลึก", "สร้างโมเดลทำนาย", "เปรียบเทียบคู่แข่ง"]', '["ฐานข้อมูลเฉพาะทาง", "รายงานอุตสาหกรรม", "ข้อมูลคู่แข่ง"]', 1, 2),
(3, 'Intelligence Prime', 'วิเคราะห์เชิงยุทธศาสตร์และเจาะลึกระดับผู้เชี่ยวชาญ', 'one_time', 7500000, 25000000, 7, '["วิเคราะห์เชิงยุทธศาสตร์", "เจาะลึกระดับผู้เชี่ยวชาญ", "สร้างโมเดลผลกระทบ"]', '["ฐานข้อมูลทั่วโลก", "ข้อมูลไม่เปิดเผย", "บทวิเคราะห์ระดับสูง"]', 1, 3),
(4, 'Trend Observer', 'ติดตามแนวโน้มต่อเนื่องรายเดือน', 'monthly', 2500000, 9500000, 30, '["ติดตามแนวโน้มต่อเนื่อง", "แจ้งเตือนการเปลี่ยนแปลง", "รายงานอัตโนมัติ"]', '["ข้อมูลระยะยาว", "แนวโน้มอุตสาหกรรม", "รายงานประจำ"]', 1, 4),
(5, 'Visual Insights', 'สร้างการวิเคราะห์ภาพและแดชบอร์ดโต้ตอบ', 'one_time', 5000000, 15000000, 5, '["สร้างการวิเคราะห์ภาพ", "แดชบอร์ดโต้ตอบ", "นำเสนอข้อมูลระดับมืออาชีพ"]', '["ข้อมูลเชิงลึก", "ภาพและกราฟิก", "รายงานโต้ตอบได้"]', 1, 5);

-- Insert a test user
INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, company_name, member_id, is_verified, is_active) VALUES
(1, 'test@example.com', 'dGVzdA==', 'สมชาย', 'ใจดี', '0812345678', 'บริษัท ตัวอย่าง จำกัด', 'DM00000001', 1, 1);

-- Insert some test orders
INSERT OR IGNORE INTO orders (id, user_id, package_id, order_number, order_type, status, amount, project_title, project_description, created_at) VALUES
(1, 1, 3, 'ORD-TEST-001', 'one_time', 'confirmed', 15000000, 'การวิเคราะห์ตลาดอสังหาริมทรัพย์', 'วิเคราะห์แนวโน้มตลาดอสังหาริมทรัพย์ในกรุงเทพฯ และปริมณฑล', '2024-10-01 10:00:00'),
(2, 1, 1, 'ORD-TEST-002', 'one_time', 'processing', 3000000, 'การศึกษาพฤติกรรมผู้บริโภค', 'ศึกษาพฤติกรรมการซื้อสินค้าออนไลน์ของคนไทย', '2024-10-02 14:30:00');

-- Insert corresponding projects
INSERT OR IGNORE INTO projects (id, user_id, order_id, package_id, project_title, project_description, status, progress_percentage, created_at) VALUES
(1, 1, 1, 3, 'การวิเคราะห์ตลาดอสังหาริมทรัพย์', 'วิเคราะห์แนวโน้มตลาดอสังหาริมทรัพย์ในกรุงเทพฯ และปริมณฑล', 'in_progress', 75, '2024-10-01 10:00:00'),
(2, 1, 2, 1, 'การศึกษาพฤติกรรมผู้บริโภค', 'ศึกษาพฤติกรรมการซื้อสินค้าออนไลน์ของคนไทย', 'pending', 25, '2024-10-02 14:30:00');
