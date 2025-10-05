
-- เพิ่มข้อมูลผู้ใช้ทดสอบ
INSERT INTO users (email, password_hash, first_name, last_name, phone, company_name, member_id, is_verified, is_active)
VALUES 
('test@example.com', 'dGVzdDEyMzQ=', 'ผู้ทดสอบ', 'ระบบ', '0812345678', 'บริษัทตัวอย่าง จำกัด', 'DM00000001', 1, 1),
('demo@datamode.com', 'ZGVtbzEyMzQ=', 'Demo', 'User', '0987654321', 'DATA MODE Demo', 'DM00000002', 1, 1);

-- เพิ่มคำสั่งซื้อทดสอบ
INSERT INTO orders (user_id, package_id, order_number, order_type, status, amount, project_title, project_description, requirements, notes)
VALUES 
(1, 1, 'ORD-1727902001000', 'one_time', 'paid', 2500000, 'การวิเคราะห์ตลาดอสังหาริมทรัพย์', 'วิเคราะห์แนวโน้มตลาดอสังหาริมทรัพย์ในกรุงเทพฯ และปริมณฑล', 'มุ่งเน้นคอนโดมิเนียมราคาต่ำกว่า 5 ล้านบาท', 'ต้องการข้อมูลล่าสุดในช่วง 6 เดือนที่ผ่านมา'),
(1, 3, 'ORD-1727902002000', 'one_time', 'processing', 8500000, 'วิเคราะห์คู่แข่งธุรกิจ E-commerce', 'วิเคราะห์เชิงลึกเกี่ยวกับคู่แข่งในตลาด E-commerce ไทย', 'เปรียบเทียบ 5 ผู้เล่นหลักในตลาด', NULL),
(2, 4, 'ORD-1727902003000', 'subscription', 'active', 5500000, 'ติดตามแนวโน้มเทคโนโลยี AI', 'บริการติดตามแนวโน้มเทคโนโลยี AI ในอุตสาหกรรมต่างๆ', 'รายงานประจำเดือนพร้อมแจ้งเตือนการเปลี่ยนแปลงสำคัญ', 'ต้องการรายงานเป็นภาษาไทยและอังกฤษ');

-- เพิ่มโครงการทดสอบ
INSERT INTO projects (user_id, order_id, package_id, project_title, project_description, status, progress_percentage, started_at)
VALUES 
(1, 1, 1, 'การวิเคราะห์ตลาดอสังหาริมทรัพย์', 'วิเคราะห์แนวโน้มตลาดอสังหาริมทรัพย์ในกรุงเทพฯ และปริมณฑล', 'completed', 100, '2025-10-01 10:00:00'),
(1, 2, 3, 'วิเคราะห์คู่แข่งธุรกิจ E-commerce', 'วิเคราะห์เชิงลึกเกี่ยวกับคู่แข่งในตลาด E-commerce ไทย', 'in_progress', 65, '2025-10-01 14:30:00'),
(2, 3, 4, 'ติดตามแนวโน้มเทคโนโลยี AI', 'บริการติดตามแนวโน้มเทคโนโลยี AI ในอุตสาหกรรมต่างๆ', 'in_progress', 30, '2025-10-02 09:15:00');
